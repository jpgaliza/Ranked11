"use client";

import { motion } from "motion/react";
import {
  Trophy,
  Flame,
  ChevronUp,
  ChevronDown,
  Minus,
  Crown,
  Shield,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useIsDark } from "@/hooks/use-is-dark";
import {
  LEADERBOARD,
  BADGE_COLORS,
  BADGE_LABELS,
  type LeaderboardPlayer,
} from "@/data/leaderboard-mock";

const MOCK_CHANGES = [2, -1, 0, 3, -2, 0, 1, -3, 2, -1];

function PodiumCard({
  player,
  pos,
  isDark,
  delay,
  featured = false,
}: {
  player: LeaderboardPlayer;
  pos: number;
  isDark: boolean;
  delay: number;
  featured?: boolean;
}) {
  const medalColors = [
    "",
    "from-yellow-400 to-amber-500",
    "from-slate-300 to-slate-400",
    "from-amber-700 to-amber-800",
  ];
  const heights = ["", "mt-0", "mt-6", "mt-4"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`relative overflow-hidden rounded-2xl border text-center p-4 ${heights[pos]}`}
      style={{
        borderColor: featured ? "rgba(212,175,55,0.4)" : "var(--border)",
        background: featured
          ? isDark
            ? "rgba(30,41,59,0.9)"
            : "rgba(255,255,255,0.97)"
          : isDark
            ? "rgba(15,23,42,0.7)"
            : "rgba(255,255,255,0.8)",
        boxShadow: featured ? "0 0 32px rgba(212,175,55,0.2)" : "none",
      }}
    >
      {featured && (
        <div
          className="h-1 absolute top-0 left-0 right-0"
          style={{
            background: "linear-gradient(90deg, #B8960C, #D4AF37, #F0D060)",
          }}
        />
      )}

      <div className={`text-2xl mb-3 ${featured ? "text-4xl" : ""}`}>
        {["", "🥇", "🥈", "🥉"][pos]}
      </div>

      <div
        className={`${featured ? "w-14 h-14" : "w-11 h-11"} rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-black font-display`}
        style={{
          background: "linear-gradient(135deg, #1E293B, #334155)",
          color: "#D4AF37",
        }}
      >
        {player.avatar}
      </div>

      <div
        className={`truncate font-display font-bold ${featured ? "text-[0.95rem]" : "text-sm"}`}
        style={{ color: isDark ? "#F8FAFC" : "#0F172A" }}
      >
        {player.name}
      </div>

      <div
        className="text-[0.65rem] mb-1.5"
        style={{ color: isDark ? "#64748B" : "#94A3B8" }}
      >
        {player.flag}
      </div>

      <div className={`bg-gradient-to-r ${medalColors[pos]} rounded-lg py-1 px-2`}>
        <div
          className={`font-display font-black ${featured ? "text-lg" : "text-sm"}`}
          style={{ color: "#0F172A" }}
        >
          {player.score.toLocaleString()}
        </div>
        <div
          className="text-[0.55rem] font-display tracking-wider"
          style={{ color: "rgba(0,0,0,0.6)" }}
        >
          PTS
        </div>
      </div>
    </motion.div>
  );
}

