import { getManifestEntries } from "@/lib/categories/registry";
import { CategoryCard } from "./category-card";

export async function CategoryGrid() {
  const entries = getManifestEntries();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {entries.map((entry) => (
        <CategoryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
