import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getManifestEntries } from "@/lib/categories/registry";
import { getCategoryDifficulty, getCategoryTag } from "@/lib/view-models/category-display";
import { HomePage } from "@/components/home/home-page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const featured = getManifestEntries()
    .filter((e) => e.featured)
    .slice(0, 4)
    .map((entry) => ({
      id: entry.id,
      title: t(`${entry.i18nKey}.title`),
      description: t(`${entry.i18nKey}.description`),
      difficulty: getCategoryDifficulty(entry.type),
      tag: getCategoryTag(entry.type),
    }));

  const fallback = getManifestEntries()
    .slice(0, 4)
    .map((entry) => ({
      id: entry.id,
      title: t(`${entry.i18nKey}.title`),
      description: t(`${entry.i18nKey}.description`),
      difficulty: getCategoryDifficulty(entry.type),
      tag: getCategoryTag(entry.type),
    }));

  return <HomePage featured={featured.length >= 4 ? featured : fallback} />;
}
