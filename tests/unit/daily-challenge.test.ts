import { describe, it, expect } from "vitest";
import {
  getDailyCategoryId,
  getDaysSinceEpoch,
  getUTCDateKey,
  ROTATION_ORDER,
} from "@/lib/game/daily-challenge";

describe("daily-challenge", () => {
  it("returns consistent category for same UTC date", () => {
    const date = new Date("2026-06-15T12:00:00Z");
    expect(getDailyCategoryId(date)).toBe(getDailyCategoryId(date));
  });

  it("rotates through categories", () => {
    const id1 = getDailyCategoryId(new Date("2026-06-13T00:00:00Z"));
    const id2 = getDailyCategoryId(new Date("2026-06-14T00:00:00Z"));
    expect(id1).not.toBe(id2);
  });

  it("uses valid category from rotation order", () => {
    const id = getDailyCategoryId(new Date("2026-06-13T00:00:00Z"));
    expect(ROTATION_ORDER).toContain(id);
  });

  it("formats UTC date key", () => {
    expect(getUTCDateKey(new Date("2026-06-13T15:30:00Z"))).toBe("2026-06-13");
  });

  it("increments days since epoch", () => {
    const d1 = getDaysSinceEpoch(new Date("2026-06-13T00:00:00Z"));
    const d2 = getDaysSinceEpoch(new Date("2026-06-14T00:00:00Z"));
    expect(d2 - d1).toBe(1);
  });
});
