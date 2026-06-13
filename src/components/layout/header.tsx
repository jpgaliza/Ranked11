"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Trophy } from "lucide-react";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const t = useTranslations("common");

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-primary">
          <Trophy className="h-6 w-6" aria-hidden />
          <span>{t("appName")}</span>
        </Link>
        <nav className="flex items-center gap-4" aria-label="Main">
          <Link
            href="/daily"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            {t("dailyChallenge")}
          </Link>
          <Link
            href="/categories"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            {t("categories")}
          </Link>
          <LocaleSwitcher />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
