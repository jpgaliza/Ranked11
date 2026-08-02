import type { GameState, GameAction } from "@/types/game";
import type { RankedItem } from "@/types/category";
import { HARD_MODE_DURATION_MS, SLOT_COUNT } from "./constants";

function createEmptySlots(): (RankedItem | null)[] {
  return Array.from({ length: SLOT_COUNT }, () => null);
}

export function createInitialGameState(
  categoryId: string,
  mode: GameState["mode"],
  pool: RankedItem[],
  correctOrder: string[],
  difficulty: GameState["difficulty"] = "normal",
  interactionMode: GameState["interactionMode"] = "drag",
  isFirstDailyAttempt = true,
): GameState {
  return {
    phase: "idle",
    mode,
    difficulty,
    interactionMode,
    categoryId,
    correctOrder,
    slots: createEmptySlots(),
    pool,
    selectedItemId: null,
    timerRemainingMs: difficulty === "hard" ? HARD_MODE_DURATION_MS : null,
    score: null,
    isFirstDailyAttempt,
  };
}

function findItemInState(
  state: GameState,
  itemId: string,
): RankedItem | undefined {
  const inPool = state.pool.find((item) => item.id === itemId);
  if (inPool) return inPool;
  for (const slot of state.slots) {
    if (slot?.id === itemId) return slot;
  }
  return undefined;
}

function removeItemFromSlots(
  slots: (RankedItem | null)[],
  itemId: string,
): (RankedItem | null)[] {
  return slots.map((slot) => (slot?.id === itemId ? null : slot));
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME":
      return {
        ...state,
        phase: "playing",
        pool: action.payload.pool,
        slots: createEmptySlots(),
        selectedItemId: null,
        timerRemainingMs:
          action.payload.difficulty === "hard"
            ? HARD_MODE_DURATION_MS
            : null,
        difficulty: action.payload.difficulty,
        isFirstDailyAttempt: action.payload.isFirstDailyAttempt,
        score: null,
      };

    case "ASSIGN_TO_SLOT": {
      const { slotIndex, itemId } = action.payload;
      if (slotIndex < 0 || slotIndex >= SLOT_COUNT) return state;

      const item = findItemInState(state, itemId);
      if (!item) return state;

      const sourceSlotIndex = state.slots.findIndex((slot) => slot?.id === itemId);
      const displaced = state.slots[slotIndex];
      let newSlots = removeItemFromSlots(state.slots, itemId);
      newSlots = [...newSlots];
      newSlots[slotIndex] = item;

      let newPool = state.pool.filter((p) => p.id !== itemId);
      if (displaced && displaced.id !== itemId) {
        if (sourceSlotIndex >= 0) {
          newSlots[sourceSlotIndex] = displaced;
        } else {
          newPool = [...newPool, displaced];
        }
      }

      return {
        ...state,
        slots: newSlots,
        pool: newPool,
        selectedItemId: null,
      };
    }

    case "REMOVE_FROM_SLOT": {
      const { slotIndex } = action.payload;
      const item = state.slots[slotIndex];
      if (!item) return state;

      const newSlots = [...state.slots];
      newSlots[slotIndex] = null;

      return {
        ...state,
        slots: newSlots,
        pool: [...state.pool, item],
        selectedItemId:
          state.selectedItemId === item.id ? null : state.selectedItemId,
      };
    }

    case "SELECT_ITEM":
      return {
        ...state,
        selectedItemId:
          state.selectedItemId === action.payload.itemId
            ? null
            : action.payload.itemId,
      };

    case "SUBMIT":
      return {
        ...state,
        phase: "submitted",
        score: action.payload.score,
        timerRemainingMs: null,
      };

    case "TICK_TIMER":
      return {
        ...state,
        timerRemainingMs: action.payload.remainingMs,
      };

    case "SET_INTERACTION_MODE":
      return {
        ...state,
        interactionMode: action.payload.mode,
        selectedItemId: null,
      };

    case "RESET":
      return createInitialGameState(
        state.categoryId,
        state.mode,
        state.pool,
        state.correctOrder,
        state.difficulty,
        state.interactionMode,
        state.isFirstDailyAttempt,
      );

    default:
      return state;
  }
}
