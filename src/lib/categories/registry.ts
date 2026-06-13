import { categoryManifest } from "./loader";
import type { CategoryManifestEntry } from "@/types/category";

export function getManifestEntries(): CategoryManifestEntry[] {
  return categoryManifest.categories;
}

export function getFeaturedCategories(): CategoryManifestEntry[] {
  return categoryManifest.categories.filter((c) => c.featured);
}

export function getManifestEntryById(
  id: string,
): CategoryManifestEntry | undefined {
  return categoryManifest.categories.find((c) => c.id === id);
}
