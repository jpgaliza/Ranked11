/**
 * Server-side score validation for post-MVP anti-cheat.
 * Recomputes score from player order — client-submitted score is ignored.
 */
import { calculateScore } from "@/lib/game/scoring";
import type { ScoreResult } from "@/types/scoring";

export function validateAndScore(
  playerOrder: (string | null)[],
  correctOrder: string[],
  _clientScore?: number,
): ScoreResult {
  return calculateScore(playerOrder, correctOrder);
}
