"use client";

import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "@/i18n/navigation";
import type { Difficulty } from "@/types/game";

interface DifficultySelectorProps {
  difficulty: Difficulty;
  categoryId: string;
}

export function DifficultySelector({ difficulty, categoryId }: DifficultySelectorProps) {
  const t = useTranslations("game");
  const router = useRouter();

  const handleChange = (value: string) => {
    router.push(`/categories/${categoryId}?difficulty=${value}`);
  };

  return (
    <Tabs value={difficulty} onValueChange={handleChange}>
      <TabsList aria-label={t("difficulty")}>
        <TabsTrigger value="normal">{t("normalMode")}</TabsTrigger>
        <TabsTrigger value="hard">{t("hardMode")}</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
