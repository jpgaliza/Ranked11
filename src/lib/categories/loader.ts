import type { CategoryDefinition, CategoryManifest } from "@/types/category";
import {
  categoryDefinitionSchema,
  categoryManifestSchema,
} from "./schemas";
import manifestData from "@/data/categories/index.json";
import teamsMostTitles from "@/data/categories/teams-most-titles.json";
import teamsMostAppearances from "@/data/categories/teams-most-appearances.json";
import teamsMostWins from "@/data/categories/teams-most-wins.json";
import teamsMostGoalsScored from "@/data/categories/teams-most-goals-scored.json";
import teamsMostGoalsConceded from "@/data/categories/teams-most-goals-conceded.json";
import teamsMostMatches from "@/data/categories/teams-most-matches.json";
import teamsMostFinalAppearances from "@/data/categories/teams-most-final-appearances.json";
import teamsMostSemiFinalAppearances from "@/data/categories/teams-most-semi-final-appearances.json";
import teamsMostGroupEliminations from "@/data/categories/teams-most-group-eliminations.json";
import teamsMostCleanSheets from "@/data/categories/teams-most-clean-sheets.json";
import topGoalscorers from "@/data/categories/top-goalscorers.json";
import playersMostAppearances from "@/data/categories/players-most-appearances.json";
import playersMostGoalsSingleCup from "@/data/categories/players-most-goals-single-cup.json";
import playersMostWorldCups from "@/data/categories/players-most-world-cups.json";
import playersMostAssists from "@/data/categories/players-most-assists.json";
import playersMostCards from "@/data/categories/players-most-cards.json";
import coachesMostMatches from "@/data/categories/coaches-most-matches.json";
import coachesMostWins from "@/data/categories/coaches-most-wins.json";
import countriesMostHosted from "@/data/categories/countries-most-hosted.json";
import worldCupsHighestAttendance from "@/data/categories/world-cups-highest-attendance.json";

const rawCategories: unknown[] = [
  teamsMostTitles,
  teamsMostAppearances,
  teamsMostWins,
  teamsMostGoalsScored,
  teamsMostGoalsConceded,
  teamsMostMatches,
  teamsMostFinalAppearances,
  teamsMostSemiFinalAppearances,
  teamsMostGroupEliminations,
  teamsMostCleanSheets,
  topGoalscorers,
  playersMostAppearances,
  playersMostGoalsSingleCup,
  playersMostWorldCups,
  playersMostAssists,
  playersMostCards,
  coachesMostMatches,
  coachesMostWins,
  countriesMostHosted,
  worldCupsHighestAttendance,
];

const categoryMap = new Map<string, CategoryDefinition>();

for (const raw of rawCategories) {
  const parsed = categoryDefinitionSchema.parse(raw);
  for (const itemId of parsed.correctOrder) {
    if (!parsed.items[itemId]) {
      throw new Error(
        `Category ${parsed.id}: missing item "${itemId}" in items map`,
      );
    }
  }
  categoryMap.set(parsed.id, parsed);
}

export const categoryManifest: CategoryManifest =
  categoryManifestSchema.parse(manifestData);

export function getCategoryById(id: string): CategoryDefinition | undefined {
  return categoryMap.get(id);
}

export function getAllCategories(): CategoryDefinition[] {
  return categoryManifest.categories
    .map((entry) => categoryMap.get(entry.id))
    .filter((c): c is CategoryDefinition => c !== undefined);
}

export function getCategoryIds(): string[] {
  return categoryManifest.categories.map((c) => c.id);
}
