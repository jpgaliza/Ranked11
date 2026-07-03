import type { GameMode } from "@/types/game";
import type { ScoreResult } from "@/types/scoring";

export interface ResultPayload {
  categoryId: string;
  mode: GameMode;
  scoreResult: ScoreResult;
  playerOrder: (string | null)[];
  submittedAt: string;
}

const STORAGE_KEY = "ranked11:lastResult";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function saveResultPayload(payload: ResultPayload): void {
  if (!isBrowser()) return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function getResultPayload(): ResultPayload | null {
  if (!isBrowser()) return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ResultPayload;
  } catch {
    return null;
  }
}

export function clearResultPayload(): void {
  if (!isBrowser()) return;
  sessionStorage.removeItem(STORAGE_KEY);
}
