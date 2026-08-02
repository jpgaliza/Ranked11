"use client";

import { motion } from "motion/react";
import { CheckCircle, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useIsDark } from "@/hooks/use-is-dark";
import type { CategoryDefinition } from "@/types/category";
import { toRankingItemDisplay } from "@/lib/view-models/category-display";

interface ResultsRankingComparisonProps {
  category: CategoryDefinition;
  playerOrder: (string | null)[];
  getName: (id: string) => string;
  animationDelay?: number;
}

export function ResultsRankingComparison({
  category,
  playerOrder,
  getName,
  animationDelay = 0.3,
}: ResultsRankingComparisonProps) {
  const t = useTranslations("results");
  const isDark = useIsDark();
  const correctOrder = category.correctOrder;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay }}
      className="rounded-2xl border border-border overflow-hidden mb-6"
      style={{
        background: isDark ? "rgba(15,23,42,0.85)" : "rgba(255,255,255,0.95)",
      }}
    >
      <div
        className="grid grid-cols-3 px-4 py-3 border-b border-border"
        style={{
          background: isDark ? "rgba(30,41,59,0.6)" : "rgba(241,245,249,0.8)",
        }}
      >
        {[
          { key: "position" as const },
          { key: "yourRanking" as const },
          { key: "correct" as const },
        ].map(({ key }) => (
          <div
            key={key}
            className="font-display font-bold text-xs tracking-widest"
            style={{ color: isDark ? "#64748B" : "#94A3B8" }}
          >
            {t(key).toUpperCase()}
          </div>
        ))}
      </div>

      {correctOrder.map((correctId, i) => {
        const correctItem = category.items[correctId]!;
        const correctDisplay = toRankingItemDisplay(
          correctItem,
          getName,
          category.type,
          true,
        );
        const playerId = playerOrder[i];
        const playerItem = playerId ? category.items[playerId] : null;
        const playerDisplay = playerItem
          ? toRankingItemDisplay(playerItem, getName, category.type, true)
          : null;
        const isRight = playerId === correctId;

        return (
          <motion.div
            key={correctId}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: animationDelay + 0.1 + i * 0.05 }}
            className="grid grid-cols-3 items-center px-4 py-3 border-b border-border last:border-0 gap-2"
            style={{
              background: isRight
                ? isDark
                  ? "rgba(34,197,94,0.06)"
                  : "rgba(34,197,94,0.04)"
                : "transparent",
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 font-display"
                style={{
                  background: isRight
                    ? "rgba(34,197,94,0.2)"
                    : "rgba(239,68,68,0.15)",
                  color: isRight ? "#22C55E" : "#EF4444",
                }}
              >
                {i + 1}
              </div>
              {isRight ? (
                <CheckCircle size={14} style={{ color: "#22C55E" }} />
              ) : (
                <XCircle size={14} style={{ color: "#EF4444" }} />
              )}
            </div>

            <div className="min-w-0">
              {playerDisplay ? (
                <>
                  <div
                    className="truncate font-display font-bold text-sm"
                    style={{ color: isRight ? "#22C55E" : "#EF4444" }}
                  >
                    {playerDisplay.flag} {playerDisplay.name}
                  </div>
                  <div
                    className="text-[0.65rem]"
                    style={{ color: isDark ? "#475569" : "#94A3B8" }}
                  >
                    {playerDisplay.subtitle}
                    {playerDisplay.statValue !== undefined &&
                      ` · ${playerDisplay.statValue}`}
                  </div>
                </>
              ) : (
                <span
                  className="text-sm italic"
                  style={{ color: isDark ? "#475569" : "#CBD5E1" }}
                >
                  —
                </span>
              )}
            </div>

            <div className="min-w-0">
              <div
                className="truncate font-display font-bold text-sm"
                style={{ color: isDark ? "#F8FAFC" : "#0F172A" }}
              >
                {correctDisplay.flag} {correctDisplay.name}
              </div>
              <div
                className="text-[0.65rem]"
                style={{ color: isDark ? "#475569" : "#94A3B8" }}
              >
                {correctDisplay.subtitle}
                {correctDisplay.statValue !== undefined &&
                  ` · ${correctDisplay.statValue}`}
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
