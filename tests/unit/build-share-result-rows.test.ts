import { describe, it, expect } from "vitest";
import { buildShareResultRows } from "@/lib/share/build-share-result-rows";
import type { CategoryDefinition } from "@/types/category";

const category: CategoryDefinition = {
  id: "test",
  type: "team",
  i18nKey: "categories.test",
  correctOrder: ["a", "b"],
  items: {
    a: { id: "a", statValue: 2, metadata: { countryCode: "BR" } },
    b: { id: "b", statValue: 1, metadata: { countryCode: "AR" } },
  },
};

describe("buildShareResultRows", () => {
  it("marks rows correct when stat values match tied slots", () => {
    const tiedCategory: CategoryDefinition = {
      ...category,
      correctOrder: ["a", "b", "c", "d"],
      items: {
        a: { id: "a", statValue: 2, metadata: { countryCode: "BR" } },
        b: { id: "b", statValue: 2, metadata: { countryCode: "AR" } },
        c: { id: "c", statValue: 1, metadata: { countryCode: "DE" } },
        d: { id: "d", statValue: 1, metadata: { countryCode: "IT" } },
      },
    };

    const rows = buildShareResultRows(
      tiedCategory,
      ["b", "a", "d", "c"],
      (id) => id.toUpperCase(),
    );

    expect(rows[0].isCorrect).toBe(true);
    expect(rows[1].isCorrect).toBe(true);
    expect(rows[2].isCorrect).toBe(true);
    expect(rows[3].isCorrect).toBe(true);
  });

  it("includes player and correct answer names", () => {
    const rows = buildShareResultRows(category, ["b", "a"], (id) => id.toUpperCase());
    expect(rows[0].playerName).toBe("B");
    expect(rows[0].correctName).toBe("A");
  });
});
