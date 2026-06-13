export const SLOT_COUNT = 10;
export const HARD_MODE_DURATION_MS = 60_000;
export const MAX_SCORE = 100;

export const SCORE_MAP: Record<number, number> = {
  0: 10,
  1: 5,
  2: 4,
  3: 3,
  4: 2,
  5: 1,
};

export const STORAGE_KEYS = {
  dailyFirstAttempt: (date: string) => `ranked11:daily:${date}:firstAttempt`,
  dailyAttemptCount: (date: string) => `ranked11:daily:${date}:attemptCount`,
  interactionMode: "ranked11:prefs:interactionMode",
} as const;

export const THEME_STORAGE_KEY = "ranked11-theme";
