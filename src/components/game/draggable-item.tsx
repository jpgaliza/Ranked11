"use client";

import { useDraggable } from "@dnd-kit/core";
import { CheckCircle } from "lucide-react";
import type { RankedItem, CategoryDefinition } from "@/types/category";
import { useIsDark } from "@/hooks/use-is-dark";
import { toRankingItemDisplay } from "@/lib/view-models/category-display";
import { CountryFlag } from "@/components/ui/country-flag";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";

interface ItemCardProps {
  item: RankedItem;
  categoryType: CategoryDefinition["type"];
  isSelected?: boolean;
  showStat?: boolean;
  variant?: "pool" | "slot";
  isOverlay?: boolean;
}

function ItemCard({
  item,
  categoryType,
  isSelected = false,
  showStat = false,
  variant = "pool",
  isOverlay = false,
}: ItemCardProps) {
  const t = useTranslations("categories.items");
  const isDark = useIsDark();
  const getName = (itemId: string) =>
    t.has(itemId) ? t(itemId) : itemId.replace(/-/g, " ");
  const display = toRankingItemDisplay(item, getName, categoryType, showStat);
  const fg = isDark ? "#F8FAFC" : "#0F172A";

  const content = (
    <>
      {display.countryCode && (
        <CountryFlag
          code={display.countryCode}
          className="h-3.5 aspect-[3/2] w-auto md:h-4 lg:h-5"
        />
      )}
      <div
        className="min-w-0 flex-1 truncate font-display text-sm font-bold leading-tight md:text-base lg:text-lg"
        style={{ color: fg }}
      >
        {display.name}
      </div>
      {isSelected && (
        <CheckCircle
          className="h-4 w-4 shrink-0 md:h-[17px] md:w-[17px] lg:h-[18px] lg:w-[18px]"
          style={{ color: "#D4AF37" }}
        />
      )}
    </>
  );

  if (variant === "slot") {
    return (
      <div className="flex min-w-0 flex-1 items-center gap-2">{content}</div>
    );
  }

  return (
    <div
      style={{
        borderColor: isSelected ? "#D4AF37" : "var(--border)",
        background: isSelected
          ? "rgba(212,175,55,0.15)"
          : isDark
            ? "rgba(15,23,42,0.85)"
            : "rgba(255,255,255,0.95)",
        boxShadow: isOverlay
          ? isDark
            ? "0 12px 28px rgba(0,0,0,0.45)"
            : "0 12px 28px rgba(15,23,42,0.18)"
          : isSelected
            ? "0 0 12px rgba(212,175,55,0.25)"
            : "none",
      }}
      className={cn(
        "flex w-full min-h-10 items-center gap-2 rounded-lg border px-2.5 py-2.5",
        "md:min-h-12 md:gap-2.5 md:px-3 md:py-3",
        "lg:min-h-14 lg:gap-3 lg:px-3.5 lg:py-3.5",
        isOverlay && "cursor-grabbing",
      )}
    >
      {content}
    </div>
  );
}

interface DragItemOverlayProps {
  item: RankedItem;
  categoryType: CategoryDefinition["type"];
  variant?: "pool" | "slot";
}

/** Static preview for DragOverlay — must not use useDraggable. */
export function DragItemOverlay({
  item,
  categoryType,
  variant = "pool",
}: DragItemOverlayProps) {
  return (
    <ItemCard
      item={item}
      categoryType={categoryType}
      variant={variant}
      isOverlay
    />
  );
}

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
  const id =
    source === "pool" ? `pool-${item.id}` : `slot-${slotIndex}-${item.id}`;
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: { item, source, slotIndex },
  });

  const dragStyle = isDragging ? { opacity: 0 } : undefined;

  if (variant === "slot") {
    return (
      <div
        ref={setNodeRef}
        style={dragStyle}
        className="flex min-w-0 flex-1 items-center gap-2"
        {...listeners}
        {...attributes}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.();
        }}
      >
        <ItemCard
          item={item}
          categoryType={categoryType}
          isSelected={isSelected}
          showStat={showStat}
          variant="slot"
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={dragStyle}
      className={cn(
        "cursor-pointer transition-colors duration-150",
        isDragging && "pointer-events-none",
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
      <ItemCard
        item={item}
        categoryType={categoryType}
        isSelected={isSelected}
        showStat={showStat}
        variant="pool"
      />
    </div>
  );
}
