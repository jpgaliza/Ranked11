"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { exportElementAsPng } from "@/lib/share/export-element-as-png";
import { buildShareFilename } from "@/lib/share/share-result-image";
import { downloadBlob } from "@/lib/share/download-blob";
import type { ShareResultCardProps } from "@/components/results/share/share-result-card";

interface GeneratePreviewOptions {
  mode: "category" | "daily";
  totalScore: number;
}

interface SharePreviewState {
  url: string;
  blob: Blob;
  filename: string;
}

export function useShareResultImage() {
  const shareCardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [preview, setPreview] = useState<SharePreviewState | null>(null);

  const closePreview = useCallback(() => {
    setPreview((current) => {
      if (current?.url) {
        URL.revokeObjectURL(current.url);
      }
      return null;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (preview?.url) {
        URL.revokeObjectURL(preview.url);
      }
    };
  }, [preview?.url]);

  const generatePreview = useCallback(
    async ({
      mode,
      totalScore,
    }: GeneratePreviewOptions): Promise<boolean> => {
      const element = shareCardRef.current;
      if (!element) return false;

      setIsGenerating(true);
      try {
        closePreview();

        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => resolve());
        });

        const blob = await exportElementAsPng(element);
        const filename = buildShareFilename(mode, totalScore);
        const url = URL.createObjectURL(blob);
        setPreview({ url, blob, filename });
        return true;
      } catch {
        return false;
      } finally {
        setIsGenerating(false);
      }
    },
    [closePreview],
  );

  const downloadPreview = useCallback(() => {
    if (!preview) return;
    downloadBlob(preview.blob, preview.filename);
  }, [preview]);

  return {
    shareCardRef,
    isGenerating,
    previewOpen: preview !== null,
    previewImageUrl: preview?.url ?? null,
    generatePreview,
    closePreview,
    downloadPreview,
  };
}

export type { ShareResultCardProps };
