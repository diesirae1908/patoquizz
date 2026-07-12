import { v4 as uuidv4 } from "uuid";
import { normalizeAnswer } from "../answer-checker";
import { QUESTIONS_PER_DAY, SLOT_DIFFICULTIES } from "../game-config";
import type { Question, QuestionCategory } from "../types";
import { CITIES } from "./cities";
import { DEPARTMENTS, getDeptGenitive } from "./departments";
import { EASY_QUESTIONS } from "./easy";
import { EXPERT_QUESTIONS } from "./expert";
import { MISC_QUESTIONS } from "./misc";

function clampDifficulty(value: number): number {
  return Math.min(6, Math.max(1, value));
}

function deptByCode(code: string) {
  return DEPARTMENTS.find((dept) => dept.code === code);
}

// --- Expert-calibrated difficulty mappings (calibration of 2026-07-10) ---
// A French-geography expert ranked 50 sample questions; these maps translate
// notoriety scores into their observed difficulty per question type.

/** "Which department is city X in": Rennes rated 4, Pessac/Vichy rated 5. */
const CITY_DIFFICULTY: Record<number, number> = {
  1: 2, 2: 4, 3: 5, 4: 5, 5: 5, 6: 6,
};

/** "Quelle est la préfecture de X": Gironde rated 3, Isère/Ain/Dordogne 4. */
const PREFECTURE_DIFFICULTY: Record<number, number> = {
  1: 2, 2: 4, 3: 4, 4: 5, 5: 5, 6: 6,
};

/** "Quel est le numéro de X": plateaus at 4 (Savoie and Gers both rated 4). */
const NUMERO_DIFFICULTY: Record<number, number> = {
  1: 3, 2: 4, 3: 4, 4: 4, 5: 5, 6: 5,
};

/** "Quel département porte le numéro N": 13 rated 2, harder ones cap out. */
const NUMERO_REVERSE_DIFFICULTY: Record<number, number> = {
  1: 2, 2: 4, 3: 4, 4: 5, 5: 5, 6: 6,
};

/** Region questions rated ~4 regardless of department fame (Nord 4, Creuse 4). */
function regionDifficulty(notoriety: number): number {
  return notoriety <= 1 ? 3 : 4;
}

/** "Dans quel département se trouve la sous-préfecture X": Dax rated 4. */
function reverseSousPrefectureDifficulty(notoriety: number): number {
  return clampDifficulty(Math.max(4, notoriety + 1));
}

/** "De quel département X est-elle la préfecture": Nantes 4, Chaumont 6. */
function reversePrefectureDifficulty(notoriety: number): number {
  return clampDifficulty(Math.max(4, notoriety + 2));
}

/**
 * Naming any sous-préfecture is hard even for famous departments
 * (Rhône and Calvados both rated 6, Ariège 5).
 */
function citeSousPrefectureDifficulty(notoriety: number): number {
  return notoriety <= 3 ? 6 : 5;
}

function cityGenitive(name: string): string {
  return /^[AEIOUYÉÈÊÀÎ]/i.test(name) ? `d'${name}` : `de ${name}`;
}

/**
 * True when an accepted answer appears verbatim in the question text
 * (e.g. "Quelle est la sous-préfecture ... située à Castellane ?" with the
 * answer Castellane). Such questions must never reach players.
 */
export function revealsAnswer(text: string, acceptedAnswers: string[]): boolean {
  const questionWords = normalizeAnswer(text).split(" ");
  return acceptedAnswers.some((answer) => {
    const answerWords = normalizeAnswer(answer)
      .split(" ")
      .filter((word) => word.length > 1);
    if (answerWords.length === 0) return false;
    for (let i = 0; i + answerWords.length <= questionWords.length; i += 1) {
      if (answerWords.every((word, j) => questionWords[i + j] === word)) {
        return true;
      }
    }
    return false;
  });
}

