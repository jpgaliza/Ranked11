"use client";

import { motion } from "motion/react";
import { Medal } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsDark } from "@/hooks/use-is-dark";

interface CategoryRevealProps {
  open: boolean;
  categoryTitle: string;
  categoryDescription: string;
  onStart: () => void;
}

export function CategoryReveal({
  open,
  categoryTitle,
  categoryDescription,
  onStart,
}: CategoryRevealProps) {
  const t = useTranslations("game");
  const isDark = useIsDark();
  const hintColor = isDark ? "#CBD5E1" : "#475569";
  const bodyColor = isDark ? "#94A3B8" : "#334155";
  const titleColor = isDark ? "#F8FAFC" : "#0F172A";

  return (
    <Dialog open={open}>
      <DialogContent
        className="glass-daily-card gold-glow sm:max-w-md p-0 gap-0 border-0"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <div className="relative z-[1] h-1 w-full gold-gradient-btn" />
        <div className="relative z-[1] p-6 pt-5">
          <DialogHeader className="space-y-3 text-left pr-8">
            <div className="inline-flex items-center gap-2">
              <Medal size={16} style={{ color: "#D4AF37" }} />
              <DialogTitle className="gold-text font-display font-extrabold text-base tracking-widest">
                {t("dailyReveal").toUpperCase()}
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm font-medium" style={{ color: hintColor }}>
              {t("dailyRevealHint")}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <div className="rounded-xl p-4 glass-daily-inset">
              <h2 className="font-display font-bold text-xl leading-snug" style={{ color: titleColor }}>
                {categoryTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed font-medium" style={{ color: bodyColor }}>
                {categoryDescription}
              </p>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStart}
              className="w-full py-3.5 rounded-xl flex items-center justify-center gold-glow gold-gradient-btn font-display font-extrabold tracking-wider cursor-pointer"
              style={{ color: "#0F172A" }}
            >
              {t("startChallenge")}
            </motion.button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
