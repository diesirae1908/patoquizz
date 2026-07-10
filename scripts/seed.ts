import { config } from "dotenv";
config({ path: ".env.local" });
import { createAdminClient } from "../src/lib/supabase/admin";
import {
  buildDailyQuizzes,
  generateAllQuestions,
} from "../src/lib/geography/question-generator";

const START_DATE = "2026-07-10";
const DAYS = 220;

async function seed() {
  const supabase = createAdminClient();

  console.log("Generating questions...");
  const questions = generateAllQuestions();
  console.log(`Generated ${questions.length} questions`);

  console.log("Clearing existing data...");
  await supabase.from("daily_quizzes").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("questions").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const batchSize = 200;
  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize).map((question) => ({
      id: question.id,
      text: question.text,
      accepted_answers: question.accepted_answers,
      display_answer: question.display_answer,
      difficulty: question.difficulty,
      category: question.category,
    }));

    const { error } = await supabase.from("questions").insert(batch);
    if (error) {
      throw new Error(`Failed to insert questions: ${error.message}`);
    }
    console.log(`Inserted questions ${i + 1}-${Math.min(i + batchSize, questions.length)}`);
  }

  const dailyQuizzes = buildDailyQuizzes(questions, START_DATE, DAYS);
  for (let i = 0; i < dailyQuizzes.length; i += batchSize) {
    const batch = dailyQuizzes.slice(i, i + batchSize);
    const { error } = await supabase.from("daily_quizzes").insert(batch);
    if (error) {
      throw new Error(`Failed to insert daily quizzes: ${error.message}`);
    }
    console.log(`Inserted daily quizzes ${i + 1}-${Math.min(i + batchSize, dailyQuizzes.length)}`);
  }

  console.log("Seed completed successfully.");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
