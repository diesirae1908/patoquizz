"use client";

import { useState } from "react";
import type {
  CollectedDepartmentReward,
  JokerState,
  PointsBreakdown,
  QuestionResult,
} from "@/lib/types";
import { buildShareText } from "@/lib/scoring";
import { QUESTIONS_PER_DAY } from "@/lib/game-config";

interface ShareButtonProps {
  quizNumber: number;
  score: number;
  points: number;
  results: QuestionResult[];
  joker: JokerState;
}

export function ShareButton({
  quizNumber,
  score,
  points,
  results,
  joker,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const siteUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://patoquizz.onrender.com";

    const text = buildShareText({
      quizNumber,
      score,
      totalQuestions: QUESTIONS_PER_DAY,
      points,
      results,
      joker,
      siteUrl,
    });

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      onClick={handleShare}
      className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
    >
      {copied ? "Copié !" : "Partager"}
    </button>
  );
}

export function RewardMagnet({
  reward,
}: {
  reward: CollectedDepartmentReward;
}) {
  return (
    <div className="mx-auto max-w-xs animate-bounce-once">
      <div
        className="rounded-2xl border-4 border-white/40 p-6 text-center shadow-2xl"
        style={{
          backgroundColor: reward.region_color,
          boxShadow: `0 8px 32px ${reward.region_color}60`,
        }}
      >
        <p className="text-sm font-medium uppercase tracking-widest text-white/80">
          Nouveau magnet !
        </p>
        <p className="mt-2 text-4xl font-black text-white">{reward.dept_code}</p>
        <p className="mt-1 text-xl font-bold text-white">{reward.dept_name}</p>
        <p className="mt-1 text-sm text-white/70">{reward.region}</p>
      </div>
    </div>
  );
}

export function PointsBreakdownCard({
  breakdown,
  joker,
}: {
  breakdown: PointsBreakdown;
  joker: JokerState;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-left text-sm">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-white/60">Points de base</span>
          <span>{breakdown.basePoints}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Bonus vitesse</span>
          <span className="text-emerald-400">+{breakdown.speedBonus}</span>
        </div>
        <div className="flex justify-between border-t border-white/10 pt-2">
          <span className="text-white/60">Sous-total</span>
          <span>{breakdown.subtotal}</span>
        </div>
        {joker.played && (
          <div className="flex justify-between">
            <span className="text-white/60">
              Quitte ou double {joker.won ? "(x2)" : "(÷2)"}
            </span>
            <span className={joker.won ? "text-emerald-400" : "text-red-400"}>
              {joker.won ? "x2" : "÷2"}
            </span>
          </div>
        )}
        <div className="flex justify-between border-t border-white/10 pt-2 font-bold">
          <span>Total</span>
          <span className="text-lg">{breakdown.finalPoints} pts</span>
        </div>
      </div>
    </div>
  );
}
