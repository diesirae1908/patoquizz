import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getParisDateString } from "@/lib/dates";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const today = getParisDateString();

    const { data: quiz, error: quizError } = await supabase
      .from("daily_quizzes")
      .select("*")
      .eq("quiz_date", today)
      .single();

    if (quizError || !quiz) {
      return NextResponse.json(
        { error: "Aucun quiz disponible pour aujourd'hui." },
        { status: 404 }
      );
    }

    const { data: questions, error: questionsError } = await supabase
      .from("questions")
      .select("id, text, difficulty, category")
      .in("id", quiz.question_ids);

    if (questionsError || !questions) {
      return NextResponse.json(
        { error: "Impossible de charger les questions." },
        { status: 500 }
      );
    }

    const orderedQuestions = quiz.question_ids
      .map((id: string) => questions.find((question) => question.id === id))
      .filter(Boolean);

    return NextResponse.json({
      quizDate: quiz.quiz_date,
      quizNumber: quiz.quiz_number,
      questions: orderedQuestions,
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
