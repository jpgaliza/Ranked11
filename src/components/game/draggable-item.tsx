"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { RankedItem } from "@/types/category";
import { ItemCard } from "./item-card";

interface DraggableItemProps {
  item: RankedItem;
  source: "pool" | "slot";
  slotIndex?: number;
  isSelected?: boolean;
  onSelect?: () => void;
  rank?: number;
}

export function DraggableItem({
  item,
  source,
  slotIndex,
  isSelected,
  onSelect,
  rank,
}: DraggableItemProps) {
  const id = source === "pool" ? `pool-${item.id}` : `slot-${slotIndex}-${item.id}`;
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { item, source, slotIndex },
  });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <ItemCard
        item={item}
        isSelected={isSelected}
        isDragging={isDragging}
        onClick={onSelect}
        rank={rank}
      />
    </div>
  );
}