export function LeaderboardScreen() {
  const t = useTranslations("leaderboard");
  const isDark = useIsDark();

  return (
    <div className="min-h-[calc(100dvh-4rem)] pb-12">
      <div
        className="border-b border-border"
        style={{
          background: isDark ? "rgba(2,6,23,0.9)" : "rgba(248,250,252,0.97)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-4"
              style={{
                borderColor: "rgba(212,175,55,0.4)",
                background: "rgba(212,175,55,0.08)",
              }}
            >
              <Trophy size={13} style={{ color: "#D4AF37" }} />
              <span className="gold-text font-display font-extrabold text-xs tracking-widest">
                {t("season")}
              </span>
            </div>
            <h1 className="gold-text font-display font-black tracking-wide mb-2">
              {t("title")}
            </h1>
            <p className="text-sm" style={{ color: isDark ? "#64748B" : "#94A3B8" }}>
              {t("sub")}
            </p>
            <p
              className="mt-3 text-xs italic"
              style={{ color: isDark ? "#475569" : "#94A3B8" }}
            >
              {t("previewNotice")}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          <PodiumCard player={LEADERBOARD[1]!} pos={2} isDark={isDark} delay={0.2} />
          <PodiumCard
            player={LEADERBOARD[0]!}
            pos={1}
            isDark={isDark}
            delay={0.1}
            featured
          />
          <PodiumCard player={LEADERBOARD[2]!} pos={3} isDark={isDark} delay={0.3} />
        </motion.div>

        <div
          className="grid gap-3 px-4 py-2 mb-2 hidden sm:grid"
          style={{ gridTemplateColumns: "3rem 1fr 7rem 6rem 4rem 5rem" }}
        >
          {[t("rank"), t("player"), t("score"), t("streak"), t("change"), t("badge")].map(
            (h) => (
              <div
                key={h}
                className="font-display font-bold text-[0.7rem] tracking-widest"
                style={{ color: isDark ? "#475569" : "#94A3B8" }}
              >
                {h.toUpperCase()}
              </div>
            ),
          )}
        </div>

        <div className="space-y-2">
          {LEADERBOARD.map((p, i) => {
            const change = MOCK_CHANGES[i] ?? 0;
            const isTop3 = p.rank <= 3;

            return (
              <motion.div
                key={p.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="relative overflow-hidden rounded-2xl border border-border transition-all duration-200 hover:border-primary group"
                style={{
                  background: isTop3
                    ? isDark
                      ? "rgba(30,41,59,0.6)"
                      : "rgba(212,175,55,0.04)"
                    : isDark
                      ? "rgba(15,23,42,0.7)"
                      : "rgba(255,255,255,0.8)",
                  borderColor: isTop3 ? "rgba(212,175,55,0.25)" : "var(--border)",
                }}
              >
                {isTop3 && (
                  <div
                    className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-full"
                    style={{
                      background:
                        p.rank === 1 ? "#D4AF37" : p.rank === 2 ? "#94A3B8" : "#CD7F32",
                    }}
                  />
                )}

                <div className="flex items-center gap-3 px-4 py-3.5">
                  <div className="w-8 shrink-0 text-center">
                    {p.rank <= 3 ? (
                      <span className="text-xl">{["🥇", "🥈", "🥉"][p.rank - 1]}</span>
                    ) : (
                      <span
                        className="font-display font-extrabold text-lg"
                        style={{ color: isDark ? "#475569" : "#94A3B8" }}
                      >
                        {p.rank}
                      </span>
                    )}
                  </div>

                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black shrink-0 font-display"
                    style={{
                      background: isTop3
                        ? "linear-gradient(135deg, #1E293B, #334155)"
                        : isDark
                          ? "#1E293B"
                          : "#E2E8F0",
                      color: "#D4AF37",
                    }}
                  >
                    {p.avatar}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="truncate font-display font-bold text-base"
                        style={{ color: isDark ? "#F8FAFC" : "#0F172A" }}
                      >
                        {p.name}
                      </span>
                      {p.rank === 1 && (
                        <Crown size={13} style={{ color: "#D4AF37", flexShrink: 0 }} />
                      )}
                    </div>
                    <div
                      className="text-[0.72rem]"
                      style={{ color: isDark ? "#64748B" : "#94A3B8" }}
                    >
                      {p.flag} {p.country}
                    </div>
                  </div>

                  <div className="hidden sm:block text-right shrink-0 w-24">
                    <div className="gold-text font-display font-extrabold text-base">
                      {p.score.toLocaleString()}
                    </div>
                    <div
                      className="text-[0.62rem] font-display tracking-wider"
                      style={{ color: isDark ? "#475569" : "#94A3B8" }}
                    >
                      PTS
                    </div>
                  </div>

                  <div
                    className="hidden sm:flex items-center gap-1.5 shrink-0 w-20 justify-center px-2 py-1 rounded-lg"
                    style={{ background: "rgba(34,197,94,0.1)", color: "#22C55E" }}
                  >
                    <Flame size={12} />
                    <span className="font-display font-bold text-sm">{p.streak}d</span>
                  </div>

                  <div
                    className="hidden sm:flex items-center gap-0.5 shrink-0 w-12 justify-center font-display font-bold text-sm"
                    style={{
                      color:
                        change > 0
                          ? "#22C55E"
                          : change < 0
                            ? "#EF4444"
                            : isDark
                              ? "#475569"
                              : "#94A3B8",
                    }}
                  >
                    {change > 0 ? (
                      <ChevronUp size={13} />
                    ) : change < 0 ? (
                      <ChevronDown size={13} />
                    ) : (
                      <Minus size={13} />
                    )}
                    {change !== 0 ? Math.abs(change) : "—"}
                  </div>

                  <div className="shrink-0">
                    <div
                      className={`px-2 py-0.5 rounded-full text-[0.6rem] font-black bg-gradient-to-r ${BADGE_COLORS[p.badge]} font-display tracking-wider`}
                      style={{ color: "#0F172A" }}
                    >
                      {BADGE_LABELS[p.badge]}
                    </div>
                  </div>
                </div>

                <div className="sm:hidden flex items-center gap-4 px-4 pb-3 border-t border-border">
                  <div className="flex items-center gap-1">
                    <Trophy size={11} style={{ color: "#D4AF37" }} />
                    <span className="gold-text font-display font-bold text-sm">
                      {p.score.toLocaleString()} pts
                    </span>
                  </div>
                  <div className="flex items-center gap-1" style={{ color: "#22C55E" }}>
                    <Flame size={11} />
                    <span className="font-display font-bold text-sm">{p.streak}d streak</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 text-center flex items-center justify-center gap-2 text-sm"
          style={{ color: isDark ? "#334155" : "#CBD5E1" }}
        >
          <Shield size={13} />
          Rankings reset every season · Anti-cheat protected
        </motion.div>
      </div>
    </div>
  );
}
