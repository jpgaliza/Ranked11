"use client";

import { useTranslations } from "next-intl";
import type { RankedItem } from "@/types/category";
import { cn } from "@/lib/utils/cn";

interface ItemCardProps {
  item: RankedItem;
  isSelected?: boolean;
  isDragging?: boolean;
  onClick?: () => void;
  className?: string;
  rank?: number;
}

export function ItemCard({
  item,
  isSelected,
  isDragging,
  onClick,
  className,
  rank,
}: ItemCardProps) {
  const t = useTranslations("categories.items");
  const name = t.has(item.id) ? t(item.id) : item.id.replace(/-/g, " ");

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "glass-card flex min-h-[44px] w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        isSelected && "ring-2 ring-primary gold-glow",
        isDragging && "opacity-50",
        rank === 1 && "border-primary/50",
        className,
      )}
      aria-pressed={isSelected}
    >
      {rank !== undefined && (
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
            rank === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
          )}
          aria-hidden
        >
          {rank}
        </span>
      )}
      <span className="flex-1 font-medium">{name}</span>
      <span className="text-xs text-muted-foreground">{item.statValue}</span>
    </button>
  );
}
