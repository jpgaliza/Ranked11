"use client";

import { Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { useIsDark } from "@/hooks/use-is-dark";
import { cn } from "@/lib/utils/cn";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ShareImagePreviewDialogProps {
  open: boolean;
  imageUrl: string | null;
  onClose: () => void;
  onDownload: () => void;
}

export function ShareImagePreviewDialog({
  open,
  imageUrl,
  onClose,
  onDownload,
}: ShareImagePreviewDialogProps) {
  const t = useTranslations("results");
  const isDark = useIsDark();

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        className={cn(
          "max-h-[90vh] max-w-2xl gap-0 overflow-hidden border-0 p-0",
          isDark ? "glass-daily-card" : "border border-border bg-white shadow-lg",
        )}
      >
        <div className="relative z-[1] h-1 w-full gold-gradient-btn" />
        <div className="relative z-[1] max-h-[90vh] overflow-y-auto p-6 pt-5">
          <DialogHeader className="space-y-2 text-center sm:text-center">
            <DialogTitle className="gold-text font-display text-lg font-extrabold tracking-widest">
              {t("sharePreviewTitle")}
            </DialogTitle>
            <DialogDescription
              className="text-sm font-medium leading-relaxed"
              style={{ color: isDark ? "#CBD5E1" : "#475569" }}
            >
              {t("sharePreviewHint")}
            </DialogDescription>
          </DialogHeader>

          {imageUrl ? (
            <div className="mt-5 overflow-hidden rounded-xl border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={t("sharePreviewTitle")}
                className="block h-auto w-full"
              />
            </div>
          ) : null}

          <Button
            type="button"
            onClick={onDownload}
            className="gold-glow gold-gradient-btn mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3.5 font-display font-extrabold tracking-wider"
            style={{ color: "#0F172A" }}
          >
            <Download size={16} />
            {t("shareDownload")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
