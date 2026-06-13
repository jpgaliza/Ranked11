import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCategoryById } from "@/lib/categories/loader";
import { GameBoard } from "@/components/game/game-board";
import { DifficultySelector } from "@/components/game/difficulty-selector";
import type { Difficulty } from "@/types/game";

export default async function CategoryGamePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; categoryId: string }>;
  searchParams: Promise<{ difficulty?: string }>;
}) {
  const { locale, categoryId } = await params;
  const { difficulty: diffParam } = await searchParams;
  setRequestLocale(locale);

  const category = getCategoryById(categoryId);
  if (!category) notFound();

  const difficulty: Difficulty =
    diffParam === "hard" ? "hard" : "normal";

  const t = await getTranslations();
  const title = t(`${category.i18nKey}.title`);
  const description = t(`${category.i18nKey}.description`);

  return (
    <div>
      <div className="mx-auto flex max-w-7xl justify-end px-4 pt-6 sm:px-6">
        <DifficultySelector difficulty={difficulty} categoryId={categoryId} />
      </div>
      <GameBoard
        category={category}
        mode="category"
        difficulty={difficulty}
        categoryTitle={title}
        categoryDescription={description}
      />
    </div>
  );
}
