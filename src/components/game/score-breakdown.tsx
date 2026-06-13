"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import type { ScoreResult } from "@/types/scoring";
import { cn } from "@/lib/utils/cn";
import { formatScore } from "@/lib/utils/format-score";

interface ScoreBreakdownProps {
  score: ScoreResult;
  showCorrect?: boolean;
}

export function ScoreBreakdown({ score, showCorrect = true }: ScoreBreakdownProps) {
  const t = useTranslations("results");
  const tItems = useTranslations("categories.items");

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">{t("yourScore")}</p>
        <motion.p
          className="text-5xl font-bold text-primary"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {formatScore(score.totalScore)}
        </motion.p>
        {score.totalScore === 100 && (
          <p className="mt-2 text-success font-semibold">{t("perfect")}</p>
        )}
      </div>

      <div className="space-y-2" role="list" aria-label={t("breakdown")}>
        {score.itemScores.map((item, i) => {
          const name = tItems.has(item.itemId)
            ? tItems(item.itemId)
            : item.itemId.replace(/-/g, " ");
          return (
            <motion.div
              key={item.itemId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "flex items-center justify-between rounded-lg px-4 py-2 text-sm",
                item.points === 10 && "bg-primary/10",
                item.points >= 5 && item.points < 10 && "bg-success/10",
                item.points === 0 && "bg-destructive/10",
                item.points > 0 && item.points < 5 && "bg-muted",
              )}
              role="listitem"
            >
              <span>{name}</span>
              <span className="flex gap-4 tabular-nums">
                {showCorrect && (
                  <span className="text-muted-foreground">
                    #{item.correctPosition}
                    {item.playerPosition !== null && ` → #${item.playerPosition}`}
                  </span>
                )}
                <span className="font-bold">{item.points}pts</span>
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
