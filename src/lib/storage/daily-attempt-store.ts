import type { DailyAttemptRecord } from "@/types/game";
import type { ItemScore } from "@/types/scoring";
import { STORAGE_KEYS } from "@/lib/game/constants";
import { getUTCDateKey } from "@/lib/game/daily-challenge";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getDailyAttemptCount(date: string = getUTCDateKey()): number {
  if (!isBrowser()) return 0;
  const raw = localStorage.getItem(STORAGE_KEYS.dailyAttemptCount(date));
  return raw ? parseInt(raw, 10) : 0;
}

export function incrementDailyAttemptCount(
  date: string = getUTCDateKey(),
): number {
  if (!isBrowser()) return 0;
  const next = getDailyAttemptCount(date) + 1;
  localStorage.setItem(STORAGE_KEYS.dailyAttemptCount(date), String(next));
  return next;
}

export function getDailyFirstAttempt(
  date: string = getUTCDateKey(),
): DailyAttemptRecord | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(STORAGE_KEYS.dailyFirstAttempt(date));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DailyAttemptRecord;
  } catch {
    return null;
  }
}

export function saveDailyFirstAttempt(
  record: Omit<DailyAttemptRecord, "isFirstAttempt">,
): DailyAttemptRecord {
  const full: DailyAttemptRecord = { ...record, isFirstAttempt: true };
  if (isBrowser()) {
    localStorage.setItem(
      STORAGE_KEYS.dailyFirstAttempt(record.dateUTC),
      JSON.stringify(full),
    );
  }
  return full;
}

export function isDailyCompletedToday(date: string = getUTCDateKey()): boolean {
  return getDailyFirstAttempt(date) !== null;
}

export function hasDailyFirstAttemptToday(
  date: string = getUTCDateKey(),
): boolean {
  return getDailyAttemptCount(date) > 0;
}

export function buildAttemptRecord(
  categoryId: string,
  score: number,
  itemScores: ItemScore[],
  isFirstAttempt: boolean,
): DailyAttemptRecord {
  return {
    dateUTC: getUTCDateKey(),
    categoryId,
    score,
    itemScores,
    submittedAt: new Date().toISOString(),
    isFirstAttempt,
  };
}