export function generateAllQuestions(): Question[] {
  const questions: Question[] = [];

  for (const easy of EASY_QUESTIONS) {
    questions.push({
      id: uuidv4(),
      text: easy.text,
      accepted_answers: easy.accepted_answers,
      display_answer: easy.display_answer,
      difficulty: easy.difficulty ?? 1,
      category: "divers",
    });
  }

  for (const dept of DEPARTMENTS) {
    const genitive = getDeptGenitive(dept.name);

    questions.push({
      id: uuidv4(),
      text: `Quelle est la préfecture ${genitive} ?`,
      accepted_answers: [dept.prefecture],
      display_answer: dept.prefecture,
      difficulty: PREFECTURE_DIFFICULTY[dept.notoriety] ?? 4,
      category: "prefecture",
    });

    questions.push({
      id: uuidv4(),
      text: `De quel département ${dept.prefecture} est-elle la préfecture ?`,
      accepted_answers: [dept.name, dept.code],
      display_answer: dept.name,
      difficulty: reversePrefectureDifficulty(dept.notoriety),
      category: "prefecture",
    });

    questions.push({
      id: uuidv4(),
      text: `Quel est le numéro du département ${genitive} ?`,
      accepted_answers: [dept.code],
      display_answer: dept.code,
      difficulty: NUMERO_DIFFICULTY[dept.notoriety] ?? 4,
      category: "numero_departement",
    });

    questions.push({
      id: uuidv4(),
      text: `Quel département porte le numéro ${dept.code} ?`,
      accepted_answers: [dept.name],
      display_answer: dept.name,
      difficulty: NUMERO_REVERSE_DIFFICULTY[dept.notoriety] ?? 4,
      category: "departement_numero",
    });

    questions.push({
      id: uuidv4(),
      text: `Dans quelle région se trouve le département ${genitive} ?`,
      accepted_answers: [dept.region],
      display_answer: dept.region,
      difficulty: regionDifficulty(dept.notoriety),
      category: "region",
    });

    if (dept.sousPrefectures.length > 0) {
      questions.push({
        id: uuidv4(),
        text: `Citez une sous-préfecture ${genitive}.`,
        accepted_answers: dept.sousPrefectures,
        display_answer: dept.sousPrefectures[0],
        difficulty: citeSousPrefectureDifficulty(dept.notoriety),
        category: "sous_prefecture",
      });

      for (const sousPrefecture of dept.sousPrefectures) {
        questions.push({
          id: uuidv4(),
          text: `Dans quel département se trouve la sous-préfecture ${cityGenitive(sousPrefecture)} ?`,
          accepted_answers: [dept.name, dept.code],
          display_answer: dept.name,
          difficulty: reverseSousPrefectureDifficulty(dept.notoriety),
          category: "sous_prefecture",
        });
      }
    }
  }

  for (const city of CITIES) {
    const dept = deptByCode(city.departmentCode);
    if (!dept) continue;

    questions.push({
      id: uuidv4(),
      text: `Dans quel département se trouve la ville ${cityGenitive(city.name)} ?`,
      accepted_answers: [dept.name, dept.code],
      display_answer: dept.name,
      difficulty: CITY_DIFFICULTY[city.notoriety] ?? 4,
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

  // Hand-written pools can duplicate generated questions (e.g. "Quel est le
  // numéro du département de Paris ?"); keep only the first of each text.
  const seenTexts = new Set<string>();
  const valid = questions.filter((question) => {
    if (revealsAnswer(question.text, question.accepted_answers)) return false;
    const key = normalizeAnswer(question.text);
    if (seenTexts.has(key)) return false;
    seenTexts.add(key);
    return true;
  });

  // Deterministic shuffle so every question source (departments, cities,
  // misc, expert) is spread evenly across the daily quizzes instead of the
  // hand-written pools clustering at the end of the schedule.
  return seededShuffle(valid, 20260710);
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const result = [...items];
  let state = seed;
  const next = () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
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

const NUMERIC_CATEGORIES: ReadonlySet<QuestionCategory> = new Set([
  "numero_departement",
  "departement_numero",
] as QuestionCategory[]);

function isNumericQuestion(question: Question): boolean {
  return (
    NUMERIC_CATEGORIES.has(question.category) ||
    question.text.toLowerCase().includes("numéro")
  );
}

const MAX_NUMERIC_PER_DAY = 2;
const MAX_SAME_CATEGORY_PER_DAY = 2;

/**
 * Round-robin interleave a bucket by category so rare categories (like the
 * hand-written "divers" questions) are spread across the whole schedule
 * instead of clustering wherever generation order put them.
 */
function interleaveByCategory(bucket: Question[]): Question[] {
  const byCategory = new Map<QuestionCategory, Question[]>();
  for (const question of bucket) {
    const group = byCategory.get(question.category) ?? [];
    group.push(question);
    byCategory.set(question.category, group);
  }
  const groups = [...byCategory.values()];
  const result: Question[] = [];
  for (let i = 0; result.length < bucket.length; i += 1) {
    for (const group of groups) {
      if (i < group.length) result.push(group[i]);
    }
  }
  return result;
}

export function buildDailyQuizzes(
  questions: Question[],
  startDate: string,
  days: number
): Array<{ quiz_date: string; quiz_number: number; question_ids: string[] }> {
  const byDifficulty = groupQuestionsByDifficulty(questions);
  for (const key of Object.keys(byDifficulty)) {
    byDifficulty[Number(key)] = interleaveByCategory(byDifficulty[Number(key)]);
  }
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
    const dayIds = new Set<string>();
    const categoryCounts = new Map<QuestionCategory, number>();
    let numericCount = 0;

    for (let slot = 0; slot < QUESTIONS_PER_DAY; slot += 1) {
      const difficulty = SLOT_DIFFICULTIES[slot];
      const bucket = byDifficulty[difficulty] ?? [];
      let pool = bucket.filter((question) => !usedIds.has(question.id));

      // Bucket exhausted: recycle questions of this difficulty (never
      // repeating within the same day) so the difficulty progression holds
      // no matter how many days are generated.
      if (pool.length === 0) {
        for (const question of bucket) usedIds.delete(question.id);
        pool = bucket.filter((question) => !dayIds.has(question.id));
      }

      const fallbackPool =
        pool.length > 0
          ? pool
          : questions.filter((question) => !dayIds.has(question.id));
      if (fallbackPool.length === 0) continue;

      // Deterministic scattered start so picks sample the whole pool from
      // day one instead of walking it sequentially.
      const startIdx =
        ((day * 2654435761 + slot * 40503 + 12345) >>> 0) % fallbackPool.length;
      let pick = fallbackPool[startIdx];

      for (let k = 0; k < fallbackPool.length; k += 1) {
        const candidate = fallbackPool[(startIdx + k) % fallbackPool.length];
        const sameCategory = categoryCounts.get(candidate.category) ?? 0;

        if (isNumericQuestion(candidate) && numericCount >= MAX_NUMERIC_PER_DAY)
          continue;
        // "divers" is a heterogeneous catch-all (landmarks, rivers,
        // demographics, borders...), so repeating it is fine.
        if (
          candidate.category !== "divers" &&
          sameCategory >= MAX_SAME_CATEGORY_PER_DAY
        )
          continue;

        pick = candidate;
        break;
      }

      questionIds.push(pick.id);
      usedIds.add(pick.id);
      dayIds.add(pick.id);
      categoryCounts.set(
        pick.category,
        (categoryCounts.get(pick.category) ?? 0) + 1
      );
      if (isNumericQuestion(pick)) numericCount += 1;
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
