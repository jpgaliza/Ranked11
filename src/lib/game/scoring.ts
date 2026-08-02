import type { RankedItem } from "@/types/category";
import type { ScoreResult, ItemScore } from "@/types/scoring";
import { MAX_SCORE, SCORE_MAP, SLOT_COUNT } from "./constants";

function getValidPositions(
  statValue: number,
  correctOrder: string[],
  items: Record<string, RankedItem>,
): number[] {
  return correctOrder
    .map((id, index) => (items[id]?.statValue === statValue ? index + 1 : null))
    .filter((position): position is number => position !== null);
}

function getPositionDifference(
  playerPosition: number | null,
  validPositions: number[],
): number {
  if (playerPosition === null) {
    return SLOT_COUNT + 1;
  }
  return Math.min(
    ...validPositions.map((position) => Math.abs(position - playerPosition)),
  );
}

export function isSlotCorrect(
  slotIndex: number,
  playerOrder: (string | null)[],
  correctOrder: string[],
  items: Record<string, RankedItem>,
): boolean {
  const correctId = correctOrder[slotIndex];
  const playerId = playerOrder[slotIndex];
  if (!correctId || !playerId) {
    return false;
  }
  const correctItem = items[correctId];
  const playerItem = items[playerId];
  if (!correctItem || !playerItem) {
    return false;
  }
  return playerItem.statValue === correctItem.statValue;
}

export function calculateScore(
  playerOrder: (string | null)[],
  correctOrder: string[],
  items: Record<string, RankedItem>,
): ScoreResult {
  const itemScores: ItemScore[] = correctOrder.map((itemId, index) => {
    const correctPosition = index + 1;
    const slotIndex = playerOrder.indexOf(itemId);
    const playerPosition = slotIndex >= 0 ? slotIndex + 1 : null;
    const statValue = items[itemId]?.statValue ?? 0;
    const validPositions = getValidPositions(statValue, correctOrder, items);
    const difference = getPositionDifference(playerPosition, validPositions);
    const points = difference <= 5 ? (SCORE_MAP[difference] ?? 0) : 0;

    return {
      itemId,
      correctPosition,
      playerPosition,
      difference,
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
