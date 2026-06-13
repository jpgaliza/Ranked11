import type { AttemptRepository, AttemptRecord, LeaderboardEntry, LeaderboardRepository } from "./types";

/**
 * Post-MVP: Server-validated attempt submission via Supabase Edge Functions.
 */
export class SupabaseAttemptRepository implements AttemptRepository {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_supabaseUrl: string, _serviceRoleKey: string) {}

  async saveAttempt(_record: AttemptRecord): Promise<void> {
    throw new Error("SupabaseAttemptRepository not implemented — use LocalStorageAttemptRepository for MVP");
  }

  async getDailyFirstAttempt(_dateUTC: string, _userId?: string): Promise<AttemptRecord | null> {
    throw new Error("SupabaseAttemptRepository not implemented");
  }

  async getAttemptCount(_dateUTC: string, _userId?: string): Promise<number> {
    throw new Error("SupabaseAttemptRepository not implemented");
  }
}

export class SupabaseLeaderboardRepository implements LeaderboardRepository {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_supabaseUrl: string, _anonKey: string) {}

  async getDailyLeaderboard(_dateUTC: string, _limit = 10): Promise<LeaderboardEntry[]> {
    throw new Error("SupabaseLeaderboardRepository not implemented");
  }

  async getUserDailyRank(_dateUTC: string, _userId: string): Promise<number | null> {
    throw new Error("SupabaseLeaderboardRepository not implemented");
  }
}
