"use client";

import { useTranslations } from "next-intl";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface GameTimerProps {
  remainingMs: number | null;
}

export function GameTimer({ remainingMs }: GameTimerProps) {
  const t = useTranslations("game");

  if (remainingMs === null) return null;

  const seconds = Math.ceil(remainingMs / 1000);
  const isLow = seconds <= 10;

  return (
    <div
      className={cn(
        "mb-2 flex shrink-0 items-center justify-center gap-1.5 text-sm",
        isLow && "text-destructive",
      )}
      role="timer"
      aria-live="polite"
      aria-label={t("timer")}
    >
      <Clock className="h-4 w-4" aria-hidden />
      <span className="text-lg font-bold tabular-nums">{seconds}s</span>
    </div>
  );
}
