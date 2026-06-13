import { getTranslations } from "next-intl/server";

export async function getCategoryTitle(i18nKey: string): Promise<string> {
  const t = await getTranslations();
  return t(`${i18nKey}.title`);
}

export async function getCategoryDescription(i18nKey: string): Promise<string> {
  const t = await getTranslations();
  return t(`${i18nKey}.description`);
}
