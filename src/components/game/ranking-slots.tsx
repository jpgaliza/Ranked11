"use client";

import { useDroppable } from "@dnd-kit/core";
import type { RankedItem } from "@/types/category";
import type { InteractionMode } from "@/types/game";
import { cn } from "@/lib/utils/cn";
import { DraggableItem } from "./draggable-item";
import { ItemCard } from "./item-card";

interface RankingSlotProps {
  index: number;
  item: RankedItem | null;
  interactionMode: InteractionMode;
  selectedItemId: string | null;
  onSlotClick: (index: number) => void;
  onItemSelect: (itemId: string) => void;
  hasSelection: boolean;
}

export function RankingSlot({
  index,
  item,
  interactionMode,
  selectedItemId,
  onSlotClick,
  onItemSelect,
  hasSelection,
}: RankingSlotProps) {
  const { setNodeRef, isOver } = useDroppable({ id: `slot-${index}` });

  const rank = index + 1;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-h-[52px] rounded-lg transition-all",
        isOver && "ring-2 ring-primary",
        !item && hasSelection && "animate-pulse ring-1 ring-primary/40",
      )}
    >
      {item ? (
        interactionMode === "drag" ? (
          <DraggableItem
            item={item}
            source="slot"
            slotIndex={index}
            isSelected={selectedItemId === item.id}
            onSelect={() => onItemSelect(item.id)}
            rank={rank}
          />
        ) : (
          <ItemCard
            item={item}
            isSelected={selectedItemId === item.id}
            onClick={() => onItemSelect(item.id)}
            rank={rank}
          />
        )
      ) : (
        <button
          type="button"
          onClick={() => onSlotClick(index)}
          className={cn(
            "flex h-full min-h-[52px] w-full items-center gap-3 rounded-lg border-2 border-dashed border-border px-4 py-3",
            "hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          )}
          aria-label={`Rank ${rank}, empty`}
        >
          <span
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
              rank === 1 ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground",
            )}
          >
            {rank}
          </span>
          <span className="text-sm text-muted-foreground">—</span>
        </button>
      )}
    </div>
  );
}
