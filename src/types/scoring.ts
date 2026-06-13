export interface ItemScore {
  itemId: string;
  correctPosition: number;
  playerPosition: number | null;
  difference: number;
  points: number;
}

export interface ScoreResult {
  totalScore: number;
  itemScores: ItemScore[];
  maxScore: number;
}
