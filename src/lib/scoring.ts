import type { QuestionResult } from "./types";

const DIFFICULTY_POINTS: Record<number, number> = {
  1: 10,
  2: 15,
  3: 20,
  4: 25,
  5: 30,
  6: 35,
};

export function getPointsForDifficulty(difficulty: number): number {
  return DIFFICULTY_POINTS[difficulty] ?? 20;
}

export function calculateScore(results: QuestionResult[]): number {
  return results.filter((result) => result.correct).length;
}

export function calculatePoints(
  results: QuestionResult[],
  difficulties: number[]
): number {
  return results.reduce((total, result, index) => {
    if (!result.correct) return total;
    return total + getPointsForDifficulty(difficulties[index] ?? 3);
  }, 0);
}

export function buildShareText({
  quizNumber,
  score,
  totalQuestions,
  results,
  siteUrl,
}: {
  quizNumber: number;
  score: number;
  totalQuestions: number;
  results: QuestionResult[];
  siteUrl: string;
}): string {
  const grid = results.map((result) => (result.correct ? "🟩" : "🟥")).join("");
  return [
    `#PATOQUIZZ #${quizNumber} ${score}/${totalQuestions}`,
    grid,
    siteUrl,
  ].join("\n");
}
