"use client";

import { useCallback, useEffect, useRef } from "react";

export function useGameTimer(
  remainingMs: number | null,
  isPlaying: boolean,
  onTick: (remainingMs: number) => void,
  onExpire: () => void,
) {
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const tick = useCallback(() => {
    if (remainingMs === null) return;
    const next = remainingMs - 100;
    if (next <= 0) {
      onExpireRef.current();
    } else {
      onTick(next);
    }
  }, [remainingMs, onTick]);

  useEffect(() => {
    if (!isPlaying || remainingMs === null) return;
    const id = setInterval(tick, 100);
    return () => clearInterval(id);
  }, [isPlaying, remainingMs, tick]);
}
