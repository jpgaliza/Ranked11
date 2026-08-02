import { describe, it, expect } from "vitest";
import { gameReducer, createInitialGameState } from "@/lib/game/game-reducer";
import type { RankedItem } from "@/types/category";

const items: RankedItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: `item-${i}`,
  statValue: 10 - i,
}));

const correctOrder = items.map((i) => i.id);

function createState() {
  return createInitialGameState(
    "test",
    "category",
    [...items],
    correctOrder,
  );
}

describe("gameReducer", () => {
  it("assigns item to empty slot", () => {
    const state = createState();
    const next = gameReducer(state, {
      type: "ASSIGN_TO_SLOT",
      payload: { slotIndex: 0, itemId: "item-0" },
    });
    expect(next.slots[0]?.id).toBe("item-0");
    expect(next.pool).toHaveLength(9);
  });

  it("displaces existing item to pool when assigning from pool", () => {
    let state = createState();
    state = gameReducer(state, {
      type: "ASSIGN_TO_SLOT",
      payload: { slotIndex: 0, itemId: "item-0" },
    });
    state = gameReducer(state, {
      type: "ASSIGN_TO_SLOT",
      payload: { slotIndex: 0, itemId: "item-1" },
    });
    expect(state.slots[0]?.id).toBe("item-1");
    expect(state.pool.some((p) => p.id === "item-0")).toBe(true);
  });

  it("swaps items when assigning from one slot to another occupied slot", () => {
    let state = createState();
    state = gameReducer(state, {
      type: "ASSIGN_TO_SLOT",
      payload: { slotIndex: 0, itemId: "item-0" },
    });
    state = gameReducer(state, {
      type: "ASSIGN_TO_SLOT",
      payload: { slotIndex: 1, itemId: "item-1" },
    });
    state = gameReducer(state, {
      type: "ASSIGN_TO_SLOT",
      payload: { slotIndex: 1, itemId: "item-0" },
    });
    expect(state.slots[0]?.id).toBe("item-1");
    expect(state.slots[1]?.id).toBe("item-0");
    expect(state.pool).toHaveLength(8);
  });

  it("removes item from slot to pool", () => {
    let state = createState();
    state = gameReducer(state, {
      type: "ASSIGN_TO_SLOT",
      payload: { slotIndex: 2, itemId: "item-2" },
    });
    state = gameReducer(state, {
      type: "REMOVE_FROM_SLOT",
      payload: { slotIndex: 2 },
    });
    expect(state.slots[2]).toBeNull();
    expect(state.pool.some((p) => p.id === "item-2")).toBe(true);
  });

  it("toggles selection", () => {
    const state = createState();
    const selected = gameReducer(state, {
      type: "SELECT_ITEM",
      payload: { itemId: "item-3" },
    });
    expect(selected.selectedItemId).toBe("item-3");
    const deselected = gameReducer(selected, {
      type: "SELECT_ITEM",
      payload: { itemId: "item-3" },
    });
    expect(deselected.selectedItemId).toBeNull();
  });
});
