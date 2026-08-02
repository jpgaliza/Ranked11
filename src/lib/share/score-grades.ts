export const SCORE_GRADES = [
  { min: 95, key: "perfectMsg", color: "#D4AF37", emoji: "🏆" },
  { min: 75, key: "greatMsg", color: "#22C55E", emoji: "🌟" },
  { min: 50, key: "goodMsg", color: "#3B82F6", emoji: "⚡" },
  { min: 0, key: "keepMsg", color: "#94A3B8", emoji: "💪" },
] as const;

export function getScoreGrade(totalScore: number) {
  return SCORE_GRADES.find((grade) => totalScore >= grade.min)!;
}
