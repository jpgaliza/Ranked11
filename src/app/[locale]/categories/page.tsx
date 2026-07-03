import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getManifestEntries } from "@/lib/categories/registry";
import {
  getCategoryDifficulty,
  getCategoryTag,
} from "@/lib/view-models/category-display";
import { CategoriesPageClient } from "@/components/categories/categories-page-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "categoriesPage" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const categories = getManifestEntries().map((entry) => ({
    id: entry.id,
    title: t(`${entry.i18nKey}.title`),
    description: t(`${entry.i18nKey}.description`),
    difficulty: getCategoryDifficulty(entry.type),
    tag: getCategoryTag(entry.type),
  }));

  return <CategoriesPageClient categories={categories} />;
}
