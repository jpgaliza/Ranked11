import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Trophy, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDailyCategoryId, formatCountdown, getMsUntilNextDailyChallenge } from "@/lib/game/daily-challenge";
import { getManifestEntryById } from "@/lib/categories/registry";

export async function DailyChallengeHero() {
  const t = await getTranslations("home");
  const tCat = await getTranslations();
  const categoryId = getDailyCategoryId();
  const entry = getManifestEntryById(categoryId);
  const msUntilNext = getMsUntilNextDailyChallenge();

  const title = entry ? tCat(`${entry.i18nKey}.title`) : "???";

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Card className="gold-glow overflow-hidden">
        <CardHeader className="text-center">
          <Badge className="mx-auto w-fit" variant="default">
            <Trophy className="mr-1 h-3 w-3" aria-hidden />
            {t("dailyChallenge")}
          </Badge>
          <CardTitle className="text-3xl sm:text-4xl">{t("heroTitle")}</CardTitle>
          <CardDescription className="text-base">{t("heroDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="glass-card mx-auto max-w-md rounded-xl p-6">
            <p className="text-sm text-muted-foreground">{t("todaysCategory")}</p>
            <p className="mt-2 text-xl font-bold blur-sm select-none" aria-hidden>
              {title}
            </p>
            <p className="mt-2 text-2xl font-bold text-primary">???</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("categoryHidden")}</p>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" aria-hidden />
            <span>{t("nextChallenge")}: {formatCountdown(msUntilNext)}</span>
          </div>

          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/daily">{t("startChallenge")}</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
