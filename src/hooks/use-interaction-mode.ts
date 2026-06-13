"use client";

import { useCallback } from "react";
import type { InteractionMode } from "@/types/game";
import {
  getInteractionModePreference,
  setInteractionModePreference,
} from "@/lib/storage/preferences-store";

export function useInteractionMode(
  currentMode: InteractionMode,
  onChange: (mode: InteractionMode) => void,
) {
  const toggleMode = useCallback(
    (mode: InteractionMode) => {
      setInteractionModePreference(mode);
      onChange(mode);
    },
    [onChange],
  );

  const savedPreference = getInteractionModePreference();

  return { currentMode, toggleMode, savedPreference };
}
