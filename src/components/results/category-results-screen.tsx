"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  CheckCircle,
  XCircle,
  Share2,
  RotateCcw,
  Home,
  Star,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useIsDark } from "@/hooks/use-is-dark";
import type { CategoryDefinition } from "@/types/category";
import type { ResultPayload } from "@/lib/storage/result-payload-store";
import { formatScore } from "@/lib/utils/format-score";
import { ResultsRankingComparison } from "./results-ranking-comparison";

const SCORE_GRADES = [
  {
    min: 95,
    key: "perfectMsg",
    color: "#D4AF37",
    emoji: "🏆",
    bgClass: "from-yellow-400 to-amber-600",
  },
  {
    min: 75,
    key: "greatMsg",
    color: "#22C55E",
    emoji: "🌟",
    bgClass: "from-green-400 to-green-600",
  },
  {
    min: 50,
    key: "goodMsg",
    color: "#3B82F6",
    emoji: "⚡",
    bgClass: "from-blue-400 to-blue-600",
  },
  {
    min: 0,
    key: "keepMsg",
    color: "#94A3B8",
    emoji: "💪",
    bgClass: "from-slate-400 to-slate-600",
  },
] as const;

interface CategoryResultsScreenProps {
  category: CategoryDefinition;
  categoryTitle: string;
  payload: ResultPayload;
  urlScore: number;
}

export function CategoryResultsScreen({
  category,
  categoryTitle,
  payload,
  urlScore,
}: CategoryResultsScreenProps) {
  const t = useTranslations("results");
  const tItems = useTranslations("categories.items");
  const isDark = useIsDark();
  const hasRun = useRef(false);

  const scoreResult = payload.scoreResult;
  const totalScore = scoreResult?.totalScore ?? urlScore;
  const maxScore = scoreResult?.maxScore ?? 100;
  const grade = SCORE_GRADES.find((g) => totalScore >= g.min)!;
  const correctCount =
    scoreResult?.itemScores.filter((i) => i.difference === 0).length ?? 0;
  const wrongCount = 10 - correctCount;

  const getName = (id: string) =>
    tItems.has(id) ? tItems(id) : id.replace(/-/g, " ");

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    if (totalScore >= 75) {
      const colors =
        totalScore >= 95
          ? ["#D4AF37", "#F0D060", "#FFFFFF"]
          : ["#22C55E", "#86EFAC", "#FFFFFF"];
      confetti({
        particleCount: totalScore >= 95 ? 200 : 100,
        spread: 70,
        origin: { y: 0.5 },
        colors,
      });
    }
  }, [totalScore]);

  const handleShare = () => {
    const text = `🏆 Ranked11 - ${categoryTitle}\nMy score: ${formatScore(totalScore)}/100\nPlay at ranked11.app`;
    if (navigator.share) {
      navigator.share({ title: "Ranked11", text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text);
    }
  };

  const playerOrder = payload.playerOrder;

  return (
    <div className="min-h-[calc(100dvh-4rem)] pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="relative overflow-hidden rounded-3xl border mb-8"
          style={{
            borderColor: `${grade.color}40`,
            background: isDark
              ? "rgba(15,23,42,0.95)"
              : "rgba(255,255,255,0.97)",
          }}
        >
          <div className={`h-2 w-full bg-linear-to-r ${grade.bgClass}`} />
          <div className="p-8 text-center">
            <div className="text-5xl mb-3">{grade.emoji}</div>
            <div
              className="font-display font-black text-3xl tracking-wide"
              style={{ color: grade.color }}
            >
              {t(grade.key)}
            </div>

            <div className="relative mx-auto w-36 h-36 my-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke={
                    isDark ? "rgba(30,41,59,0.8)" : "rgba(226,232,240,0.8)"
                  }
                  strokeWidth="8"
                />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke={grade.color}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                  animate={{
                    strokeDashoffset:
                      2 * Math.PI * 52 * (1 - totalScore / maxScore),
                  }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="gold-text font-display font-black text-4xl leading-none">
                  {formatScore(totalScore)}
                </div>
                <div
                  className="font-display font-semibold text-sm"
                  style={{ color: isDark ? "#64748B" : "#94A3B8" }}
                >
                  / {maxScore}
                </div>
              </div>
            </div>

            <div
              className="font-display font-extrabold text-3xl"
              style={{ color: isDark ? "#F8FAFC" : "#0F172A" }}
            >
              {formatScore(totalScore)}{" "}
              <span className="text-base" style={{ color: "#D4AF37" }}>
                PTS
              </span>
            </div>
          </div>
        </motion.div>

        <ResultsRankingComparison
          category={category}
          playerOrder={playerOrder}
          getName={getName}
          animationDelay={0.3}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl border border-border p-5 mb-6"
          style={{
            background: isDark ? "rgba(15,23,42,0.8)" : "rgba(255,255,255,0.9)",
          }}
        >
          <div
            className="flex items-center gap-2 mb-4 font-display font-extrabold tracking-wider"
            style={{ color: isDark ? "#F8FAFC" : "#0F172A" }}
          >
            <Star size={16} style={{ color: "#D4AF37" }} />
            {t("breakdown")}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                icon: CheckCircle,
                val: correctCount,
                label: t("correctLabel"),
                color: "#22C55E",
              },
              {
                icon: XCircle,
                val: wrongCount,
                label: t("wrongLabel"),
                color: "#EF4444",
              },
              {
                icon: Zap,
                val: formatScore(totalScore),
                label: t("totalScore"),
                color: "#D4AF37",
              },
            ].map(({ icon: Icon, val, label, color }) => (
              <div
                key={label}
                className="rounded-xl p-3 text-center border border-border"
                style={{
                  background: isDark
                    ? "rgba(30,41,59,0.5)"
                    : "rgba(241,245,249,0.7)",
                }}
              >
                <Icon size={18} style={{ color, margin: "0 auto 4px" }} />
                <div
                  className="font-display font-black text-2xl"
                  style={{
                    color: val === formatScore(totalScore) ? color : color,
                  }}
                >
                  {val}
                </div>
                <div
                  className="text-[0.65rem] font-display tracking-wider"
                  style={{ color: isDark ? "#475569" : "#94A3B8" }}
                >
                  {label.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link
            href={`/categories/${category.id}`}
            className="flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 border border-border transition-all hover:border-primary font-display font-bold tracking-wider"
            style={{ color: isDark ? "#CBD5E1" : "#334155" }}
          >
            <RotateCcw size={16} /> {t("replay")}
          </Link>
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 border transition-all font-display font-bold tracking-wider"
            style={{
              borderColor: "rgba(212,175,55,0.4)",
              background: "rgba(212,175,55,0.1)",
              color: "#D4AF37",
            }}
          >
            <Share2 size={16} /> {t("share")}
          </button>
          <Link
            href="/"
            className="flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all gold-glow font-display font-extrabold tracking-wider"
            style={{
              background: "linear-gradient(135deg, #B8960C, #D4AF37, #F0D060)",
              color: "#0F172A",
            }}
          >
            <Home size={16} /> {t("home")}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
