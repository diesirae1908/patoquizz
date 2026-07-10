import { NextResponse } from "next/server";
import {
  calculatePointsBreakdown,
  calculateScore,
} from "@/lib/scoring";
import {
  getRegionColor,
  pickRandomUncollectedDepartment,
} from "@/lib/collection";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getParisDateString } from "@/lib/dates";
import {
  ANSWERS_WHEN_BANKED,
  MAGNET_REWARD_MIN_SCORE,
  QUESTIONS_PER_DAY,
} from "@/lib/game-config";
import type { JokerState, QuestionResult } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      guestId,
      answers,
      difficulties,
      jokerPlayed = false,
      jokerWon = null,
    } = body as {
      guestId?: string;
      answers: QuestionResult[];
      difficulties: number[];
      jokerPlayed?: boolean;
      jokerWon?: boolean | null;
    };

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Résultat invalide." },
        { status: 400 }
      );
    }

    const expectedCount = jokerPlayed ? QUESTIONS_PER_DAY : ANSWERS_WHEN_BANKED;
    if (answers.length !== expectedCount) {
      return NextResponse.json(
        { error: `Nombre de réponses invalide (${answers.length}/${expectedCount}).` },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const admin = createAdminClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const today = getParisDateString();

    const { data: quiz } = await admin
      .from("daily_quizzes")
      .select("quiz_number")
      .eq("quiz_date", today)
      .single();

    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz introuvable." },
        { status: 404 }
      );
    }

    const joker: JokerState = {
      played: jokerPlayed,
      won: jokerPlayed ? jokerWon : null,
    };

    const score = calculateScore(answers);
    const breakdown = calculatePointsBreakdown(answers, difficulties, joker);

    const payload = {
      user_id: user?.id ?? null,
      guest_id: user ? null : guestId ?? null,
      quiz_date: today,
      quiz_number: quiz.quiz_number,
      answers,
      score,
      points: breakdown.finalPoints,
      base_points: breakdown.subtotal,
      joker_played: joker.played,
      joker_won: joker.won,
      total_time_ms: breakdown.totalTimeMs,
      completed_at: new Date().toISOString(),
    };

    if (!payload.user_id && !payload.guest_id) {
      return NextResponse.json(
        { error: "Identifiant joueur manquant." },
        { status: 400 }
      );
    }

    const existingQuery = admin.from("results").select("id");
    const { data: existing } = payload.user_id
      ? await existingQuery.eq("user_id", payload.user_id).eq("quiz_date", today).maybeSingle()
      : await existingQuery.eq("guest_id", payload.guest_id!).eq("quiz_date", today).maybeSingle();

    let result;
    if (existing) {
      const { data, error } = await admin
        .from("results")
        .update(payload)
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await admin
        .from("results")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      result = data;
    }

    let reward = null;
    if (score >= MAGNET_REWARD_MIN_SCORE) {
      const ownedQuery = admin
        .from("collected_departments")
        .select("dept_code");

      const { data: owned } = payload.user_id
        ? await ownedQuery.eq("user_id", payload.user_id)
        : await ownedQuery.eq("guest_id", payload.guest_id!);

      const ownedCodes = (owned ?? []).map((item) => item.dept_code);
      const picked = pickRandomUncollectedDepartment(ownedCodes);

      if (picked) {
        const { data: existingDept } = payload.user_id
          ? await admin
              .from("collected_departments")
              .select("id")
              .eq("user_id", payload.user_id)
              .eq("dept_code", picked.code)
              .maybeSingle()
          : await admin
              .from("collected_departments")
              .select("id")
              .eq("guest_id", payload.guest_id!)
              .eq("dept_code", picked.code)
              .maybeSingle();

        if (!existingDept) {
          await admin.from("collected_departments").insert({
            user_id: payload.user_id,
            guest_id: payload.guest_id,
            dept_code: picked.code,
            dept_name: picked.name,
            region: picked.region,
            quiz_date: today,
          });

          reward = {
            dept_code: picked.code,
            dept_name: picked.name,
            region: picked.region,
            region_color: getRegionColor(picked.region),
            is_new: true,
          };
        }
      }
    }

    return NextResponse.json({
      score: result.score,
      points: result.points,
      quizNumber: result.quiz_number,
      breakdown,
      joker: {
        played: result.joker_played,
        won: result.joker_won,
      },
      reward,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
