"use client";

import { useCallback, useEffect, useReducer, useState } from "react";
import type { CategoryDefinition } from "@/types/category";
import type { Difficulty, GameMode, InteractionMode } from "@/types/game";
import { createInitialGameState, gameReducer } from "@/lib/game/game-reducer";
import { shuffleCategoryPool } from "@/lib/game/shuffle-items";
import { resolveInteractionMode } from "@/lib/storage/preferences-store";

export function useGameState(
  category: CategoryDefinition,
  mode: GameMode,
  difficulty: Difficulty = "normal",
) {
  const [interactionMode, setInteractionModeState] = useState<InteractionMode>("drag");
  const [initialized, setInitialized] = useState(false);

  const [state, dispatch] = useReducer(
    gameReducer,
    createInitialGameState(
      category.id,
      mode,
      shuffleCategoryPool(category.correctOrder, category.items),
      category.correctOrder,
      difficulty,
      "drag",
      true,
    ),
  );

  useEffect(() => {
    const mode_pref = resolveInteractionMode();
    setInteractionModeState(mode_pref);
    dispatch({ type: "SET_INTERACTION_MODE", payload: { mode: mode_pref } });
    setInitialized(true);
  }, []);

  const startGame = useCallback(
    (isFirstDailyAttempt: boolean) => {
      dispatch({
        type: "START_GAME",
        payload: {
          pool: shuffleCategoryPool(category.correctOrder, category.items),
          difficulty,
          isFirstDailyAttempt,
        },
      });
    },
    [category, difficulty],
  );

  const setInteractionMode = useCallback((mode: InteractionMode) => {
    setInteractionModeState(mode);
    dispatch({ type: "SET_INTERACTION_MODE", payload: { mode } });
  }, []);

  return {
    state,
    dispatch,
    startGame,
    interactionMode,
    setInteractionMode,
    initialized,
  };
}
