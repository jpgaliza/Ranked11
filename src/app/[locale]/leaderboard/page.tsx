import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LeaderboardScreen } from "@/components/leaderboard/leaderboard-screen";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "leaderboard" });
  return { title: t("metaTitle") };
}

export default async function LeaderboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const showLeaderboardPage = false;

  if (showLeaderboardPage) {
    return <LeaderboardScreen />;
  }

  notFound();
}
