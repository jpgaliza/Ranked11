"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sun,
  Moon,
  Globe,
  Trophy,
  Menu,
  X,
  Layers,
  Home,
  Medal,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useTheme } from "next-themes";
import { useIsDark } from "@/hooks/use-is-dark";
import type { Locale } from "@/i18n/routing";

function getActiveScreen(pathname: string): string {
  if (pathname.includes("/leaderboard")) return "leaderboard";
  if (pathname.includes("/categories")) return "categories";
  if (pathname.includes("/daily")) return "daily";
  if (pathname === "/" || pathname.match(/^\/(en|pt-BR)\/?$/)) return "home";
  return "";
}

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = useIsDark();
  const [menuOpen, setMenuOpen] = useState(false);
  const currentScreen = getActiveScreen(pathname);
  const showLeaderboardNav = false;

  const navItems = [
    { id: "home", href: "/", label: t("home"), icon: Home },
    {
      id: "categories",
      href: "/categories",
      label: t("categories"),
      icon: Layers,
    },
    ...(showLeaderboardNav
      ? [
          {
            id: "leaderboard",
            href: "/leaderboard",
            label: t("leaderboard"),
            icon: Trophy,
          },
        ]
      : []),
  ] as const;

  const toggleLanguage = () => {
    router.replace(pathname, { locale: locale === "en" ? "pt-BR" : "en" });
  };

  const navBg = isDark ? "rgba(2,6,23,0.92)" : "rgba(248,250,252,0.92)";

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-border glass-card"
      style={{ background: navBg }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/logo.svg"
            alt="Ranked11"
            width={32}
            height={32}
            className="h-8 w-8"
            priority
          />
          <span className="gold-text hidden sm:block font-display font-bold text-xl tracking-wider">
            RANKED11
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map(({ id, href, label, icon: Icon }) => (
            <Link
              key={id}
              href={href}
              className={`relative px-4 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 font-display font-semibold tracking-wide nav-page-link ${
                currentScreen === id ? "nav-page-link--active" : ""
              }`}
            >
              <Icon size={15} />
              {label}
              {currentScreen === id && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #D4AF37, #F0D060)",
                  }}
                />
              )}
            </Link>
          ))}
          <Link
            href="/daily"
            className="ml-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 font-display font-bold tracking-wide nav-daily-link"
          >
            <Medal size={14} />
            {t("daily")}
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative group">
            <button
              type="button"
              onClick={toggleLanguage}
              title={t("switchLanguage")}
              aria-label={t("switchLanguage")}
              className="flex h-9 items-center gap-1.5 px-3 rounded-lg text-xs transition-all hover:bg-primary/10 border border-border font-display font-bold tracking-wider cursor-pointer"
              style={{ color: isDark ? "#94A3B8" : "#475569" }}
            >
              <Globe size={14} />
              {locale === "en" ? "EN" : "PT"}
            </button>
            <span
              role="tooltip"
              className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md px-2.5 py-1 text-[0.65rem] font-display font-semibold tracking-wide opacity-0 transition-opacity duration-150 group-hover:opacity-100"
              style={{
                background: isDark
                  ? "rgba(15,23,42,0.95)"
                  : "rgba(255,255,255,0.98)",
                color: isDark ? "#CBD5E1" : "#475569",
                border: "1px solid rgba(212,175,55,0.25)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              }}
            >
              {t("switchLanguage")}
            </span>
          </div>
          <div className="relative group">
            <button
              type="button"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              title={isDark ? t("switchToLight") : t("switchToDark")}
              aria-label={isDark ? t("switchToLight") : t("switchToDark")}
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center transition-all hover:border-primary hover:text-primary cursor-pointer"
              style={{ color: isDark ? "#94A3B8" : "#475569" }}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <span
              role="tooltip"
              className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md px-2.5 py-1 text-[0.65rem] font-display font-semibold tracking-wide opacity-0 transition-opacity duration-150 group-hover:opacity-100"
              style={{
                background: isDark
                  ? "rgba(15,23,42,0.95)"
                  : "rgba(255,255,255,0.98)",
                color: isDark ? "#CBD5E1" : "#475569",
                border: "1px solid rgba(212,175,55,0.25)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              }}
            >
              {isDark ? t("switchToLight") : t("switchToDark")}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 rounded-lg border border-border flex items-center justify-center"
            style={{ color: isDark ? "#94A3B8" : "#475569" }}
            aria-label="Menu"
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border px-4 py-3 space-y-1"
            style={{ background: navBg }}
          >
            {navItems.map(({ id, href, label, icon: Icon }) => (
              <Link
                key={id}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-display font-semibold tracking-wide nav-page-link ${
                  currentScreen === id ? "nav-page-link--active" : ""
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
            <Link
              href="/daily"
              onClick={() => setMenuOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-display font-bold tracking-wide nav-daily-link--mobile"
            >
              <Medal size={18} />
              {t("daily")}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
