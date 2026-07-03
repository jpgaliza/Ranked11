import type { CategoryDefinition, CategoryManifestEntry, RankedItem } from "@/types/category";

const COUNTRY_FLAGS: Record<string, string> = {
  BR: "🇧🇷", DE: "🇩🇪", IT: "🇮🇹", AR: "🇦🇷", FR: "🇫🇷", UY: "🇺🇾",
  GB: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", ES: "🇪🇸", HR: "🇭🇷", NL: "🇳🇱", MX: "🇲🇽", BE: "🇧🇪",
  HU: "🇭🇺", CZ: "🇨🇿", SE: "🇸🇪", CM: "🇨🇲", ZA: "🇿🇦", HN: "🇭🇳",
  NZ: "🇳🇿", QA: "🇶🇦", CN: "🇨🇳", HT: "🇭🇹", CA: "🇨🇦", CH: "🇨🇭",
  PT: "🇵🇹", IE: "🇮🇪", CO: "🇨🇴", JP: "🇯🇵", US: "🇺🇸", RU: "🇷🇺",
};

export interface RankingItemDisplay {
  id: string;
  name: string;
  subtitle: string;
  flag?: string;
  statValue?: number;
}

const TYPE_TAGS: Record<string, string> = {
  team: "Team",
  player: "Player",
  coach: "Coach",
  country: "Country",
  tournament: "Tournament",
};

const DIFFICULTY_MAP: Record<string, "Easy" | "Medium" | "Hard"> = {
  team: "Easy",
  country: "Easy",
  tournament: "Medium",
  player: "Medium",
  coach: "Hard",
};

export function getCountryFlag(countryCode?: string): string | undefined {
  if (!countryCode) return undefined;
  return COUNTRY_FLAGS[countryCode.toUpperCase()];
}

export function toRankingItemDisplay(
  item: RankedItem,
  getName: (id: string) => string,
  categoryType: CategoryDefinition["type"],
  showStat = false,
): RankingItemDisplay {
  const flag = getCountryFlag(item.metadata?.countryCode);
  return {
    id: item.id,
    name: getName(item.id),
    subtitle: TYPE_TAGS[categoryType] ?? categoryType,
    flag,
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
