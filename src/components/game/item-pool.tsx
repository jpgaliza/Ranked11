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
    <div>
      <h3
        className="mb-3 flex items-center gap-2 font-display font-bold text-[0.85rem] tracking-widest"
        style={{ color: isDark ? "#94A3B8" : "#64748B" }}
      >
        <Star size={14} style={{ color: "#D4AF37" }} />
        {t("pool").toUpperCase()} ({items.length})
      </h3>

      <div
        ref={setNodeRef}
        className={cn(
          "rounded-xl border border-border p-3 min-h-[200px] space-y-2",
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
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
            className="flex flex-col items-center justify-center py-12 text-center"
            style={{ color: isDark ? "#334155" : "#CBD5E1" }}
          >
            <CheckCircle size={32} style={{ color: "#22C55E", marginBottom: 8 }} />
            <div className="font-display font-bold text-base" style={{ color: "#22C55E" }}>
              {t("allPlacedReview")}
            </div>
            <div className="text-sm mt-1" style={{ color: isDark ? "#475569" : "#94A3B8" }}>
              {t("reviewSubmit")}
            </div>
          </motion.div>
        )}
      </div>

      <motion.button
        type="button"
        whileHover={allPlaced ? { scale: 1.02 } : {}}
        whileTap={allPlaced ? { scale: 0.97 } : {}}
        onClick={allPlaced ? onSubmit : undefined}
        className="mt-4 w-full py-4 rounded-xl flex items-center justify-center gap-2 transition-all font-display font-extrabold tracking-wider"
        style={{
          fontSize: "1.05rem",
          background: allPlaced
            ? "linear-gradient(135deg, #B8960C, #D4AF37, #F0D060)"
            : isDark
              ? "rgba(30,41,59,0.5)"
              : "rgba(226,232,240,0.8)",
          color: allPlaced ? "#0F172A" : isDark ? "#334155" : "#CBD5E1",
          cursor: allPlaced ? "pointer" : "not-allowed",
          boxShadow: allPlaced ? "0 0 24px rgba(212,175,55,0.35)" : "none",
        }}
      >
        {allPlaced
          ? t("submitRanking")
          : t("placeMore", { count: remaining })}
      </motion.button>
    </div>
  );
}
