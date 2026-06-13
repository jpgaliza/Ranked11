"use client";

import { useTranslations } from "next-intl";
import { Hand, MousePointerClick } from "lucide-react";
import type { InteractionMode } from "@/types/game";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { setInteractionModePreference } from "@/lib/storage/preferences-store";

interface InteractionToggleProps {
  mode: InteractionMode;
  onChange: (mode: InteractionMode) => void;
}

export function InteractionToggle({ mode, onChange }: InteractionToggleProps) {
  const t = useTranslations("game");

  const handleChange = (value: string) => {
    const next = value as InteractionMode;
    setInteractionModePreference(next);
    onChange(next);
  };

  return (
    <Tabs value={mode} onValueChange={handleChange}>
      <TabsList aria-label={t("interactionMode")}>
        <TabsTrigger value="drag" className="gap-2">
          <Hand className="h-4 w-4" aria-hidden />
          {t("dragMode")}
        </TabsTrigger>
        <TabsTrigger value="select" className="gap-2">
          <MousePointerClick className="h-4 w-4" aria-hidden />
          {t("selectMode")}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
