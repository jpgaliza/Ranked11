import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCategoryById } from "@/lib/categories/loader";
import { ResultsPageClient } from "@/components/results/results-page-client";
import type { GameMode } from "@/types/game";

export default async function ResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ score?: string; mode?: string; categoryId?: string }>;
}) {
  const { locale } = await params;
  const { score: scoreParam, mode: modeParam, categoryId } = await searchParams;
  setRequestLocale(locale);

  const mode: GameMode = modeParam === "daily" ? "daily" : "category";
  const urlScore = scoreParam ? parseInt(scoreParam, 10) : 0;

  const category = categoryId ? getCategoryById(categoryId) ?? null : null;
  const categoryTitle = category
    ? (await getTranslations())(`${category.i18nKey}.title`)
    : null;

  return (
    <ResultsPageClient
      category={category}
      categoryTitle={categoryTitle}
      mode={mode}
      urlScore={urlScore}
    />
  );
}
