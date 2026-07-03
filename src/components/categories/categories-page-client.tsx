"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Search, ChevronRight, Filter } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useIsDark } from "@/hooks/use-is-dark";

export interface CategoryCardData {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tag: string;
}

interface CategoriesPageClientProps {
  categories: CategoryCardData[];
}

const DIFF_COLORS = { Easy: "#22C55E", Medium: "#F59E0B", Hard: "#EF4444" };
const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"] as const;

export function CategoriesPageClient({ categories }: CategoriesPageClientProps) {
  const t = useTranslations("categoriesPage");
  const isDark = useIsDark();
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState<(typeof DIFFICULTIES)[number]>("All");
  const muted = isDark ? "#64748B" : "#94A3B8";
  const fg = isDark ? "#F8FAFC" : "#0F172A";

  const filtered = categories.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchDiff = diffFilter === "All" || c.difficulty === diffFilter;
    return matchSearch && matchDiff;
  });

  return (
    <div className="min-h-screen">
      <div
        className="border-b border-border"
        style={{ background: isDark ? "rgba(2,6,23,0.8)" : "rgba(248,250,252,0.95)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 rounded-full gold-gradient-btn" />
              <h1 className="gold-text font-display font-black tracking-wider">{t("title")}</h1>
            </div>
            <p className="ml-4 mt-1" style={{ color: muted }}>{t("description")}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: muted }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border outline-none transition-all focus:border-primary text-sm"
              style={{
                background: isDark ? "rgba(30,41,59,0.8)" : "rgba(255,255,255,0.9)",
                color: fg,
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} style={{ color: muted }} />
            <div className="flex gap-1.5 flex-wrap">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDiffFilter(d)}
                  className="px-3.5 py-2 rounded-lg text-xs transition-all border font-display font-bold tracking-wider"
                  style={{
                    borderColor: diffFilter === d ? "#D4AF37" : "var(--border)",
                    background:
                      diffFilter === d
                        ? "rgba(212,175,55,0.15)"
                        : isDark
                          ? "rgba(30,41,59,0.6)"
                          : "rgba(255,255,255,0.8)",
                    color: diffFilter === d ? "#D4AF37" : muted,
                  }}
                >
                  {d === "All" ? t("all") : d}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="mb-6 text-sm font-display font-semibold tracking-wider" style={{ color: muted }}>
          {t("found", { count: filtered.length })}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <div
                className="rounded-2xl overflow-hidden glass-card transition-all hover:border-primary h-full flex flex-col"
                style={{ background: isDark ? "rgba(15,23,42,0.85)" : "rgba(255,255,255,0.95)" }}
              >
                <div className="p-5 flex-1">
                  <div className="flex items-start justify-end mb-4">
                    <div className="flex flex-col items-end gap-1.5">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-bold font-display tracking-wider"
                        style={{
                          background: `${DIFF_COLORS[cat.difficulty]}20`,
                          color: DIFF_COLORS[cat.difficulty],
                        }}
                      >
                        {cat.difficulty}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs border font-display tracking-wider"
                        style={{ borderColor: "var(--border)", color: muted, fontSize: "0.65rem" }}
                      >
                        {cat.tag}
                      </span>
                    </div>
                  </div>
                  <h3 className="mb-2 font-display font-bold leading-snug" style={{ color: fg }}>
                    {cat.title}
                  </h3>
                  <p className="text-xs leading-relaxed line-clamp-3" style={{ color: muted }}>
                    {cat.description}
                  </p>
                </div>
                <div className="px-5 pb-5">
                  <div className="flex items-center justify-between mb-3 pt-3 border-t border-border">
                    <span className="text-xs font-display font-semibold tracking-wider" style={{ color: muted }}>
                      {t("questions")}
                    </span>
                    <span className="text-xs font-display font-semibold tracking-wider" style={{ color: muted }}>
                      TOP 10
                    </span>
                  </div>
                  <Link
                    href={`/categories/${cat.id}`}
                    className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all border font-display font-bold tracking-wider text-sm hover:gold-gradient-btn hover:text-[#0F172A] hover:border-transparent"
                    style={{
                      borderColor: "rgba(212,175,55,0.3)",
                      background: "rgba(212,175,55,0.08)",
                      color: "#D4AF37",
                    }}
                  >
                    {t("play")} <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20" style={{ color: muted }}>
            <div className="text-4xl mb-4">🔍</div>
            <div className="font-display font-semibold text-lg">{t("noResults")}</div>
            <div className="text-sm mt-1">{t("noResultsHint")}</div>
          </div>
        )}
      </div>
    </div>
  );
}
