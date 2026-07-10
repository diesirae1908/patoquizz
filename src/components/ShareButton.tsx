"use client";

import { useState } from "react";
import type { QuestionResult } from "@/lib/types";
import { buildShareText } from "@/lib/scoring";

interface ShareButtonProps {
  quizNumber: number;
  score: number;
  results: QuestionResult[];
}

export function ShareButton({ quizNumber, score, results }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const siteUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://patoquizz.onrender.com";

    const text = buildShareText({
      quizNumber,
      score,
      totalQuestions: results.length,
      results,
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
