import levenshtein from "fast-levenshtein";

const ARTICLES = new Set(["le", "la", "les", "l", "d", "de", "du", "des"]);

export function normalizeAnswer(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[''`]/g, " ")
    .replace(/[-_]/g, " ")
    .replace(/\bst\b/g, "saint")
    .replace(/\bste\b/g, "sainte")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((part) => part.length > 0 && !ARTICLES.has(part))
    .join(" ")
    .trim();
}

export function isAnswerCorrect(
  userAnswer: string,
  acceptedAnswers: string[]
): boolean {
  const normalizedUser = normalizeAnswer(userAnswer);
  if (!normalizedUser) return false;

  return acceptedAnswers.some((accepted) => {
    const normalizedAccepted = normalizeAnswer(accepted);
    if (!normalizedAccepted) return false;
    if (normalizedUser === normalizedAccepted) return true;

    const maxDistance = normalizedAccepted.length <= 6 ? 1 : 2;
    return levenshtein.get(normalizedUser, normalizedAccepted) <= maxDistance;
  });
}

export function getDisplayAnswer(acceptedAnswers: string[]): string {
  return acceptedAnswers[0];
}
