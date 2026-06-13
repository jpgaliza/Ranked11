export type CategoryType = "team" | "player" | "coach" | "country" | "tournament";

export interface RankedItemMetadata {
  countryCode?: string;
  photoUrl?: string;
}

export interface RankedItem {
  id: string;
  statValue: number;
  metadata?: RankedItemMetadata;
}

export interface CategoryDefinition {
  id: string;
  type: CategoryType;
  i18nKey: string;
  correctOrder: string[];
  items: Record<string, RankedItem>;
}

export interface CategoryManifestEntry {
  id: string;
  type: CategoryType;
  i18nKey: string;
  icon: string;
  featured?: boolean;
}

export interface CategoryManifest {
  version: string;
  categories: CategoryManifestEntry[];
}
