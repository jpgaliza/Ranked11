"use client";

import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        setValue(JSON.parse(stored) as T);
      }
    } catch {
      // ignore parse errors
    }
  }, [key]);

  const setStoredValue = (next: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const resolved = next instanceof Function ? next(prev) : next;
      try {
        localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        // ignore quota errors
      }
      return resolved;
    });
  };

  return [value, setStoredValue] as const;
}
