import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDailyCategoryId } from "@/lib/game/daily-challenge";
import { getCategoryById } from "@/lib/categories/loader";
import { GameBoard } from "@/components/game/game-board";

export default async function DailyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const categoryId = getDailyCategoryId();
  const category = getCategoryById(categoryId);
  if (!category) notFound();

  const t = await getTranslations();
  const title = t(`${category.i18nKey}.title`);
  const description = t(`${category.i18nKey}.description`);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <GameBoard
        category={category}
        mode="daily"
        difficulty="hard"
        categoryTitle={title}
        categoryDescription={description}
        showReveal
      />
    </div>
  );
}
