import { v4 as uuidv4 } from "uuid";
import type { Question } from "../types";
import { CITIES } from "./cities";
import { DEPARTMENTS } from "./departments";
import { EASY_QUESTIONS } from "./easy";
import { EXPERT_QUESTIONS } from "./expert";
import { MISC_QUESTIONS } from "./misc";

function clampDifficulty(value: number): number {
  return Math.min(6, Math.max(1, value));
}

function deptByCode(code: string) {
  return DEPARTMENTS.find((dept) => dept.code === code);
}

function notorietyToDifficulty(notoriety: number, offset = 0): number {
  return clampDifficulty(notoriety + offset);
}

export function generateAllQuestions(): Question[] {
  const questions: Question[] = [];

  for (const easy of EASY_QUESTIONS) {
    questions.push({
      id: uuidv4(),
      text: easy.text,
      accepted_answers: easy.accepted_answers,
      display_answer: easy.display_answer,
      difficulty: 1,
      category: "divers",
    });
  }

  for (const dept of DEPARTMENTS) {
    questions.push({
      id: uuidv4(),
      text: `Quelle est la préfecture du ${dept.name} ?`,
      accepted_answers: [dept.prefecture, dept.name, dept.code],
      display_answer: dept.prefecture,
      difficulty: notorietyToDifficulty(dept.notoriety),
      category: "prefecture",
    });

    questions.push({
      id: uuidv4(),
      text: `Quel est le numéro du département ${dept.name} ?`,
      accepted_answers: [dept.code],
      display_answer: dept.code,
      difficulty: notorietyToDifficulty(dept.notoriety, 1),
      category: "numero_departement",
    });

    questions.push({
      id: uuidv4(),
      text: `Quel département porte le numéro ${dept.code} ?`,
      accepted_answers: [dept.name],
      display_answer: dept.name,
      difficulty: notorietyToDifficulty(dept.notoriety, 1),
      category: "departement_numero",
    });

    questions.push({
      id: uuidv4(),
      text: `Dans quelle région se trouve le département ${dept.name} ?`,
      accepted_answers: [dept.region],
      display_answer: dept.region,
      difficulty: notorietyToDifficulty(dept.notoriety, 1),
      category: "region",
    });

    for (const sousPrefecture of dept.sousPrefectures) {
      questions.push({
        id: uuidv4(),
        text: `Citez une sous-préfecture du ${dept.name}.`,
        accepted_answers: dept.sousPrefectures,
        display_answer: sousPrefecture,
        difficulty: notorietyToDifficulty(dept.notoriety, 2),
        category: "sous_prefecture",
      });

      questions.push({
        id: uuidv4(),
        text: `Quelle est la sous-préfecture du ${dept.name} située à ${sousPrefecture} ?`,
        accepted_answers: [sousPrefecture],
        display_answer: sousPrefecture,
        difficulty: notorietyToDifficulty(dept.notoriety, 2),
        category: "sous_prefecture",
      });
    }
  }

  for (const city of CITIES) {
    const dept = deptByCode(city.departmentCode);
    if (!dept) continue;

    questions.push({
      id: uuidv4(),
      text: `Dans quel département se trouve la ville de ${city.name} ?`,
      accepted_answers: [dept.name, dept.code],
      display_answer: dept.name,
      difficulty: notorietyToDifficulty(city.notoriety),
      category: "ville_departement",
    });
  }

  for (const misc of MISC_QUESTIONS) {
    questions.push({
      id: uuidv4(),
      text: misc.text,
      accepted_answers: misc.accepted_answers,
      display_answer: misc.display_answer,
      difficulty: misc.difficulty,
      category: "divers",
    });
  }

  for (const expert of EXPERT_QUESTIONS) {
    questions.push({
      id: uuidv4(),
      text: expert.text,
      accepted_answers: expert.accepted_answers,
      display_answer: expert.display_answer,
      difficulty: expert.difficulty,
      category: "divers",
    });
  }

  return questions;
}

export function groupQuestionsByDifficulty(
  questions: Question[]
): Record<number, Question[]> {
  return questions.reduce<Record<number, Question[]>>((groups, question) => {
    const bucket = groups[question.difficulty] ?? [];
    bucket.push(question);
    groups[question.difficulty] = bucket;
    return groups;
  }, {});
}

export function buildDailyQuizzes(
  questions: Question[],
  startDate: string,
  days: number
): Array<{ quiz_date: string; quiz_number: number; question_ids: string[] }> {
  const byDifficulty = groupQuestionsByDifficulty(questions);
  const usedIds = new Set<string>();
  const dailyQuizzes: Array<{
    quiz_date: string;
    quiz_number: number;
    question_ids: string[];
  }> = [];

  const start = new Date(`${startDate}T12:00:00`);

  for (let day = 0; day < days; day += 1) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + day);
    const quizDate = currentDate.toISOString().slice(0, 10);
    const questionIds: string[] = [];

    for (let slot = 1; slot <= 6; slot += 1) {
      const difficulty = slot;
      const pool = (byDifficulty[difficulty] ?? []).filter(
        (question) => !usedIds.has(question.id)
      );

      if (pool.length === 0) {
        const fallbackPool = questions.filter(
          (question) =>
            question.difficulty === difficulty && !usedIds.has(question.id)
        );
        const pick =
          fallbackPool[(day * 7 + slot) % Math.max(fallbackPool.length, 1)] ??
          questions.find((question) => !usedIds.has(question.id));
        if (pick) {
          questionIds.push(pick.id);
          usedIds.add(pick.id);
        }
        continue;
      }

      const pick = pool[(day * 7 + slot) % pool.length];
      questionIds.push(pick.id);
      usedIds.add(pick.id);
    }

    dailyQuizzes.push({
      quiz_date: quizDate,
      quiz_number: day + 1,
      question_ids: questionIds,
    });
  }

  return dailyQuizzes;
}

export function getQuestionCount(): number {
  return generateAllQuestions().length;
}

export function getDifficultyCounts(): Record<number, number> {
  const questions = generateAllQuestions();
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  for (const q of questions) {
    counts[q.difficulty] = (counts[q.difficulty] ?? 0) + 1;
  }
  return counts;
}
