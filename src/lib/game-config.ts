export const QUESTIONS_PER_DAY = 10;

/**
 * Difficulty for each slot (index 0 = question 1, index 9 = joker question 10).
 * Recalibrated 2026-07-10: expert ranking showed very few questions are truly
 * difficulty 1, so the ramp starts with a single warm-up.
 */
export const SLOT_DIFFICULTIES = [1, 2, 2, 3, 3, 4, 4, 5, 5, 6] as const;

/** 0-based index of the quitte ou double question (question 10). */
export const JOKER_QUESTION_INDEX = QUESTIONS_PER_DAY - 1;

/** 0-based index after which the joker choice is shown (after question 9). */
export const JOKER_CHOICE_AFTER_INDEX = QUESTIONS_PER_DAY - 2;

/** Answers submitted when banking before the joker question. */
export const ANSWERS_WHEN_BANKED = QUESTIONS_PER_DAY - 1;

/** Minimum correct answers to earn a department magnet (≈80%, was 5/6). */
export const MAGNET_REWARD_MIN_SCORE = 8;

export function getSlotDifficulty(slotIndex: number): number {
  return SLOT_DIFFICULTIES[slotIndex] ?? 3;
}
