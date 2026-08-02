"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Clock, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsDark } from "@/hooks/use-is-dark";
import { cn } from "@/lib/utils/cn";
import type { Difficulty } from "@/types/game";

interface GameSetupModalProps {
  open: boolean;
  categoryTitle: string;
  categoryDescription: string;
  onStart: (difficulty: Difficulty) => void;
}

export function GameSetupModal({
  open,
  categoryTitle,
  categoryDescription,
  onStart,
}: GameSetupModalProps) {
  const t = useTranslations("game");
  const isDark = useIsDark();
  const [selected, setSelected] = useState<Difficulty>("normal");
  const hintColor = isDark ? "#CBD5E1" : "#475569";
  const bodyColor = isDark ? "#94A3B8" : "#334155";
  const titleColor = isDark ? "#F8FAFC" : "#0F172A";
  const muted = isDark ? "#64748B" : "#94A3B8";

  return (
    <Dialog open={open}>
      <DialogContent
        className={cn(
          "gold-glow sm:max-w-md gap-0 border-0 p-0",
          isDark ? "glass-daily-card" : "border border-border bg-white shadow-lg",
        )}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <div className="relative z-[1] h-1 w-full gold-gradient-btn" />
        <div className="relative z-[1] p-6 pt-5">
          <DialogHeader className="space-y-3 pr-8 text-left">
            <DialogTitle className="gold-text font-display text-base font-extrabold tracking-widest">
              {t("setupTitle").toUpperCase()}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium" style={{ color: hintColor }}>
              {t("setupHint")}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <div
              className={cn(
                "rounded-xl p-4",
                isDark ? "glass-daily-inset" : "border border-border bg-slate-50",
              )}
            >
              <h2 className="font-display text-xl leading-snug font-bold" style={{ color: titleColor }}>
                {categoryTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed font-medium" style={{ color: bodyColor }}>
                {categoryDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setSelected("normal")}
                className={cn(
                  "rounded-xl border p-4 text-left transition-all",
                  selected === "normal"
                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                    : "border-border hover:border-primary/40",
                )}
                style={{
                  background:
                    selected === "normal"
                      ? isDark
                        ? "rgba(212,175,55,0.1)"
                        : "rgba(212,175,55,0.12)"
                      : isDark
                        ? "rgba(15,23,42,0.5)"
                        : "#FFFFFF",
                }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <Zap size={16} style={{ color: "#D4AF37" }} />
                  <span className="font-display text-sm font-bold" style={{ color: titleColor }}>
                    {t("normalMode")}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: muted }}>
                  {t("normalModeHint")}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelected("hard")}
                className={cn(
                  "rounded-xl border p-4 text-left transition-all",
                  selected === "hard"
                    ? "border-red-500 bg-red-500/10 ring-1 ring-red-500"
                    : "border-border hover:border-red-400/40",
                )}
                style={{
                  background:
                    selected === "hard"
                      ? isDark
                        ? "rgba(239,68,68,0.08)"
                        : "rgba(239,68,68,0.06)"
                      : isDark
                        ? "rgba(15,23,42,0.5)"
                        : "#FFFFFF",
                }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <Clock size={16} style={{ color: "#EF4444" }} />
                  <span className="font-display text-sm font-bold" style={{ color: titleColor }}>
                    {t("hardMode")}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: muted }}>
                  {t("hardModeHint")}
                </p>
              </button>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onStart(selected)}
              className="gold-glow gold-gradient-btn flex w-full cursor-pointer items-center justify-center rounded-xl py-3.5 font-display font-extrabold tracking-wider"
              style={{ color: "#0F172A" }}
            >
              {t("startGame")}
            </motion.button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
