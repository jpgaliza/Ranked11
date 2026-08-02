"use client";

import { useDroppable } from "@dnd-kit/core";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import type { RankedItem, CategoryDefinition } from "@/types/category";
import { cn } from "@/lib/utils/cn";
import { useIsDark } from "@/hooks/use-is-dark";
import { DraggableItem } from "./draggable-item";

const RANK_COLORS = [
  "from-yellow-400 to-amber-500",
  "from-slate-300 to-slate-400",
  "from-amber-700 to-amber-800",
  ...Array(7).fill("from-slate-600 to-slate-700"),
];

const RANK_LABELS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"];

interface RankingSlotProps {
  index: number;
  item: RankedItem | null;
  categoryType: CategoryDefinition["type"];
  selectedItemId: string | null;
  onSlotClick: (index: number) => void;
  onItemSelect: (itemId: string) => void;
  hasSelection: boolean;
  selectedItemName?: string;
}

export function RankingSlot({
  index,
  item,
  categoryType,
  selectedItemId,
  onSlotClick,
  onItemSelect,
  hasSelection,
  selectedItemName,
}: RankingSlotProps) {
  const t = useTranslations("game");
  const isDark = useIsDark();
  const { setNodeRef, isOver } = useDroppable({ id: `slot-${index}` });
  const rank = index + 1;
  const isSelected = item && selectedItemId === item.id;
  const placeholderColor = isDark ? "#64748B" : "#94A3B8";

  return (
    <div
      ref={setNodeRef}
      className={cn("min-h-0 md:h-full", isOver && "ring-2 ring-primary rounded-lg")}
    >
      <motion.div
        layout
        onClick={() => {
          if (item && !hasSelection) {
            onItemSelect(item.id);
          } else {
            onSlotClick(index);
          }
        }}
        whileTap={{ scale: 0.98 }}
        className="relative flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2.5 transition-all duration-200 md:min-h-0 md:h-full md:gap-2 md:px-2 md:py-0 lg:gap-2.5 lg:px-3"
        style={{
          borderColor: isSelected
            ? "#D4AF37"
            : item
              ? "rgba(212,175,55,0.25)"
              : hasSelection
                ? "rgba(212,175,55,0.3)"
                : "var(--border)",
          background: isSelected
            ? "rgba(212,175,55,0.15)"
            : item
              ? isDark
                ? "rgba(15,23,42,0.9)"
                : "rgba(255,255,255,0.95)"
              : hasSelection
                ? "rgba(212,175,55,0.05)"
                : isDark
                  ? "rgba(15,23,42,0.4)"
                  : "rgba(241,245,249,0.5)",
          boxShadow: isSelected ? "0 0 12px rgba(212,175,55,0.2)" : "none",
        }}
      >
        <div
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-gradient-to-br text-[8px] font-black font-display",
            "md:h-7 md:w-7 md:rounded-lg md:text-[10px] lg:h-8 lg:w-8 lg:text-xs",
            RANK_COLORS[index],
          )}
          style={{ color: index < 3 ? "#0F172A" : "#F8FAFC" }}
        >
          {rank}
        </div>

        {item ? (
          <DraggableItem
            item={item}
            source="slot"
            slotIndex={index}
            categoryType={categoryType}
            isSelected={isSelected ?? false}
            onSelect={() => onItemSelect(item.id)}
            variant="slot"
          />
        ) : (
          <div
            className="min-w-0 flex-1 truncate font-display text-sm leading-tight md:text-base lg:text-lg md:font-normal md:italic"
            style={{ color: placeholderColor }}
          >
            {hasSelection && selectedItemName ? (
              <span style={{ fontStyle: "normal" }}>{t("clickToPlace", { name: selectedItemName })}</span>
            ) : (
              <span>
                {RANK_LABELS[index]}
                <span className="max-md:hidden"> place</span>
              </span>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
