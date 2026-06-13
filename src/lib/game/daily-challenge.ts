import { SLOT_COUNT, HARD_MODE_DURATION_MS } from "./constants";

export const ROTATION_ORDER = [
  "teams-most-titles",
  "top-goalscorers",
  "teams-most-appearances",
  "players-most-appearances",
  "teams-most-wins",
  "players-most-world-cups",
  "teams-most-goals-scored",
  "players-most-goals-single-cup",
  "teams-most-final-appearances",
  "coaches-most-matches",
  "teams-most-semi-final-appearances",
  "players-most-assists",
  "teams-most-matches",
  "coaches-most-wins",
  "teams-most-clean-sheets",
  "players-most-cards",
  "teams-most-goals-conceded",
  "countries-most-hosted",
  "teams-most-group-eliminations",
  "world-cups-highest-attendance",
] as const;

export type DailyCategoryId = (typeof ROTATION_ORDER)[number];

const EPOCH_UTC = Date.UTC(2026, 0, 1);

export function getUTCDateKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function getDaysSinceEpoch(date: Date = new Date()): number {
  const utcMidnight = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );
  return Math.floor((utcMidnight - EPOCH_UTC) / 86_400_000);
}

export function getDailyCategoryId(date: Date = new Date()): DailyCategoryId {
  const index = getDaysSinceEpoch(date) % ROTATION_ORDER.length;
  return ROTATION_ORDER[index];
}

export function getMsUntilNextDailyChallenge(date: Date = new Date()): number {
  const nextMidnight = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate() + 1,
  );
  return nextMidnight - date.getTime();
}

export function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export { HARD_MODE_DURATION_MS, SLOT_COUNT };
