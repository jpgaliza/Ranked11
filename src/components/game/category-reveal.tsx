"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-primary">{t("dailyReveal")}</DialogTitle>
          <DialogDescription>{t("dailyRevealHint")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <h2 className="text-2xl font-bold">{categoryTitle}</h2>
          <p className="text-muted-foreground">{categoryDescription}</p>
          <Button onClick={onStart} size="lg" className="w-full">
            {t("startChallenge")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
