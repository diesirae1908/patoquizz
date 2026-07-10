export type QuestionCategory =
  | "prefecture"
  | "sous_prefecture"
  | "ville_departement"
  | "numero_departement"
  | "departement_numero"
  | "region"
  | "divers";

export interface Question {
  id: string;
  text: string;
  accepted_answers: string[];
  difficulty: number;
  category: QuestionCategory;
  display_answer: string;
}

export interface DailyQuiz {
  id: string;
  quiz_date: string;
  quiz_number: number;
  question_ids: string[];
}

export interface QuestionResult {
  question_id: string;
  correct: boolean;
  user_answer: string;
}

export interface QuizResult {
  id: string;
  user_id: string | null;
  guest_id: string | null;
  quiz_date: string;
  quiz_number: number;
  answers: QuestionResult[];
  score: number;
  points: number;
  completed_at: string;
}

export interface Profile {
  id: string;
  username: string;
  country: string | null;
  created_at: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  points: number;
  score: number;
  streak: number;
  country: string | null;
}

export interface UserStats {
  games_played: number;
  average_score: number;
  total_points: number;
  current_streak: number;
  best_streak: number;
  distribution: Record<number, number>;
  username: string | null;
}

export interface QuizState {
  quizDate: string;
  quizNumber: number;
  questions: Array<{
    id: string;
    text: string;
    difficulty: number;
    category: QuestionCategory;
  }>;
  currentIndex: number;
  results: QuestionResult[];
  completed: boolean;
  score: number;
  points: number;
}
