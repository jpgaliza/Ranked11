"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Trophy,
  ChevronRight,
  Flame,
  Clock,
  Users,
  Star,
  Play,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useIsDark } from "@/hooks/use-is-dark";
import { getMsUntilNextDailyChallenge } from "@/lib/game/daily-challenge";
import { LEADERBOARD } from "@/data/leaderboard-mock";
import { CountryFlag } from "@/components/ui/country-flag";
import { getCategoryTypeColor } from "@/lib/view-models/category-display";
import type { CategoryManifestEntry, CategoryType } from "@/types/category";

interface HomePageProps {
  featured: Array<{
    id: string;
    title: string;
    description: string;
    difficulty: "Easy" | "Medium" | "Hard";
    type: CategoryType;
  }>;
}

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const ms = getMsUntilNextDailyChallenge();
      const total = Math.max(0, Math.floor(ms / 1000));
      setTimeLeft({
        h: Math.floor(total / 3600),
        m: Math.floor((total % 3600) / 60),
        s: total % 60,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return timeLeft;
}

const DIFF_COLORS: Record<string, string> = {
  Easy: "#22C55E",
  Medium: "#F59E0B",
  Hard: "#EF4444",
};

export function HomePage({ featured }: HomePageProps) {
  const t = useTranslations("home");
  const tCategories = useTranslations("categoriesPage");
  const isDark = useIsDark();
  const { h, m, s } = useCountdown();
  const pad = (n: number) => String(n).padStart(2, "0");
  const muted = isDark ? "#64748B" : "#94A3B8";
  const fg = isDark ? "#F8FAFC" : "#0F172A";
  const showTopPlayers = false;

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&h=900&fit=crop&auto=format"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div
            className="absolute inset-0"
            style={{
              background: isDark
                ? "linear-gradient(180deg, rgba(2,6,23,0.7) 0%, rgba(2,6,23,0.95) 100%)"
                : "linear-gradient(180deg, rgba(248,250,252,0.5) 0%, rgba(248,250,252,0.98) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-5"
                style={{
                  borderColor: "rgba(212,175,55,0.4)",
                  background: "rgba(212,175,55,0.08)",
                }}
              >
                <Flame size={13} style={{ color: "#D4AF37" }} />
                <span className="gold-text font-display font-bold text-xs tracking-widest">
                  {t("heroEyebrow")}
                </span>
              </div>
              <h1 className="gold-text mb-4 font-display font-black text-5xl tracking-tight">
                {t("heroTitle")}
              </h1>
              <p
                className="mb-8 max-w-md leading-relaxed"
                style={{ color: muted }}
              >
                {t("heroSub")}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/daily">
                  <motion.span
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl gold-glow gold-gradient-btn font-display font-extrabold tracking-wider"
                  >
                    <Play size={16} fill="#0F172A" />
                    {t("playBtn")}
                  </motion.span>
                </Link>
                <Link href="/categories">
                  <motion.span
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-border font-display font-bold tracking-wider"
                    style={{ color: isDark ? "#CBD5E1" : "#334155" }}
                  >
                    {t("browseBtn")}
                    <ChevronRight size={16} />
                  </motion.span>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <div className="relative rounded-2xl overflow-hidden gold-glow glass-daily-card">
                <div className="relative z-[1] h-1 w-full gold-gradient-btn" />
                <div className="relative z-[1] p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <Trophy size={18} style={{ color: "#D4AF37" }} />
                      <span className="gold-text font-display font-extrabold text-sm tracking-widest">
                        {t("heroEyebrow")}
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-sm"
                      style={{
                        background: "rgba(34,197,94,0.18)",
                        border: "1px solid rgba(34,197,94,0.25)",
                        color: "#22C55E",
                      }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="font-display font-bold text-[0.7rem] tracking-wider">
                        {t("live")}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-xl p-4 mb-5 text-center glass-daily-inset">
                    <div className="text-4xl mb-2">🏆</div>
                    <div
                      className="font-display font-black text-3xl tracking-widest"
                      style={{ color: "#D4AF37" }}
                    >
                      ???
                    </div>
                    <p className="text-xs mt-1" style={{ color: muted }}>
                      {t("dailyDesc")}
                    </p>
                  </div>
                  <div className="mb-5">
                    <div
                      className="flex items-center gap-1.5 mb-2 text-xs"
                      style={{ color: muted }}
                    >
                      <Clock size={12} />
                      <span className="font-display font-semibold tracking-wider">
                        {t("countdown")}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {[
                        { val: pad(h), label: "HRS" },
                        { val: pad(m), label: "MIN" },
                        { val: pad(s), label: "SEC" },
                      ].map(({ val, label }) => (
                        <div
                          key={label}
                          className="flex-1 rounded-xl p-3 text-center glass-daily-inset"
                        >
                          <div className="gold-text font-display font-extrabold text-2xl">
                            {val}
                          </div>
                          <div
                            className="text-[0.6rem] font-display tracking-widest"
                            style={{ color: muted }}
                          >
                            {label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Link href="/daily">
                    <motion.span
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 gold-glow gold-gradient-btn font-display font-extrabold tracking-wider"
                    >
                      <Zap size={16} fill="#0F172A" />
                      {t("playBtn")}
                    </motion.span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {showTopPlayers && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 rounded-full gold-gradient-btn" />
              <h2
                className="font-display font-extrabold tracking-wider"
                style={{ color: fg }}
              >
                {t("topPlayers")}
              </h2>
            </div>
            <Link
              href="/leaderboard"
              className="flex items-center gap-1 text-sm font-display font-semibold tracking-wider text-primary"
            >
              {t("viewAll")} <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {LEADERBOARD.slice(0, 3).map((p, i) => (
              <motion.div
                key={p.rank}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative overflow-hidden rounded-2xl p-5 glass-card hover:border-primary transition-all"
                style={{
                  background: isDark
                    ? "rgba(15,23,42,0.8)"
                    : "rgba(255,255,255,0.9)",
                }}
              >
                <div className="absolute top-4 right-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black font-display"
                    style={{
                      background:
                        i === 0
                          ? "linear-gradient(135deg, #D4AF37, #F0D060)"
                          : i === 1
                            ? "linear-gradient(135deg, #9CA3AF, #D1D5DB)"
                            : "linear-gradient(135deg, #CD7F32, #B87333)",
                      color: "#0F172A",
                    }}
                  >
                    {p.rank}
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-black font-display"
                    style={{
                      background: "linear-gradient(135deg, #1E293B, #334155)",
                      color: "#D4AF37",
                    }}
                  >
                    {p.avatar}
                  </div>
                  <div>
                    <div
                      className="font-display font-bold text-sm"
                      style={{ color: fg }}
                    >
                      {p.name}
                    </div>
                    <div
                      className="flex items-center gap-1.5 text-xs"
                      style={{ color: muted }}
                    >
                      <CountryFlag
                        code={p.countryCode}
                        className="h-3 aspect-[3/2] w-auto shrink-0"
                      />
                      {p.country}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>
                    <div className="gold-text font-display font-extrabold text-xl">
                      {p.score.toLocaleString()}
                    </div>
                    <div
                      className="text-[0.7rem] font-display tracking-wider"
                      style={{ color: muted }}
                    >
                      {t("score").toUpperCase()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="flex items-center gap-1 justify-end font-display font-bold text-lg"
                      style={{ color: "#22C55E" }}
                    >
                      <Flame size={13} />
                      {p.streak}
                    </div>
                    <div
                      className="text-[0.7rem] font-display tracking-wider"
                      style={{ color: muted }}
                    >
                      {t("streak").toUpperCase()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 rounded-full gold-gradient-btn" />
              <h2
                className="font-display font-extrabold tracking-wider"
                style={{ color: fg }}
              >
                {t("categoriesSection")}
              </h2>
            </div>
            <p className="ml-4 text-sm" style={{ color: muted }}>
              {t("categoriesSub")}
            </p>
          </div>
          <Link
            href="/categories"
            className="hidden sm:flex items-center gap-1 text-sm font-display font-semibold tracking-wider text-primary"
          >
            {t("viewAll")} <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((cat, i) => {
            const typeColor = getCategoryTypeColor(cat.type);
            return (
              <Link key={cat.id} href={`/categories/${cat.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-left relative overflow-hidden rounded-2xl p-5 glass-card group transition-all hover:border-primary h-full"
                  style={{
                    background: isDark
                      ? "rgba(15,23,42,0.8)"
                      : "rgba(255,255,255,0.9)",
                  }}
                >
                  <div className="mb-3 flex items-center gap-1.5">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold font-display tracking-wider"
                      style={{
                        background: `${DIFF_COLORS[cat.difficulty]}20`,
                        color: DIFF_COLORS[cat.difficulty],
                      }}
                    >
                      {tCategories(`difficultyLabels.${cat.difficulty}`)}
                    </span>
                    <span
                      className="rounded-full border bg-transparent px-2 py-0.5 text-xs font-display font-semibold tracking-wider"
                      style={{
                        borderColor: typeColor,
                        color: typeColor,
                        fontSize: "0.65rem",
                      }}
                    >
                      {tCategories(`typeLabels.${cat.type}`)}
                    </span>
                  </div>
                  <div
                    className="mb-2 font-display font-bold leading-snug"
                    style={{ color: fg }}
                  >
                    {cat.title}
                  </div>
                  <p
                    className="text-xs leading-relaxed line-clamp-2"
                    style={{ color: muted }}
                  >
                    {cat.description}
                  </p>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export type { CategoryManifestEntry };
