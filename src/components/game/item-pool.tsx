"use client";

import { useDroppable } from "@dnd-kit/core";
import { useTranslations } from "next-intl";
import type { RankedItem } from "@/types/category";
import type { InteractionMode } from "@/types/game";
import { DraggableItem } from "./draggable-item";
import { ItemCard } from "./item-card";

interface ItemPoolProps {
  items: RankedItem[];
  interactionMode: InteractionMode;
  selectedItemId: string | null;
  onItemSelect: (itemId: string) => void;
}

export function ItemPool({
  items,
  interactionMode,
  selectedItemId,
  onItemSelect,
}: ItemPoolProps) {
  const t = useTranslations("game");
  const { setNodeRef, isOver } = useDroppable({ id: "pool" });

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">{t("availableItems")}</h2>
      <div
        ref={setNodeRef}
        className={`grid grid-cols-1 gap-2 sm:grid-cols-2 ${isOver ? "ring-2 ring-primary rounded-lg p-2" : ""}`}
        role="list"
        aria-label={t("availableItems")}
      >
        {items.map((item) =>
          interactionMode === "drag" ? (
            <DraggableItem
              key={item.id}
              item={item}
              source="pool"
              isSelected={selectedItemId === item.id}
              onSelect={() => onItemSelect(item.id)}
            />
          ) : (
            <ItemCard
              key={item.id}
              item={item}
              isSelected={selectedItemId === item.id}
              onClick={() => onItemSelect(item.id)}
            />
          ),
        )}
        {items.length === 0 && (
          <p className="col-span-full text-center text-sm text-muted-foreground">
            {t("allPlaced")}
          </p>
        )}
      </div>
    </div>
  );
}
