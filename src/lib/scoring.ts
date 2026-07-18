import type { QuestionResult, JokerState } from "./types";
import {
  ANSWERS_WHEN_BANKED,
  QUESTIONS_PER_DAY,
} from "./game-config";

const BASE_POINTS: Record<number, number> = {
  1: 10,
  2: 15,
  3: 25,
  4: 35,
  5: 50,
  6: 70,
};

const SPEED_BONUS_MAX_RATIO = 0.5;
const SPEED_BONUS_FAST_MS = 6000;
const SPEED_BONUS_SLOW_MS = 20000;
const MAX_TIME_MS = 120000;

export function getBasePointsForDifficulty(difficulty: number): number {
  return BASE_POINTS[difficulty] ?? 25;
}

export function clampTimeMs(timeMs: number): number {
  return Math.min(MAX_TIME_MS, Math.max(0, timeMs));
}

export function getSpeedBonusRatio(timeMs: number): number {
  const clamped = clampTimeMs(timeMs);
  if (clamped <= SPEED_BONUS_FAST_MS) return SPEED_BONUS_MAX_RATIO;
  if (clamped >= SPEED_BONUS_SLOW_MS) return 0;
  const progress =
    (clamped - SPEED_BONUS_FAST_MS) /
    (SPEED_BONUS_SLOW_MS - SPEED_BONUS_FAST_MS);
  return SPEED_BONUS_MAX_RATIO * (1 - progress);
}

export function getQuestionPoints(
  difficulty: number,
  correct: boolean,
  timeMs: number
): { base: number; speedBonus: number; total: number } {
  if (!correct) return { base: 0, speedBonus: 0, total: 0 };
  const base = getBasePointsForDifficulty(difficulty);
  const speedBonus = Math.round(base * getSpeedBonusRatio(timeMs));
  return { base, speedBonus, total: base + speedBonus };
}

export interface PointsBreakdown {
  basePoints: number;
  speedBonus: number;
  subtotal: number;
  jokerMultiplier: number;
  finalPoints: number;
  totalTimeMs: number;
}

export function calculateScore(results: QuestionResult[]): number {
  return results.filter((result) => result.correct).length;
}

export function calculatePointsBreakdown(
  results: QuestionResult[],
  difficulties: number[],
  joker: JokerState
): PointsBreakdown {
  let basePoints = 0;
  let speedBonus = 0;
  let totalTimeMs = 0;

  for (let i = 0; i < results.length; i += 1) {
    const result = results[i];
    const difficulty = difficulties[i] ?? 3;
    totalTimeMs += clampTimeMs(result.time_ms ?? 0);
    const pts = getQuestionPoints(difficulty, result.correct, result.time_ms ?? 0);
    basePoints += pts.base;
    speedBonus += pts.speedBonus;
  }

  const subtotal = basePoints + speedBonus;
  let jokerMultiplier = 1;

  if (joker.played) {
    if (joker.won) {
      jokerMultiplier = 2;
    } else {
      jokerMultiplier = 0.5;
    }
  }

  const finalPoints = Math.round(subtotal * jokerMultiplier);

  return {
    basePoints,
    speedBonus,
    subtotal,
    jokerMultiplier,
    finalPoints,
    totalTimeMs,
  };
}

export function buildShareText({
  quizNumber,
  score,
  totalQuestions,
  points,
  results,
  joker,
  siteUrl,
}: {
  quizNumber: number;
  score: number;
  totalQuestions: number;
  points: number;
  results: QuestionResult[];
  joker: JokerState;
  siteUrl: string;
}): string {
  const regularResults = joker.played
    ? results.slice(0, ANSWERS_WHEN_BANKED)
    : results;
  const grid = regularResults
    .map((result) => (result.correct ? "🟩" : "🟥"))
    .join("");

  let jokerCell = "⬜";
  if (joker.played) {
    jokerCell = joker.won ? "🃏x2" : "🃏/2";
  }

  return [
    `#PATOQUIZZ #${quizNumber} ${score}/${totalQuestions} · ${points} pts`,
    grid + jokerCell,
    siteUrl,
  ].join("\n");
}

export function formatTimeMs(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const tenths = Math.floor((ms % 1000) / 100);
  return `${seconds}.${tenths}s`;
}
