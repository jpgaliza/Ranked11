"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

const localeLabels: Record<Locale, string> = {
  en: "EN",
  "pt-BR": "PT",
};

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex gap-1" role="group" aria-label="Language">
      {routing.locales.map((loc) => (
        <Button
          key={loc}
          variant={locale === loc ? "default" : "ghost"}
          size="sm"
          onClick={() => router.replace(pathname, { locale: loc })}
          aria-pressed={locale === loc}
        >
          {localeLabels[loc]}
        </Button>
      ))}
    </div>
  );
}
