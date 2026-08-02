"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Clock,
  Share2,
  Home,
  Medal,
  Star,
  CheckCircle,
  XCircle,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useIsDark } from "@/hooks/use-is-dark";
import { formatScore } from "@/lib/utils/format-score";
import type { CategoryDefinition } from "@/types/category";
import type { ResultPayload } from "@/lib/storage/result-payload-store";
import { buildShareResultRows } from "@/lib/share/build-share-result-rows";
import { getScoreGrade } from "@/lib/share/score-grades";
import { ShareResultCard } from "@/components/results/share/share-result-card";
import { ShareImagePreviewDialog } from "@/components/results/share/share-image-preview-dialog";
import { ResultsRankingComparison } from "@/components/results/results-ranking-comparison";
import { useShareResultImage } from "@/hooks/use-share-result-image";

interface DailyChallengeResultsProps {
  totalScore: number;
  maxScore?: number;
  payload?: ResultPayload | null;
  category?: CategoryDefinition | null;
  categoryTitle?: string | null;
}

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = Math.floor((midnight.getTime() - now.getTime()) / 1000);
      setTimeLeft({
        h: Math.floor(diff / 3600),
        m: Math.floor((diff % 3600) / 60),
        s: diff % 60,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return timeLeft;
}

const RANK_EMOJIS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export function DailyChallengeResults({
  totalScore,
  maxScore = 100,
  payload = null,
  category = null,
  categoryTitle = null,
}: DailyChallengeResultsProps) {
  const t = useTranslations("results");
  const tItems = useTranslations("categories.items");
  const isDark = useIsDark();
  const { h, m, s } = useCountdown();
  const pad = (n: number) => String(n).padStart(2, "0");
  const {
    shareCardRef,
    isGenerating,
    previewOpen,
    previewImageUrl,
    generatePreview,
    closePreview,
    downloadPreview,
  } = useShareResultImage();

  const scoreRatio = totalScore / maxScore;
  const displayScore = Math.round(scoreRatio * 10);
  const dailyRank =
    displayScore >= 9
      ? 24
      : displayScore >= 7
        ? 156
        : displayScore >= 5
          ? 892
          : 2341;
  const xpProgress = Math.min(scoreRatio * 100, 100);
  const grade = getScoreGrade(totalScore);
  const scoreResult = payload?.scoreResult;
  const correctCount =
    scoreResult?.itemScores.filter((item) => item.difference === 0).length ?? 0;
  const wrongCount = 10 - correctCount;
  const hasRankingData = Boolean(category && payload);

  const getName = (id: string) =>
    tItems.has(id) ? tItems(id) : id.replace(/-/g, " ");

  const shareRows =
    category && payload
      ? buildShareResultRows(category, payload.playerOrder, getName)
      : [];

  const shareLabels = {
    dailyChallenge: t("dailyTitle"),
    yourRanking: t("yourRanking"),
    correctAnswer: t("correct"),
    position: t("position").toUpperCase(),
    correct: t("correctLabel"),
    wrong: t("wrongLabel"),
    totalScore: t("totalScore"),
    yourRankToday: t("yourRankToday"),
  };

  const resolvedCategoryTitle = categoryTitle ?? t("dailyTitle");

  const handleShare = async () => {
    const success = await generatePreview({
      mode: "daily",
      totalScore,
    });

    if (!success) {
      window.alert(t("shareFailed"));
    }
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] pb-12">
      <div
        aria-hidden
        className="pointer-events-none fixed left-[-9999px] top-0"
      >
        <ShareResultCard
          ref={shareCardRef}
          mode="daily"
          categoryTitle={resolvedCategoryTitle}
          gradeMessage={t(grade.key)}
          gradeColor={grade.color}
          gradeEmoji={grade.emoji}
          totalScore={totalScore}
          maxScore={maxScore}
          correctCount={correctCount}
          wrongCount={wrongCount}
          rows={shareRows}
          dailyRank={dailyRank}
          labels={shareLabels}
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-4"
            style={{
              borderColor: "rgba(212,175,55,0.4)",
              background: "rgba(212,175,55,0.08)",
            }}
          >
            <Medal size={14} style={{ color: "#D4AF37" }} />
            <span className="gold-text font-display font-extrabold text-xs tracking-widest">
              {t("dailyTitle")}
            </span>
          </div>
          <h1 className="gold-text font-display font-black tracking-wide">
            {t("dailySubtitle")}
          </h1>
          {categoryTitle ? (
            <p
              className="mt-2 font-display text-sm font-semibold"
              style={{ color: isDark ? "#CBD5E1" : "#334155" }}
            >
              {categoryTitle}
            </p>
          ) : null}
        </motion.div>

        {/* TODO: Uncomment when ranking system is ready - Today's rank position
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border overflow-hidden"
          style={{
            borderColor: "rgba(212,175,55,0.35)",
            background: isDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.97)",
          }}
        >
          <div
            className="h-1.5"
            style={{
              background:
                "linear-gradient(90deg, #B8960C, #D4AF37, #F0D060, #D4AF37, #B8960C)",
            }}
          />
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div
                className="font-display font-extrabold text-sm tracking-widest"
                style={{ color: isDark ? "#94A3B8" : "#64748B" }}
              >
                {t("yourRankToday")}
              </div>
              <div
                className="flex items-center gap-2 px-3 py-1 rounded-full"
                style={{ background: "rgba(34,197,94,0.15)", color: "#22C55E" }}
              >
                <Flame size={12} />
                <span className="font-display font-bold text-sm">
                  14 {t("dayStreak")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6 flex-wrap">
              <div className="text-center">
                <div className="text-6xl mb-1">🏆</div>
                <div className="gold-text font-display font-black text-4xl leading-none">
                  #{dailyRank.toLocaleString()}
                </div>
                <div
                  className="text-xs font-display"
                  style={{ color: isDark ? "#64748B" : "#94A3B8" }}
                >
                  GLOBAL RANK
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-3 min-w-[200px]">
                {[
                  {
                    icon: Star,
                    val: `${formatScore(totalScore)}/${maxScore}`,
                    label: t("yourScore"),
                    color: "#D4AF37",
                  },
                  {
                    icon: TrendingUp,
                    val: formatScore(totalScore),
                    label: "PTS",
                    color: "#22C55E",
                  },
                  {
                    icon: Users,
                    val: "24.8K",
                    label: t("playedTodayLabel"),
                    color: "#3B82F6",
                  },
                  {
                    icon: Trophy,
                    val: `Top ${Math.round((dailyRank / 24800) * 100)}%`,
                    label: "Percentile",
                    color: "#F59E0B",
                  },
                ].map(({ icon: Icon, val, label, color }) => (
                  <div
                    key={label}
                    className="rounded-xl p-3 border border-border"
                    style={{
                      background: isDark
                        ? "rgba(30,41,59,0.5)"
                        : "rgba(241,245,249,0.7)",
                    }}
                  >
                    <Icon size={14} style={{ color, marginBottom: 4 }} />
                    <div
                      className="font-display font-extrabold text-lg"
                      style={{ color: isDark ? "#F8FAFC" : "#0F172A" }}
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
            </div>
          </div>
        </motion.div>
        */}

        {hasRankingData && category && payload ? (
          <>
            <ResultsRankingComparison
              category={category}
              playerOrder={payload.playerOrder}
              getName={getName}
              animationDelay={0.25}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl border border-border p-5"
              style={{
                background: isDark
                  ? "rgba(15,23,42,0.8)"
                  : "rgba(255,255,255,0.9)",
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
                      style={{ color }}
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
          </>
        ) : null}

        {/* TODO: Uncomment when XP system is ready - XP Progress
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-border p-5"
          style={{
            background: isDark ? "rgba(15,23,42,0.8)" : "rgba(255,255,255,0.9)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flame size={16} style={{ color: "#F59E0B" }} />
              <span
                className="font-display font-extrabold text-sm tracking-wider"
                style={{ color: isDark ? "#F8FAFC" : "#0F172A" }}
              >
                {t("xpProgress")}
              </span>
            </div>
            <span
              className="px-2 py-0.5 rounded-full text-xs border font-display font-bold tracking-wider"
              style={{
                borderColor: "rgba(245,158,11,0.4)",
                background: "rgba(245,158,11,0.1)",
                color: "#F59E0B",
              }}
            >
              COMING SOON
            </span>
          </div>
          <div
            className="rounded-full overflow-hidden h-3 mb-2"
            style={{
              background: isDark ? "rgba(30,41,59,0.8)" : "rgba(226,232,240,0.8)",
            }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #F59E0B, #D97706)" }}
              initial={{ width: "0%" }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <p
            className="mt-2 text-xs italic"
            style={{ color: isDark ? "#475569" : "#94A3B8" }}
          >
            {t("xpNote")}
          </p>
        </motion.div>
        */}

        {/* TODO: Uncomment when global leaderboard is ready - Global Leaderboard
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl border border-border overflow-hidden"
          style={{
            background: isDark ? "rgba(15,23,42,0.85)" : "rgba(255,255,255,0.95)",
          }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Trophy size={16} style={{ color: "#D4AF37" }} />
              <span
                className="font-display font-extrabold text-sm tracking-wider"
                style={{ color: isDark ? "#F8FAFC" : "#0F172A" }}
              >
                {t("globalLeaderboard")}
              </span>
            </div>
            <Link
              href="/leaderboard"
              className="text-xs hover:text-primary transition-colors font-display font-semibold tracking-wider"
              style={{ color: "#D4AF37" }}
            >
              VIEW ALL →
            </Link>
          </div>
          {LEADERBOARD.slice(0, 5).map((p, i) => (
            <motion.div
              key={p.rank}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.06 }}
              className="flex items-center gap-3 px-5 py-3 border-b border-border last:border-0"
              style={{
                background:
                  i === 0
                    ? isDark
                      ? "rgba(212,175,55,0.05)"
                      : "rgba(212,175,55,0.03)"
                    : "transparent",
              }}
            >
              <div className="w-7 text-center font-display font-black text-base">
                {RANK_EMOJIS[p.rank] ?? (
                  <span style={{ color: isDark ? "#64748B" : "#94A3B8" }}>
                    {p.rank}
                  </span>
                )}
              </div>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shrink-0 font-display"
                style={{
                  background: "linear-gradient(135deg, #1E293B, #334155)",
                  color: "#D4AF37",
                }}
              >
                {p.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="truncate font-display font-bold text-sm"
                  style={{ color: isDark ? "#F8FAFC" : "#0F172A" }}
                >
                  {p.name}
                </div>
                <div
                  className="flex items-center gap-1.5 text-[0.7rem]"
                  style={{ color: isDark ? "#64748B" : "#94A3B8" }}
                >
                  <CountryFlag
                    code={p.countryCode}
                    className="h-3 aspect-[3/2] w-auto shrink-0"
                  />
                  {p.country}
                </div>
              </div>
              <div className="text-right">
                <div className="gold-text font-display font-extrabold text-base">
                  {p.score.toLocaleString()}
                </div>
                <div
                  className="text-[0.65rem] font-display"
                  style={{ color: isDark ? "#475569" : "#94A3B8" }}
                >
                  PTS
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border p-5 text-center"
          style={{
            borderColor: "rgba(212,175,55,0.25)",
            background: isDark ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.8)",
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Clock size={14} style={{ color: "#D4AF37" }} />
            <span
              className="font-display font-bold text-sm tracking-widest"
              style={{ color: isDark ? "#94A3B8" : "#64748B" }}
            >
              {t("nextChallenge").toUpperCase()}
            </span>
          </div>
          <div className="flex gap-3 justify-center">
            {[
              { val: pad(h), label: "HRS" },
              { val: pad(m), label: "MIN" },
              { val: pad(s), label: "SEC" },
            ].map(({ val, label }) => (
              <div
                key={label}
                className="rounded-xl px-5 py-3"
                style={{
                  background: isDark
                    ? "rgba(30,41,59,0.8)"
                    : "rgba(15,23,42,0.06)",
                }}
              >
                <div className="gold-text font-display font-black text-3xl">
                  {val}
                </div>
                <div
                  className="text-[0.6rem] font-display tracking-widest"
                  style={{ color: isDark ? "#475569" : "#94A3B8" }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-3"
        >
          <button
            type="button"
            onClick={handleShare}
            disabled={isGenerating}
            className="flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 border transition-all font-display font-bold tracking-wider disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              borderColor: "rgba(212,175,55,0.35)",
              background: "rgba(212,175,55,0.08)",
              color: "#D4AF37",
              cursor: isGenerating ? "not-allowed" : "pointer",
            }}
          >
            <Share2 size={16} />{" "}
            {isGenerating ? t("shareGenerating") : t("share")}
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

        <ShareImagePreviewDialog
          open={previewOpen}
          imageUrl={previewImageUrl}
          onClose={closePreview}
          onDownload={downloadPreview}
        />
      </div>
    </div>
  );
}
