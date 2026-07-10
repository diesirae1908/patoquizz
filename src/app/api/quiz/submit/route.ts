import { NextResponse } from "next/server";
import { calculatePoints, calculateScore } from "@/lib/scoring";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getParisDateString } from "@/lib/dates";
import type { QuestionResult } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { guestId, answers, difficulties } = body as {
      guestId?: string;
      answers: QuestionResult[];
      difficulties: number[];
    };

    if (!answers || !Array.isArray(answers) || answers.length !== 6) {
      return NextResponse.json(
        { error: "Résultat invalide." },
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

    const score = calculateScore(answers);
    const points = calculatePoints(answers, difficulties);

    const payload = {
      user_id: user?.id ?? null,
      guest_id: user ? null : guestId ?? null,
      quiz_date: today,
      quiz_number: quiz.quiz_number,
      answers,
      score,
      points,
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

    return NextResponse.json({
      score: result.score,
      points: result.points,
      quizNumber: result.quiz_number,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
