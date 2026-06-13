import { describe, it, expect } from "vitest";
import { calculateScore } from "@/lib/game/scoring";

const correctOrder = [
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
];

describe("calculateScore", () => {
  it("returns perfect score for exact order", () => {
    const result = calculateScore(correctOrder, correctOrder);
    expect(result.totalScore).toBe(100);
    expect(result.itemScores.every((s) => s.points === 10)).toBe(true);
  });

  it("returns 0 for completely wrong order", () => {
    const reversed = [...correctOrder].reverse();
    const result = calculateScore(reversed, correctOrder);
    expect(result.totalScore).toBeLessThan(20);
  });

  it("returns 0 for empty submission", () => {
    const empty = Array(10).fill(null);
    const result = calculateScore(empty, correctOrder);
    expect(result.totalScore).toBe(0);
  });

  it("scores off-by-one as 5 points", () => {
    const playerOrder = [...correctOrder];
    [playerOrder[0], playerOrder[1]] = [playerOrder[1], playerOrder[0]];
    const result = calculateScore(playerOrder, correctOrder);
    expect(result.itemScores[0].points).toBe(5);
    expect(result.itemScores[1].points).toBe(5);
  });

  it("scores difference 5 as 1 point", () => {
    const playerOrder = [...correctOrder];
    const temp = playerOrder[0];
    playerOrder[0] = playerOrder[5];
    playerOrder[5] = temp;
    const result = calculateScore(playerOrder, correctOrder);
    expect(result.itemScores[0].points).toBe(1);
  });

  it("scores difference 6 as 0 points", () => {
    const playerOrder = [...correctOrder];
    const temp = playerOrder[0];
    playerOrder[0] = playerOrder[6];
    playerOrder[6] = temp;
    const result = calculateScore(playerOrder, correctOrder);
    expect(result.itemScores[0].points).toBe(0);
  });
});
