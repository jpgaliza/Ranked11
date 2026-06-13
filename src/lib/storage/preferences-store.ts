import type { InteractionMode } from "@/types/game";
import { STORAGE_KEYS } from "@/lib/game/constants";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getInteractionModePreference(): InteractionMode | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(STORAGE_KEYS.interactionMode);
  if (raw === "drag" || raw === "select") return raw;
  return null;
}

export function setInteractionModePreference(mode: InteractionMode): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.interactionMode, mode);
}

export function getDefaultInteractionMode(): InteractionMode {
  if (typeof window !== "undefined" && window.matchMedia) {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) return "select";
  }
  return "drag";
}

export function resolveInteractionMode(): InteractionMode {
  return getInteractionModePreference() ?? getDefaultInteractionMode();
}
