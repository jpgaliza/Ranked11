"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { CheckCircle } from "lucide-react";
import type { RankedItem, CategoryDefinition } from "@/types/category";
import { useIsDark } from "@/hooks/use-is-dark";
import { toRankingItemDisplay } from "@/lib/view-models/category-display";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";

interface DraggableItemProps {
  item: RankedItem;
  source: "pool" | "slot";
  categoryType: CategoryDefinition["type"];
  slotIndex?: number;
  isSelected?: boolean;
  onSelect?: () => void;
  showStat?: boolean;
  variant?: "pool" | "slot";
}

export function DraggableItem({
  item,
  source,
  categoryType,
  slotIndex,
  isSelected,
  onSelect,
  showStat = false,
  variant = "pool",
}: DraggableItemProps) {
  const t = useTranslations("categories.items");
  const isDark = useIsDark();
  const id = source === "pool" ? `pool-${item.id}` : `slot-${slotIndex}-${item.id}`;
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { item, source, slotIndex },
  });

  const getName = (itemId: string) => (t.has(itemId) ? t(itemId) : itemId.replace(/-/g, " "));
  const display = toRankingItemDisplay(item, getName, categoryType, showStat);
  const fg = isDark ? "#F8FAFC" : "#0F172A";
  const muted = isDark ? "#64748B" : "#94A3B8";

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined;

  if (variant === "slot") {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn("flex items-center gap-3 flex-1 min-w-0", isDragging && "opacity-50")}
        {...listeners}
        {...attributes}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.();
        }}
      >
        {display.flag && <span className="text-xl shrink-0">{display.flag}</span>}
        <div className="min-w-0 flex-1">
          <div className="truncate font-display font-bold text-sm" style={{ color: fg }}>
            {display.name}
          </div>
          <div className="text-[0.72rem]" style={{ color: muted }}>
            {display.subtitle}
          </div>
        </div>
        {isSelected && <CheckCircle size={16} style={{ color: "#D4AF37", flexShrink: 0 }} />}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        borderColor: isSelected ? "#D4AF37" : "var(--border)",
        background: isSelected
          ? "rgba(212,175,55,0.15)"
          : isDark
            ? "rgba(15,23,42,0.85)"
            : "rgba(255,255,255,0.95)",
        boxShadow: isSelected ? "0 0 12px rgba(212,175,55,0.25)" : "none",
      }}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all duration-150",
        isDragging && "opacity-50",
      )}
      {...listeners}
      {...attributes}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.();
        }
      }}
    >
      {display.flag && <span className="text-xl shrink-0">{display.flag}</span>}
      <div className="flex-1 min-w-0">
        <div className="truncate font-display font-bold text-sm" style={{ color: fg }}>
          {display.name}
        </div>
        <div className="text-[0.72rem]" style={{ color: muted }}>
          {display.subtitle}
        </div>
      </div>
      {isSelected ? (
        <CheckCircle size={16} style={{ color: "#D4AF37", flexShrink: 0 }} />
      ) : (
        <div
          className="w-5 h-5 rounded-full border border-dashed shrink-0"
          style={{ borderColor: isDark ? "#334155" : "#CBD5E1" }}
        />
      )}
    </div>
  );
}
