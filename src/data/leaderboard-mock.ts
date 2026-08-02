export interface LeaderboardPlayer {
  rank: number;
  name: string;
  country: string;
  countryCode: string;
  score: number;
  streak: number;
  badge: "legend" | "elite" | "pro" | "challenger" | "rookie";
  avatar: string;
}

export const LEADERBOARD: LeaderboardPlayer[] = [
  { rank: 1, name: "GoldenBoot_99", country: "Brazil", countryCode: "BR", score: 9840, streak: 47, badge: "legend", avatar: "GB" },
  { rank: 2, name: "TifosoItaliano", country: "Italy", countryCode: "IT", score: 9520, streak: 34, badge: "legend", avatar: "TI" },
  { rank: 3, name: "FutebolRei", country: "Portugal", countryCode: "PT", score: 9180, streak: 28, badge: "elite", avatar: "FR" },
  { rank: 4, name: "ThreeLions_FC", country: "England", countryCode: "GB", score: 8950, streak: 22, badge: "elite", avatar: "TL" },
  { rank: 5, name: "DieManschaft", country: "Germany", countryCode: "DE", score: 8720, streak: 19, badge: "elite", avatar: "DM" },
  { rank: 6, name: "AlbiCeleste_7", country: "Argentina", countryCode: "AR", score: 8490, streak: 15, badge: "pro", avatar: "AC" },
  { rank: 7, name: "LesBleus2024", country: "France", countryCode: "FR", score: 8200, streak: 12, badge: "pro", avatar: "LB" },
  { rank: 8, name: "OrangeFever", country: "Netherlands", countryCode: "NL", score: 7980, streak: 10, badge: "pro", avatar: "OF" },
  { rank: 9, name: "LaRoja_Fan", country: "Spain", countryCode: "ES", score: 7640, streak: 8, badge: "challenger", avatar: "LR" },
  { rank: 10, name: "CelicsBrasil", country: "Brazil", countryCode: "BR", score: 7310, streak: 6, badge: "challenger", avatar: "CB" },
];

export const BADGE_COLORS: Record<string, string> = {
  legend: "from-yellow-400 to-amber-600",
  elite: "from-slate-300 to-slate-500",
  pro: "from-amber-700 to-amber-900",
  challenger: "from-blue-500 to-blue-700",
  rookie: "from-green-500 to-green-700",
};

export const BADGE_LABELS: Record<string, string> = {
  legend: "LEGEND",
  elite: "ELITE",
  pro: "PRO",
  challenger: "CHALLENGER",
  rookie: "ROOKIE",
};
