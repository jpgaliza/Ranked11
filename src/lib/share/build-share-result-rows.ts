import type { CategoryDefinition } from "@/types/category";
import { isSlotCorrect } from "@/lib/game/scoring";
import { toRankingItemDisplay } from "@/lib/view-models/category-display";
import type { ShareResultRow } from "@/components/results/share/share-result-card";

export function buildShareResultRows(
  category: CategoryDefinition,
  playerOrder: (string | null)[],
  getName: (id: string) => string,
): ShareResultRow[] {
  const { correctOrder, items } = category;

  return correctOrder.map((correctId, index) => {
    const correctItem = items[correctId]!;
    const correctDisplay = toRankingItemDisplay(
      correctItem,
      getName,
      category.type,
      true,
    );
    const playerId = playerOrder[index];
    const playerItem = playerId ? items[playerId] : null;
    const playerDisplay = playerItem
      ? toRankingItemDisplay(playerItem, getName, category.type, true)
      : null;

    return {
      position: index + 1,
      playerName: playerDisplay?.name ?? null,
      playerCountryCode: playerDisplay?.countryCode,
      playerSubtitle: playerDisplay?.subtitle,
      playerStatValue: playerDisplay?.statValue,
      correctName: correctDisplay.name,
      correctCountryCode: correctDisplay.countryCode,
      correctSubtitle: correctDisplay.subtitle,
      correctStatValue: correctDisplay.statValue,
      isCorrect: isSlotCorrect(index, playerOrder, correctOrder, items),
    };
  });
}
