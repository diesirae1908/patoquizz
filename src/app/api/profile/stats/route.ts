import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { QUESTIONS_PER_DAY } from "@/lib/game-config";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const guestId = searchParams.get("guestId");
    const supabase = await createClient();
    const admin = createAdminClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const query = admin
      .from("results")
      .select("score, points, quiz_date")
      .order("quiz_date", { ascending: true });

    const { data: results, error } = user
      ? await query.eq("user_id", user.id)
      : guestId
        ? await query.eq("guest_id", guestId)
        : { data: [], error: null };

    if (error) throw error;

    const gamesPlayed = results?.length ?? 0;
    const averageScore =
      gamesPlayed > 0
        ? (results!.reduce((sum, result) => sum + result.score, 0) / gamesPlayed)
        : 0;
    const totalPoints = results?.reduce((sum, result) => sum + result.points, 0) ?? 0;

    const distribution: Record<number, number> = Object.fromEntries(
      Array.from({ length: QUESTIONS_PER_DAY + 1 }, (_, i) => [i, 0])
    );

    for (const result of results ?? []) {
      distribution[result.score] = (distribution[result.score] ?? 0) + 1;
    }

    const { currentStreak, bestStreak } = calculateStreaks(results ?? []);

    let username: string | null = null;
    let collectionCount = 0;

    if (user) {
      const { data: profile } = await admin
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .maybeSingle();
      username = profile?.username ?? user.user_metadata?.username ?? null;

      const { count } = await admin
        .from("collected_departments")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      collectionCount = count ?? 0;
    } else if (guestId) {
      const { count } = await admin
        .from("collected_departments")
        .select("*", { count: "exact", head: true })
        .eq("guest_id", guestId);
      collectionCount = count ?? 0;
    }

    return NextResponse.json({
      games_played: gamesPlayed,
      average_score: Number(averageScore.toFixed(1)),
      total_points: totalPoints,
      current_streak: currentStreak,
      best_streak: bestStreak,
      distribution,
      username,
      collection_count: collectionCount,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}

function calculateStreaks(
  results: Array<{ score: number; quiz_date: string }>
): { currentStreak: number; bestStreak: number } {
  if (results.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  const sorted = [...results].sort((a, b) =>
    a.quiz_date.localeCompare(b.quiz_date)
  );

  let bestStreak = 0;
  let running = 0;

  for (const result of sorted) {
    if (result.score >= 4) {
      running += 1;
      bestStreak = Math.max(bestStreak, running);
    } else {
      running = 0;
    }
  }

  let currentStreak = 0;
  for (let i = sorted.length - 1; i >= 0; i -= 1) {
    if (sorted[i].score >= 4) {
      currentStreak += 1;
    } else {
      break;
    }
  }

  return { currentStreak, bestStreak };
}
