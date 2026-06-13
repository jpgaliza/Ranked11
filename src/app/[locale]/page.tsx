import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DailyChallengeHero } from "@/components/home/daily-challenge-hero";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <div>
      <DailyChallengeHero />
      <section className="mx-auto max-w-4xl px-4 pb-16 text-center sm:px-6">
        <h2 className="mb-4 text-2xl font-bold">{t("exploreCategories")}</h2>
        <p className="mb-6 text-muted-foreground">{t("exploreDescription")}</p>
        <Button asChild variant="outline" size="lg">
          <Link href="/categories">{t("browseCategories")}</Link>
        </Button>
      </section>
    </div>
  );
}
