"use client";

import * as Flags from "country-flag-icons/react/3x2";
import { hasFlag } from "country-flag-icons";
import { cn } from "@/lib/utils/cn";

type FlagCode = keyof typeof Flags;

interface CountryFlagProps {
  code?: string;
  className?: string;
  title?: string;
}

export function CountryFlag({ code, className, title }: CountryFlagProps) {
  if (!code) return null;

  const normalized = code.toUpperCase();
  if (!hasFlag(normalized)) return null;

  const Flag = Flags[normalized as FlagCode];
  if (!Flag) return null;

  return (
    <Flag
      title={title ?? normalized}
      className={cn("inline-block shrink-0 rounded-sm object-cover", className)}
      aria-hidden
    />
  );
}
