import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatScore } from "@/lib/utils/format-score";
import { getCategoryById } from "@/lib/categories/loader";

export default async function ResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ score?: string; mode?: string; categoryId?: string }>;
}) {
  const { locale } = await params;
  const { score: scoreParam, mode, categoryId } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations("results");
  const tCommon = await getTranslations("common");
  const score = scoreParam ? parseInt(scoreParam, 10) : 0;

  const category = categoryId ? getCategoryById(categoryId) : null;
  const categoryTitle = category
    ? (await getTranslations())(`${category.i18nKey}.title`)
    : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <Badge variant={score >= 90 ? "default" : score >= 70 ? "success" : "secondary"}>
        {mode === "daily" ? t("dailyResult") : t("categoryResult")}
      </Badge>

      <h1 className="mt-6 text-4xl font-bold">{t("complete")}</h1>

      {categoryTitle && (
        <p className="mt-2 text-muted-foreground">{categoryTitle}</p>
      )}

      <p className="mt-8 text-6xl font-bold text-primary">{formatScore(score)}</p>

      {score === 100 && (
        <p className="mt-4 text-lg font-semibold text-success">{t("perfect")}</p>
      )}

      <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
        {mode === "daily" && (
          <Button asChild variant="outline">
            <Link href="/daily">{t("playAgain")}</Link>
          </Button>
        )}
        {categoryId && (
          <Button asChild variant="outline">
            <Link href={`/categories/${categoryId}`}>{t("retryCategory")}</Link>
          </Button>
        )}
        <Button asChild>
          <Link href="/">{tCommon("home")}</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/categories">{t("moreCategories")}</Link>
        </Button>
      </div>
    </div>
  );
}
