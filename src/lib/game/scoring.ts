import type { ScoreResult, ItemScore } from "@/types/scoring";
import { MAX_SCORE, SCORE_MAP, SLOT_COUNT } from "./constants";

export function calculateScore(
  playerOrder: (string | null)[],
  correctOrder: string[],
): ScoreResult {
  const itemScores: ItemScore[] = correctOrder.map((itemId, index) => {
    const correctPosition = index + 1;
    const slotIndex = playerOrder.indexOf(itemId);
    const playerPosition = slotIndex >= 0 ? slotIndex + 1 : null;

    let difference: number;
    if (playerPosition === null) {
      difference = SLOT_COUNT + 1;
    } else {
      difference = Math.abs(correctPosition - playerPosition);
    }

    const points = difference <= 5 ? (SCORE_MAP[difference] ?? 0) : 0;

    return {
      itemId,
      correctPosition,
      playerPosition,
      difference: playerPosition === null ? SLOT_COUNT + 1 : difference,
      points,
    };
  });

  const totalScore = itemScores.reduce((sum, item) => sum + item.points, 0);

  return {
    totalScore,
    itemScores,
    maxScore: MAX_SCORE,
  };
}

export function slotsToPlayerOrder(
  slots: ({ id: string } | null)[],
): (string | null)[] {
  return slots.map((slot) => slot?.id ?? null);
}
