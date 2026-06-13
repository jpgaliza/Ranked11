import type { RankedItem } from "./category";

export type GamePhase = "idle" | "playing" | "submitted" | "revealed";
export type GameMode = "daily" | "category";
export type Difficulty = "normal" | "hard";
export type InteractionMode = "drag" | "select";

export interface GameConfig {
  categoryId: string;
  mode: GameMode;
  difficulty: Difficulty;
  shuffledPool: RankedItem[];
}

export interface GameState {
  phase: GamePhase;
  mode: GameMode;
  difficulty: Difficulty;
  interactionMode: InteractionMode;
  categoryId: string;
  correctOrder: string[];
  slots: (RankedItem | null)[];
  pool: RankedItem[];
  selectedItemId: string | null;
  timerRemainingMs: number | null;
  score: import("./scoring").ScoreResult | null;
  isFirstDailyAttempt: boolean;
}

export type GameAction =
  | { type: "START_GAME"; payload: { pool: RankedItem[]; difficulty: Difficulty; isFirstDailyAttempt: boolean } }
  | { type: "ASSIGN_TO_SLOT"; payload: { slotIndex: number; itemId: string } }
  | { type: "REMOVE_FROM_SLOT"; payload: { slotIndex: number } }
  | { type: "SELECT_ITEM"; payload: { itemId: string | null } }
  | { type: "SUBMIT"; payload: { score: import("./scoring").ScoreResult } }
  | { type: "TICK_TIMER"; payload: { remainingMs: number } }
  | { type: "SET_INTERACTION_MODE"; payload: { mode: InteractionMode } }
  | { type: "RESET" };

export interface DailyAttemptRecord {
  dateUTC: string;
  categoryId: string;
  score: number;
  itemScores: import("./scoring").ItemScore[];
  submittedAt: string;
  isFirstAttempt: boolean;
}
