import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCategoryById } from "@/lib/categories/loader";
import { CategoryGameClient } from "@/components/game/category-game-client";

export default async function CategoryGamePage({
  params,
}: {
  params: Promise<{ locale: string; categoryId: string }>;
}) {
  const { locale, categoryId } = await params;
  setRequestLocale(locale);

  const category = getCategoryById(categoryId);
  if (!category) notFound();

  const t = await getTranslations();
  const title = t(`${category.i18nKey}.title`);
  const description = t(`${category.i18nKey}.description`);

  return (
    <CategoryGameClient
      category={category}
      categoryTitle={title}
      categoryDescription={description}
    />
  );
}
