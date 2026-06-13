import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("common");

  return (
    <footer className="border-t border-border/50 py-8">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground sm:px-6">
        <p>{t("footer")}</p>
      </div>
    </footer>
  );
}
