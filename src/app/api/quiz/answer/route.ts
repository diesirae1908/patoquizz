import { NextResponse } from "next/server";
import { isAnswerCorrect } from "@/lib/answer-checker";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { questionId, answer } = await request.json();

    if (!questionId || typeof answer !== "string") {
      return NextResponse.json(
        { error: "Requête invalide." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data: question, error } = await supabase
      .from("questions")
      .select("accepted_answers, display_answer")
      .eq("id", questionId)
      .single();

    if (error || !question) {
      return NextResponse.json(
        { error: "Question introuvable." },
        { status: 404 }
      );
    }

    const correct = isAnswerCorrect(answer, question.accepted_answers);

    return NextResponse.json({
      correct,
      displayAnswer: question.display_answer,
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
