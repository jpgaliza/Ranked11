import type { AttemptRepository, AttemptRecord } from "./types";
import {
  getDailyFirstAttempt,
  getDailyAttemptCount,
  saveDailyFirstAttempt,
  buildAttemptRecord,
  incrementDailyAttemptCount,
} from "@/lib/storage/daily-attempt-store";

export class LocalStorageAttemptRepository implements AttemptRepository {
  async saveAttempt(record: AttemptRecord): Promise<void> {
    incrementDailyAttemptCount(record.dateUTC);
    if (record.isFirstAttempt) {
      saveDailyFirstAttempt(record);
    }
  }

  async getDailyFirstAttempt(
    dateUTC: string,
    _userId?: string,
  ): Promise<AttemptRecord | null> {
    return getDailyFirstAttempt(dateUTC);
  }

  async getAttemptCount(dateUTC: string, _userId?: string): Promise<number> {
    return getDailyAttemptCount(dateUTC);
  }
}

export const localStorageAttemptRepository = new LocalStorageAttemptRepository();

export { buildAttemptRecord };
