import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CategoryGrid } from "@/components/categories/category-grid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "categoriesPage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("categoriesPage");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("description")}</p>
      </div>
      <CategoryGrid />
    </div>
  );
}
