import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { buildShareFilename, shareOrDownloadResultImage } from "@/lib/share/share-result-image";
import { downloadBlob } from "@/lib/share/download-blob";
import { getScoreGrade } from "@/lib/share/score-grades";

vi.mock("@/lib/share/download-blob", () => ({
  downloadBlob: vi.fn(),
}));

describe("buildShareFilename", () => {
  it("builds a predictable filename", () => {
    const filename = buildShareFilename("category", 85);
    expect(filename).toMatch(/^ranked11-category-85-\d{4}-\d{2}-\d{2}\.png$/);
  });
});

describe("getScoreGrade", () => {
  it("returns perfect grade for high scores", () => {
    expect(getScoreGrade(100).key).toBe("perfectMsg");
  });

  it("returns keep grade for low scores", () => {
    expect(getScoreGrade(10).key).toBe("keepMsg");
  });
});

describe("shareOrDownloadResultImage", () => {
  const blob = new Blob(["test"], { type: "image/png" });
  const filename = "ranked11-category-80-2026-07-15.png";
  const fallbackText = "Ranked11 score";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("downloads when native file share is unavailable", async () => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(navigator, "canShare", {
      configurable: true,
      value: undefined,
    });

    const result = await shareOrDownloadResultImage(blob, filename, fallbackText);
    expect(result).toBe("downloaded");
    expect(downloadBlob).toHaveBeenCalledWith(blob, filename);
  });

  it("falls back to clipboard when download fails", async () => {
    vi.mocked(downloadBlob).mockImplementation(() => {
      throw new Error("download failed");
    });

    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: undefined,
    });

    const result = await shareOrDownloadResultImage(blob, filename, fallbackText);
    expect(result).toBe("clipboard");
    expect(writeText).toHaveBeenCalledWith(fallbackText);
  });
});
