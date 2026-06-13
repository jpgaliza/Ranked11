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
        "sticky top-16 z-30 flex items-center justify-center gap-2 border-b border-border bg-background/90 py-2 backdrop-blur-md",
        isLow && "text-destructive",
      )}
      role="timer"
      aria-live="polite"
      aria-label={t("timer")}
    >
      <Clock className="h-5 w-5" aria-hidden />
      <span className="text-xl font-bold tabular-nums">{seconds}s</span>
    </div>
  );
}
