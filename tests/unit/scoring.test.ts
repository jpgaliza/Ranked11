import { describe, it, expect } from "vitest";
import { calculateScore, isSlotCorrect } from "@/lib/game/scoring";
import type { RankedItem } from "@/types/category";

const correctOrder = [
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
];

function buildUniqueItems(ids: string[]): Record<string, RankedItem> {
  return Object.fromEntries(
    ids.map((id, index) => [id, { id, statValue: ids.length - index }]),
  );
}

const uniqueItems = buildUniqueItems(correctOrder);

const tieCorrectOrder = [
  "brazil",
  "germany",
  "argentina",
  "italy",
  "mexico",
  "france",
  "spain",
  "england",
  "belgium",
  "uruguay",
];

const tieItems: Record<string, RankedItem> = {
  brazil: { id: "brazil", statValue: 22 },
  germany: { id: "germany", statValue: 20 },
  argentina: { id: "argentina", statValue: 18 },
  italy: { id: "italy", statValue: 18 },
  mexico: { id: "mexico", statValue: 17 },
  france: { id: "france", statValue: 16 },
  spain: { id: "spain", statValue: 16 },
  england: { id: "england", statValue: 16 },
  belgium: { id: "belgium", statValue: 14 },
  uruguay: { id: "uruguay", statValue: 14 },
};

describe("calculateScore", () => {
  it("returns perfect score for exact order", () => {
    const result = calculateScore(correctOrder, correctOrder, uniqueItems);
    expect(result.totalScore).toBe(100);
    expect(result.itemScores.every((s) => s.points === 10)).toBe(true);
  });

  it("returns 0 for completely wrong order", () => {
    const reversed = [...correctOrder].reverse();
    const result = calculateScore(reversed, correctOrder, uniqueItems);
    expect(result.totalScore).toBeLessThan(20);
  });

  it("returns 0 for empty submission", () => {
    const empty = Array(10).fill(null);
    const result = calculateScore(empty, correctOrder, uniqueItems);
    expect(result.totalScore).toBe(0);
  });

  it("scores off-by-one as 5 points", () => {
    const playerOrder = [...correctOrder];
    [playerOrder[0], playerOrder[1]] = [playerOrder[1], playerOrder[0]];
    const result = calculateScore(playerOrder, correctOrder, uniqueItems);
    expect(result.itemScores[0].points).toBe(5);
    expect(result.itemScores[1].points).toBe(5);
  });

  it("scores difference 5 as 1 point", () => {
    const playerOrder = [...correctOrder];
    const temp = playerOrder[0];
    playerOrder[0] = playerOrder[5];
    playerOrder[5] = temp;
    const result = calculateScore(playerOrder, correctOrder, uniqueItems);
    expect(result.itemScores[0].points).toBe(1);
  });

  it("scores difference 6 as 0 points", () => {
    const playerOrder = [...correctOrder];
    const temp = playerOrder[0];
    playerOrder[0] = playerOrder[6];
    playerOrder[6] = temp;
    const result = calculateScore(playerOrder, correctOrder, uniqueItems);
    expect(result.itemScores[0].points).toBe(0);
  });

  it("gives full points when tied items are swapped", () => {
    const playerOrder = [...tieCorrectOrder];
    [playerOrder[2], playerOrder[3]] = [playerOrder[3], playerOrder[2]];

    const result = calculateScore(playerOrder, tieCorrectOrder, tieItems);
    const argentinaScore = result.itemScores.find((s) => s.itemId === "argentina");
    const italyScore = result.itemScores.find((s) => s.itemId === "italy");

    expect(argentinaScore?.difference).toBe(0);
    expect(argentinaScore?.points).toBe(10);
    expect(italyScore?.difference).toBe(0);
    expect(italyScore?.points).toBe(10);
  });

  it("gives full points for any permutation within a three-way tie", () => {
    const playerOrder = [...tieCorrectOrder];
    [playerOrder[5], playerOrder[6], playerOrder[7]] = [
      playerOrder[7],
      playerOrder[5],
      playerOrder[6],
    ];

    const result = calculateScore(playerOrder, tieCorrectOrder, tieItems);
    for (const itemId of ["france", "spain", "england"]) {
      const score = result.itemScores.find((s) => s.itemId === itemId);
      expect(score?.difference).toBe(0);
      expect(score?.points).toBe(10);
    }
  });

  it("still penalizes non-tied swaps", () => {
    const playerOrder = [...tieCorrectOrder];
    [playerOrder[0], playerOrder[1]] = [playerOrder[1], playerOrder[0]];

    const result = calculateScore(playerOrder, tieCorrectOrder, tieItems);
    expect(result.itemScores.find((s) => s.itemId === "brazil")?.points).toBe(5);
    expect(result.itemScores.find((s) => s.itemId === "germany")?.points).toBe(5);
  });

  it("scores tied item outside tie range as off-by-one", () => {
    const playerOrder = [...tieCorrectOrder];
    [playerOrder[3], playerOrder[4]] = [playerOrder[4], playerOrder[3]];

    const result = calculateScore(playerOrder, tieCorrectOrder, tieItems);
    expect(result.itemScores.find((s) => s.itemId === "italy")?.difference).toBe(1);
    expect(result.itemScores.find((s) => s.itemId === "italy")?.points).toBe(5);
  });
});

describe("isSlotCorrect", () => {
  it("returns true for swapped tied pair at slots 3 and 4", () => {
    const playerOrder = [...tieCorrectOrder];
    [playerOrder[2], playerOrder[3]] = [playerOrder[3], playerOrder[2]];

    expect(isSlotCorrect(2, playerOrder, tieCorrectOrder, tieItems)).toBe(true);
    expect(isSlotCorrect(3, playerOrder, tieCorrectOrder, tieItems)).toBe(true);
  });

  it("returns false when wrong stat value is placed in a tied slot", () => {
    const playerOrder = [...tieCorrectOrder];
    playerOrder[2] = "mexico";

    expect(isSlotCorrect(2, playerOrder, tieCorrectOrder, tieItems)).toBe(false);
  });
});
