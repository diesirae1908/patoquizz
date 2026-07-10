import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getParisDateString } from "@/lib/dates";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") ?? "all";
    const supabase = createAdminClient();

    if (period === "today") {
      const today = getParisDateString();
      const { data, error } = await supabase
        .from("leaderboard_daily")
        .select("*")
        .eq("quiz_date", today)
        .order("points", { ascending: false })
        .order("score", { ascending: false })
        .limit(50);

      if (error) throw error;

      return NextResponse.json({
        entries: (data ?? []).map((entry, index) => ({
          rank: index + 1,
          username: entry.username,
          country: entry.country,
          points: entry.points,
          score: entry.score,
          streak: 0,
        })),
      });
    }

    const { data, error } = await supabase
      .from("leaderboard_all_time")
      .select("*")
      .order("total_points", { ascending: false })
      .order("total_score", { ascending: false })
      .limit(50);

    if (error) throw error;

    const entries = await Promise.all(
      (data ?? []).map(async (entry, index) => {
        const streak = await calculateStreak(
          supabase,
          entry.user_id,
          entry.guest_id
        );
        return {
          rank: index + 1,
          username: entry.username,
          country: entry.country,
          points: entry.total_points,
          score: entry.total_score,
          streak,
        };
      })
    );

    return NextResponse.json({ entries });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}

async function calculateStreak(
  supabase: ReturnType<typeof createAdminClient>,
  userId: string | null,
  guestId: string | null
): Promise<number> {
  const query = supabase
    .from("results")
    .select("quiz_date, score")
    .order("quiz_date", { ascending: false })
    .limit(60);

  const { data } = userId
    ? await query.eq("user_id", userId)
    : await query.eq("guest_id", guestId!);

  if (!data || data.length === 0) return 0;

  let streak = 0;
  for (const result of data) {
    if (result.score >= 4) {
      streak += 1;
    } else {
      break;
    }
  }
  return streak;
}
