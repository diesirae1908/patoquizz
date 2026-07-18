"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type {
  CollectedDepartmentReward,
  JokerState,
  PointsBreakdown,
  QuestionResult,
} from "@/lib/types";
import {
  calculatePointsBreakdown,
  formatTimeMs,
  getSpeedBonusRatio,
} from "@/lib/scoring";
import {
  ANSWERS_WHEN_BANKED,
  JOKER_CHOICE_AFTER_INDEX,
  JOKER_QUESTION_INDEX,
  MAGNET_REWARD_MIN_SCORE,
  QUESTIONS_PER_DAY,
} from "@/lib/game-config";
import { Countdown } from "./Countdown";
import {
  PointsBreakdownCard,
  RewardMagnet,
  ShareButton,
} from "./ShareButton";

interface QuizQuestion {
  id: string;
  text: string;
  difficulty: number;
  category: string;
}

interface QuizPayload {
  quizDate: string;
  quizNumber: number;
  questions: QuizQuestion[];
}

const GUEST_KEY = "patoquizz_guest_id";
const PROGRESS_KEY = "patoquizz_progress";

export function QuizGame() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<QuizPayload | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    displayAnswer: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [points, setPoints] = useState(0);
  const [showJokerChoice, setShowJokerChoice] = useState(false);
  const [joker, setJoker] = useState<JokerState>({ played: false, won: null });
  const [pointsBreakdown, setPointsBreakdown] = useState<PointsBreakdown | null>(null);
  const [reward, setReward] = useState<CollectedDepartmentReward | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  const questionStartRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const guestId = useMemo(() => {
    if (typeof window === "undefined") return null;
    const existing = localStorage.getItem(GUEST_KEY);
    if (existing) return existing;
    const created = uuidv4();
    localStorage.setItem(GUEST_KEY, created);
    return created;
  }, []);

  function startTimer() {
    questionStartRef.current = Date.now();
    setElapsedMs(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - questionStartRef.current);
    }, 100);
  }

  function stopTimer(): number {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const elapsed = Date.now() - questionStartRef.current;
    setElapsedMs(elapsed);
    return elapsed;
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const response = await fetch("/api/quiz/today");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? "Impossible de charger le quiz.");
        }

        setQuiz(data);

        const saved = localStorage.getItem(PROGRESS_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as {
            quizDate: string;
            currentIndex: number;
            results: QuestionResult[];
            completed: boolean;
            score: number;
            points: number;
            showJokerChoice: boolean;
            joker: JokerState;
            pointsBreakdown: PointsBreakdown | null;
            reward: CollectedDepartmentReward | null;
          };
          if (parsed.quizDate === data.quizDate) {
            setCurrentIndex(parsed.currentIndex);
            setResults(parsed.results);
            setCompleted(parsed.completed);
            setScore(parsed.score);
            setPoints(parsed.points);
            setShowJokerChoice(parsed.showJokerChoice ?? false);
            setJoker(parsed.joker ?? { played: false, won: null });
            setPointsBreakdown(parsed.pointsBreakdown ?? null);
            setReward(parsed.reward ?? null);
          }
        }

        if (!saved || JSON.parse(saved).quizDate !== data.quizDate) {
          startTimer();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue.");
      } finally {
        setLoading(false);
      }
    }

    loadQuiz();
  }, []);

  useEffect(() => {
    if (!quiz || completed || showJokerChoice) return;
    if (!feedback && currentIndex >= 0) {
      startTimer();
    }
  }, [currentIndex, quiz, completed, showJokerChoice, feedback]);

  useEffect(() => {
    if (!quiz) return;
    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({
        quizDate: quiz.quizDate,
        currentIndex,
        results,
        completed,
        score,
        points,
        showJokerChoice,
        joker,
        pointsBreakdown,
        reward,
      })
    );
  }, [
    quiz,
    currentIndex,
    results,
    completed,
    score,
    points,
    showJokerChoice,
    joker,
    pointsBreakdown,
    reward,
  ]);

  const currentPreviewBreakdown = useMemo(() => {
    if (!quiz || results.length === 0) return null;
    const difficulties = quiz.questions
      .slice(0, results.length)
      .map((q) => q.difficulty);
    return calculatePointsBreakdown(results, difficulties, {
      played: false,
      won: null,
    });
  }, [quiz, results]);

  async function handleSubmitAnswer(event: React.FormEvent) {
    event.preventDefault();
    if (!quiz || feedback || submitting) return;

    const currentQuestion = quiz.questions[currentIndex];
    const timeMs = stopTimer();
    setSubmitting(true);

    try {
      const response = await fetch("/api/quiz/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          answer,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Erreur de validation.");
      }

      const result: QuestionResult = {
        question_id: currentQuestion.id,
        correct: data.correct,
        user_answer: answer,
        time_ms: timeMs,
      };

      setFeedback({
        correct: data.correct,
        displayAnswer: data.displayAnswer,
      });
      setResults((prev) => [...prev, result]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitQuiz(
    finalResults: QuestionResult[],
    jokerState: JokerState
  ) {
    if (!quiz) return;

    const difficulties = quiz.questions
      .slice(0, finalResults.length)
      .map((q) => q.difficulty);

    const response = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guestId,
        answers: finalResults,
        difficulties,
        jokerPlayed: jokerState.played,
        jokerWon: jokerState.won,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      setScore(data.score);
      setPoints(data.points);
      setPointsBreakdown(data.breakdown);
      setJoker(data.joker);
      if (data.reward) setReward(data.reward);
    }

    setCompleted(true);
    setShowJokerChoice(false);
  }

  async function handleNext() {
    if (!quiz || !feedback) return;

    const justFinishedBeforeJoker = currentIndex === JOKER_CHOICE_AFTER_INDEX;

    if (justFinishedBeforeJoker) {
      setFeedback(null);
      setAnswer("");
      setShowJokerChoice(true);
      return;
    }

    const isLast = currentIndex === quiz.questions.length - 1;
    if (isLast) {
      await submitQuiz(results, {
        played: true,
        won: results[results.length - 1]?.correct ?? false,
      });
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setAnswer("");
    setFeedback(null);
  }

  async function handleBankPoints() {
    await submitQuiz(results, { played: false, won: null });
  }

  function handleAcceptJoker() {
    setShowJokerChoice(false);
    setCurrentIndex(JOKER_QUESTION_INDEX);
    setAnswer("");
    setFeedback(null);
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-white/70">
        Chargement du quiz...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-200">
        {error}
      </div>
    );
  }

  if (!quiz) return null;

  if (completed) {
    const finalScore = score || results.filter((r) => r.correct).length;
    const displayResults = joker.played
      ? results.slice(0, ANSWERS_WHEN_BANKED)
      : results;

    return (
      <div className="mx-auto max-w-xl space-y-6 text-center">
        <h2 className="text-3xl font-bold text-white">
          {finalScore === QUESTIONS_PER_DAY
            ? "Parfait !"
            : finalScore >= MAGNET_REWARD_MIN_SCORE
              ? "Bravo !"
              : finalScore >= Math.floor(QUESTIONS_PER_DAY * 0.67)
                ? "Pas mal !"
                : "Perdu"}
        </h2>
        <p className="text-white/70">
          {finalScore}/{QUESTIONS_PER_DAY} · {points} points
        </p>

        {pointsBreakdown && (
          <PointsBreakdownCard breakdown={pointsBreakdown} joker={joker} />
        )}

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 font-mono text-xl tracking-widest">
          {displayResults.map((result) => (
            <span key={result.question_id}>
              {result.correct ? "🟩" : "🟥"}
            </span>
          ))}
          <span>
            {joker.played
              ? joker.won
                ? "🃏x2"
                : "🃏/2"
              : "⬜"}
          </span>
        </div>

        {reward && <RewardMagnet reward={reward} />}

        <div className="flex items-center justify-center gap-3">
          <ShareButton
            quizNumber={quiz.quizNumber}
            score={finalScore}
            points={points}
            results={results}
            joker={joker}
          />
        </div>

        <Countdown />
      </div>
    );
  }

  if (showJokerChoice) {
    const preview = currentPreviewBreakdown;

    return (
      <div className="mx-auto max-w-xl space-y-8 text-center">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-400/80">
            Quitte ou double
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            Tentez la question expert ?
          </h2>
          <p className="mt-3 text-white/60">
            Bonne réponse : vos points sont <strong>doublés</strong>.
            <br />
            Mauvaise réponse : vous <strong>perdez la moitié</strong>.
          </p>
        </div>

        {preview && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <p className="text-sm text-white/60">Points actuels</p>
            <p className="text-3xl font-bold text-amber-300">
              {preview.subtotal} pts
            </p>
            <p className="mt-1 text-xs text-white/40">
              {preview.basePoints} base + {preview.speedBonus} bonus vitesse
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleAcceptJoker}
            className="w-full rounded-xl bg-amber-500 px-4 py-4 text-lg font-bold text-black transition hover:bg-amber-400"
          >
            Tenter le quitte ou double
          </button>
          <button
            onClick={handleBankPoints}
            className="w-full rounded-xl border border-white/20 px-4 py-3 text-lg text-white/80 transition hover:bg-white/10"
          >
            S&apos;arrêter là et garder mes points
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIndex];
  const isJokerQuestion = currentIndex === JOKER_QUESTION_INDEX;
  const speedRatio = getSpeedBonusRatio(elapsedMs);
  const speedPercent = Math.round(speedRatio * 100);

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-white/50">
          Quiz #{quiz.quizNumber}
          {isJokerQuestion && (
            <span className="ml-2 text-amber-400">· Quitte ou double</span>
          )}
        </p>
        <p className="mt-2 text-sm text-white/60">
          Question {currentIndex + 1}/{QUESTIONS_PER_DAY} · Difficulté {currentQuestion.difficulty}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5">
        {quiz.questions.map((question, index) => {
          const result = results.find((item) => item.question_id === question.id);
          let color = "bg-white/10";
          if (result) {
            color = result.correct ? "bg-emerald-500" : "bg-red-500";
          } else if (index === currentIndex) {
            color = isJokerQuestion ? "bg-amber-500" : "bg-white/30";
          } else if (
            index === JOKER_QUESTION_INDEX &&
            !joker.played &&
            results.length === ANSWERS_WHEN_BANKED
          ) {
            color = "bg-amber-500/30";
          }

          return (
            <div
              key={question.id}
              className={`h-2.5 w-2.5 rounded-full ${color}`}
            />
          );
        })}
      </div>

      {!feedback && (
        <div className="flex items-center justify-center gap-3">
          <div
            className={`rounded-full px-4 py-1.5 font-mono text-sm ${
              speedPercent > 30
                ? "bg-emerald-500/20 text-emerald-300"
                : speedPercent > 10
                  ? "bg-amber-500/20 text-amber-300"
                  : "bg-white/10 text-white/60"
            }`}
          >
            {formatTimeMs(elapsedMs)}
          </div>
          {speedPercent > 0 && (
            <span className="text-xs text-emerald-400/80">
              +{speedPercent}% bonus vitesse
            </span>
          )}
        </div>
      )}

      <div
        className={`rounded-2xl border p-8 text-center ${
          isJokerQuestion
            ? "border-amber-500/30 bg-amber-500/10"
            : "border-white/10 bg-white/5"
        }`}
      >
        <p className="text-xl font-medium leading-relaxed text-white">
          {currentQuestion.text}
        </p>
      </div>

      {!feedback ? (
        <form onSubmit={handleSubmitAnswer} className="space-y-4">
          <input
            type="text"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Votre réponse..."
            autoFocus
            className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-lg text-white outline-none transition focus:border-white/50"
          />
          <button
            type="submit"
            disabled={!answer.trim() || submitting}
            className={`w-full rounded-xl px-4 py-3 text-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
              isJokerQuestion
                ? "bg-amber-500 text-black hover:bg-amber-400"
                : "bg-white text-black hover:bg-white/90"
            }`}
          >
            {submitting ? "Vérification..." : "Valider"}
          </button>
        </form>
      ) : (
        <div className="space-y-4 text-center">
          <p
            className={`text-2xl font-bold ${
              feedback.correct ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {feedback.correct ? "Correct !" : "Incorrect"}
          </p>
          {!feedback.correct && (
            <p className="text-white/70">
              La bonne réponse était :{" "}
              <span className="font-semibold text-white">
                {feedback.displayAnswer}
              </span>
            </p>
          )}
          <button
            onClick={handleNext}
            className={`w-full rounded-xl px-4 py-3 text-lg font-semibold transition ${
              isJokerQuestion
                ? "bg-amber-500 text-black hover:bg-amber-400"
                : "bg-white text-black hover:bg-white/90"
            }`}
          >
            {currentIndex === JOKER_CHOICE_AFTER_INDEX
              ? "Continuer"
              : currentIndex === quiz.questions.length - 1
                ? "Voir les résultats"
                : "Question suivante"}
          </button>
        </div>
      )}
    </div>
  );
}
