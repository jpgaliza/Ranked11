import { getDailyCategoryId, getUTCDateKey, getMsUntilNextDailyChallenge } from "@/lib/game/daily-challenge";
import { isDailyCompletedToday, getDailyAttemptCount } from "@/lib/storage/daily-attempt-store";

export function getDailyChallengeInfo(date: Date = new Date()) {
  const dateKey = getUTCDateKey(date);
  return {
    categoryId: getDailyCategoryId(date),
    dateKey,
    msUntilNext: getMsUntilNextDailyChallenge(date),
    isCompleted: isDailyCompletedToday(dateKey),
    attemptCount: getDailyAttemptCount(dateKey),
  };
}
