import { downloadBlob } from "./download-blob";

export function buildShareFilename(mode: string, score: number): string {
  const date = new Date().toISOString().slice(0, 10);
  return `ranked11-${mode}-${score}-${date}.png`;
}

export async function shareOrDownloadResultImage(
  blob: Blob,
  filename: string,
  fallbackText: string,
): Promise<"shared" | "downloaded" | "clipboard"> {
  const file = new File([blob], filename, { type: "image/png" });

  if (typeof navigator.share === "function" && typeof navigator.canShare === "function") {
    try {
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "Ranked11",
          text: fallbackText,
          files: [file],
        });
        return "shared";
      }
    } catch {
      // Fall through to download or clipboard.
    }
  }

  try {
    downloadBlob(blob, filename);
    return "downloaded";
  } catch {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(fallbackText);
      return "clipboard";
    }
    throw new Error("Share failed");
  }
}
