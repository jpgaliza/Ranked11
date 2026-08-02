"use client";

import { useDroppable } from "@dnd-kit/core";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import type { RankedItem, CategoryDefinition } from "@/types/category";
import { cn } from "@/lib/utils/cn";
import { useIsDark } from "@/hooks/use-is-dark";
import { DraggableItem } from "./draggable-item";

interface ItemPoolProps {
  items: RankedItem[];
  categoryType: CategoryDefinition["type"];
  selectedItemId: string | null;
  onItemSelect: (itemId: string) => void;
  onSubmit: () => void;
  placedCount: number;
}

export function ItemPool({
  items,
  categoryType,
  selectedItemId,
  onItemSelect,
  onSubmit,
  placedCount,
}: ItemPoolProps) {
  const t = useTranslations("game");
  const isDark = useIsDark();
  const { setNodeRef, isOver } = useDroppable({ id: "pool" });
  const allPlaced = placedCount === 10;
  const remaining = 10 - placedCount;

  return (
    <div className="flex w-full flex-col">
      <h3
        className="mb-1.5 flex shrink-0 items-center gap-1.5 font-display text-xs font-bold tracking-widest"
        style={{ color: isDark ? "#94A3B8" : "#64748B" }}
      >
        <Star size={12} style={{ color: "#D4AF37" }} />
        {t("pool").toUpperCase()} ({items.length})
      </h3>

      <div
        ref={setNodeRef}
        className={cn(
          "w-full shrink-0 rounded-lg border border-border p-1.5 md:p-2",
          items.length > 0
            ? "grid grid-cols-2 auto-rows-min gap-1.5 md:gap-2"
            : "flex min-h-28 items-center justify-center",
          isOver && "ring-2 ring-primary",
        )}
        style={{
          background: isDark ? "rgba(15,23,42,0.4)" : "rgba(241,245,249,0.5)",
        }}
        role="list"
        aria-label={t("pool")}
      >
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="min-h-0"
            >
              <DraggableItem
                item={item}
                source="pool"
                categoryType={categoryType}
                isSelected={selectedItemId === item.id}
                onSelect={() => onItemSelect(item.id)}
                variant="pool"
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {items.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-2 flex flex-col items-center justify-center py-4 text-center"
            style={{ color: isDark ? "#334155" : "#CBD5E1" }}
          >
            <CheckCircle size={24} style={{ color: "#22C55E", marginBottom: 4 }} />
            <div className="font-display text-sm font-bold" style={{ color: "#22C55E" }}>
              {t("allPlacedReview")}
            </div>
            <div className="mt-0.5 text-xs" style={{ color: isDark ? "#475569" : "#94A3B8" }}>
              {t("reviewSubmit")}
            </div>
          </motion.div>
        )}
      </div>

      <motion.button
        type="button"
        whileHover={allPlaced ? { scale: 1.01 } : {}}
        whileTap={allPlaced ? { scale: 0.98 } : {}}
        onClick={allPlaced ? onSubmit : undefined}
        className="mt-2 w-full shrink-0 rounded-lg py-2.5 md:py-3 flex items-center justify-center transition-all font-display text-xs font-extrabold tracking-wider md:text-sm"
        style={{
          background: allPlaced
            ? "linear-gradient(135deg, #B8960C, #D4AF37, #F0D060)"
            : isDark
              ? "rgba(30,41,59,0.5)"
              : "rgba(226,232,240,0.8)",
          color: allPlaced ? "#0F172A" : isDark ? "#64748B" : "#94A3B8",
          cursor: allPlaced ? "pointer" : "not-allowed",
          boxShadow: allPlaced ? "0 0 16px rgba(212,175,55,0.3)" : "none",
        }}
      >
        {allPlaced ? t("submitRanking") : t("placeMore", { count: remaining })}
      </motion.button>
    </div>
  );
}
