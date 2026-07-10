"use client";

import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { QuestionResult } from "@/lib/types";
import { Countdown } from "./Countdown";
import { ShareButton } from "./ShareButton";

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

  const guestId = useMemo(() => {
    if (typeof window === "undefined") return null;
    const existing = localStorage.getItem(GUEST_KEY);
    if (existing) return existing;
    const created = uuidv4();
    localStorage.setItem(GUEST_KEY, created);
    return created;
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
          };
          if (parsed.quizDate === data.quizDate) {
            setCurrentIndex(parsed.currentIndex);
            setResults(parsed.results);
            setCompleted(parsed.completed);
            setScore(parsed.score);
            setPoints(parsed.points);
          }
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
      })
    );
  }, [quiz, currentIndex, results, completed, score, points]);

  async function handleSubmitAnswer(event: React.FormEvent) {
    event.preventDefault();
    if (!quiz || feedback || submitting) return;

    const currentQuestion = quiz.questions[currentIndex];
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

  async function handleNext() {
    if (!quiz || !feedback) return;

    const isLast = currentIndex === quiz.questions.length - 1;
    if (isLast) {
      const finalResults = results;
      const difficulties = quiz.questions.map((question) => question.difficulty);

      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestId,
          answers: finalResults,
          difficulties,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setScore(data.score);
        setPoints(data.points);
      }

      setCompleted(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
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
    const finalScore = score || results.filter((result) => result.correct).length;

    return (
      <div className="mx-auto max-w-xl space-y-6 text-center">
        <h2 className="text-3xl font-bold text-white">
          {finalScore === 6 ? "Bravo !" : finalScore >= 4 ? "Pas mal !" : "Perdu"}
        </h2>
        <p className="text-white/70">
          Vous avez obtenu {finalScore}/6 ({points} points)
        </p>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 font-mono text-2xl tracking-widest">
          {results.map((result) => (
            <span key={result.question_id}>{result.correct ? "🟩" : "🟥"}</span>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3">
          <ShareButton
            quizNumber={quiz.quizNumber}
            score={finalScore}
            results={results}
          />
        </div>

        <Countdown />
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIndex];

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-white/50">
          Quiz #{quiz.quizNumber}
        </p>
        <p className="mt-2 text-sm text-white/60">
          Question {currentIndex + 1}/6 · Difficulté {currentQuestion.difficulty}
        </p>
      </div>

      <div className="flex justify-center gap-2">
        {quiz.questions.map((question, index) => {
          const result = results.find((item) => item.question_id === question.id);
          let color = "bg-white/10";
          if (result) {
            color = result.correct ? "bg-emerald-500" : "bg-red-500";
          } else if (index === currentIndex) {
            color = "bg-white/30";
          }

          return (
            <div
              key={question.id}
              className={`h-3 w-3 rounded-full ${color}`}
            />
          );
        })}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
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
            className="w-full rounded-xl bg-white px-4 py-3 text-lg font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
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
            className="w-full rounded-xl bg-white px-4 py-3 text-lg font-semibold text-black transition hover:bg-white/90"
          >
            {currentIndex === quiz.questions.length - 1
              ? "Voir les résultats"
              : "Question suivante"}
          </button>
        </div>
      )}
    </div>
  );
}
