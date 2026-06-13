import type { CategoryDefinition, CategoryManifest } from "@/types/category";

export interface CategoryRepository {
  getManifest(): Promise<CategoryManifest>;
  getCategoryById(id: string): Promise<CategoryDefinition | null>;
  getAllCategories(): Promise<CategoryDefinition[]>;
}

export interface AttemptRecord {
  dateUTC: string;
  categoryId: string;
  score: number;
  itemScores: import("@/types/scoring").ItemScore[];
  submittedAt: string;
  isFirstAttempt: boolean;
  userId?: string;
}

export interface AttemptRepository {
  saveAttempt(record: AttemptRecord): Promise<void>;
  getDailyFirstAttempt(dateUTC: string, userId?: string): Promise<AttemptRecord | null>;
  getAttemptCount(dateUTC: string, userId?: string): Promise<number>;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  submittedAt: string;
}

export interface LeaderboardRepository {
  getDailyLeaderboard(dateUTC: string, limit?: number): Promise<LeaderboardEntry[]>;
  getUserDailyRank(dateUTC: string, userId: string): Promise<number | null>;
}
