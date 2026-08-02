import type { CategoryDefinition, CategoryManifestEntry, CategoryType, RankedItem } from "@/types/category";

export interface RankingItemDisplay {
  id: string;
  name: string;
  subtitle: string;
  countryCode?: string;
  statValue?: number;
}

const TYPE_TAGS: Record<string, string> = {
  team: "Team",
  player: "Player",
  coach: "Coach",
  country: "Country",
  tournament: "Tournament",
};

const TYPE_COLORS: Record<CategoryType, string> = {
  team: "#38BDF8",
  country: "#60A5FA",
  player: "#3B82F6",
  tournament: "#2563EB",
  coach: "#1E40AF",
};

const DIFFICULTY_MAP: Record<string, "Easy" | "Medium" | "Hard"> = {
  team: "Easy",
  country: "Easy",
  tournament: "Medium",
  player: "Medium",
  coach: "Hard",
};

export function toRankingItemDisplay(
  item: RankedItem,
  getName: (id: string) => string,
  categoryType: CategoryDefinition["type"],
  showStat = false,
): RankingItemDisplay {
  return {
    id: item.id,
    name: getName(item.id),
    subtitle: TYPE_TAGS[categoryType] ?? categoryType,
    countryCode: item.metadata?.countryCode?.toUpperCase(),
    statValue: showStat ? item.statValue : undefined,
  };
}

export function getCategoryIcon(entry: CategoryManifestEntry): string {
  const icons: Record<string, string> = {
    trophy: "🏆",
    shield: "🛡️",
    medal: "🥇",
    target: "🎯",
    "shield-off": "🥅",
    calendar: "📅",
    star: "⭐",
    award: "🏅",
    "x-circle": "❌",
    lock: "🔒",
    flame: "⚽",
    users: "👥",
    zap: "⚡",
    globe: "🌍",
    handshake: "🤝",
    "alert-triangle": "🟨",
    clipboard: "📋",
    "check-circle": "✅",
    "map-pin": "📍",
    stadium: "🏟️",
  };
  return icons[entry.icon] ?? "🏆";
}

export function getCategoryDifficulty(type: CategoryDefinition["type"]): "Easy" | "Medium" | "Hard" {
  return DIFFICULTY_MAP[type] ?? "Medium";
}

export function getCategoryTag(type: CategoryDefinition["type"]): string {
  return TYPE_TAGS[type] ?? "World Cup";
}

export function getCategoryTypeColor(type: CategoryType): string {
  return TYPE_COLORS[type] ?? "#3B82F6";
}
