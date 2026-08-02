"use client";

import { forwardRef } from "react";
import { CountryFlag } from "@/components/ui/country-flag";
import { formatScore } from "@/lib/utils/format-score";

export interface ShareResultRow {
  position: number;
  playerName: string | null;
  playerCountryCode?: string;
  playerSubtitle?: string;
  playerStatValue?: number;
  correctName: string;
  correctCountryCode?: string;
  correctSubtitle?: string;
  correctStatValue?: number;
  isCorrect: boolean;
}

export interface ShareResultCardProps {
  mode: "category" | "daily";
  categoryTitle: string;
  gradeMessage: string;
  gradeColor: string;
  gradeEmoji: string;
  totalScore: number;
  maxScore: number;
  correctCount: number;
  wrongCount: number;
  rows: ShareResultRow[];
  dailyRank?: number;
  labels: {
    dailyChallenge: string;
    yourRanking: string;
    correctAnswer: string;
    position: string;
    correct: string;
    wrong: string;
    totalScore: string;
    yourRankToday: string;
  };
}

export const ShareResultCard = forwardRef<HTMLDivElement, ShareResultCardProps>(
  function ShareResultCard(
    {
      mode,
      categoryTitle,
      gradeMessage,
      gradeColor,
      gradeEmoji,
      totalScore,
      maxScore,
      correctCount,
      wrongCount,
      rows,
      dailyRank,
      labels,
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        style={{
          width: 1080,
          background: "#0F172A",
          color: "#F8FAFC",
          fontFamily: "system-ui, sans-serif",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 8,
            background: "linear-gradient(90deg, #B8960C, #D4AF37, #F0D060)",
          }}
        />

        <div style={{ padding: "48px 56px 40px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 32,
            }}
          >
            <div
              style={{
                fontSize: 36,
                fontWeight: 900,
                letterSpacing: 4,
                color: "#D4AF37",
              }}
            >
              RANKED11
            </div>
            <div
              style={{
                padding: "10px 20px",
                borderRadius: 999,
                border: "1px solid rgba(212,175,55,0.45)",
                background: "rgba(212,175,55,0.12)",
                color: "#D4AF37",
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: 2,
              }}
            >
              {mode === "daily" ? labels.dailyChallenge : categoryTitle.toUpperCase()}
            </div>
          </div>

          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>{gradeEmoji}</div>
            <div
              style={{
                fontSize: 42,
                fontWeight: 900,
                letterSpacing: 2,
                color: gradeColor,
                marginBottom: 16,
              }}
            >
              {gradeMessage}
            </div>
            <div style={{ fontSize: 72, fontWeight: 900, color: "#D4AF37", lineHeight: 1 }}>
              {formatScore(totalScore)}
              <span style={{ fontSize: 28, color: "#94A3B8", marginLeft: 8 }}>
                / {maxScore}
              </span>
            </div>
            {mode === "daily" && dailyRank !== undefined && (
              <div
                style={{
                  marginTop: 16,
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#94A3B8",
                }}
              >
                {labels.yourRankToday}: #{dailyRank.toLocaleString()}
              </div>
            )}
          </div>

          <div
            style={{
              borderRadius: 20,
              overflow: "hidden",
              border: "1px solid rgba(148,163,184,0.25)",
              marginBottom: 28,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr 1fr",
                gap: 16,
                padding: "16px 24px",
                background: "rgba(30,41,59,0.85)",
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: 2,
                color: "#94A3B8",
              }}
            >
              <div>{labels.position}</div>
              <div>{labels.yourRanking}</div>
              <div>{labels.correctAnswer}</div>
            </div>

            {rows.map((row) => (
              <div
                key={row.position}
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr 1fr",
                  gap: 16,
                  padding: "14px 24px",
                  alignItems: "center",
                  borderTop: "1px solid rgba(148,163,184,0.15)",
                  background: row.isCorrect
                    ? "rgba(34,197,94,0.08)"
                    : "rgba(239,68,68,0.05)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                      fontSize: 16,
                      background: row.isCorrect
                        ? "rgba(34,197,94,0.2)"
                        : "rgba(239,68,68,0.15)",
                      color: row.isCorrect ? "#22C55E" : "#EF4444",
                    }}
                  >
                    {row.position}
                  </div>
                  <span style={{ fontSize: 18 }}>{row.isCorrect ? "✓" : "✗"}</span>
                </div>

                <ShareRowCell
                  name={row.playerName}
                  countryCode={row.playerCountryCode}
                  subtitle={row.playerSubtitle}
                  statValue={row.playerStatValue}
                  color={row.isCorrect ? "#22C55E" : "#EF4444"}
                />

                <ShareRowCell
                  name={row.correctName}
                  countryCode={row.correctCountryCode}
                  subtitle={row.correctSubtitle}
                  statValue={row.correctStatValue}
                  color="#F8FAFC"
                />
              </div>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 16,
              marginBottom: 28,
            }}
          >
            {[
              { label: labels.correct, value: correctCount, color: "#22C55E" },
              { label: labels.wrong, value: wrongCount, color: "#EF4444" },
              {
                label: labels.totalScore,
                value: formatScore(totalScore),
                color: "#D4AF37",
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                style={{
                  borderRadius: 16,
                  padding: "20px 16px",
                  textAlign: "center",
                  background: "rgba(30,41,59,0.75)",
                  border: "1px solid rgba(148,163,184,0.2)",
                }}
              >
                <div style={{ fontSize: 34, fontWeight: 900, color }}>{value}</div>
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: 2,
                    color: "#64748B",
                  }}
                >
                  {label.toUpperCase()}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              textAlign: "center",
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: 3,
              color: "#D4AF37",
            }}
          >
            ranked11.app
          </div>
        </div>
      </div>
    );
  },
);

function ShareRowCell({
  name,
  countryCode,
  subtitle,
  statValue,
  color,
}: {
  name: string | null;
  countryCode?: string;
  subtitle?: string;
  statValue?: number;
  color: string;
}) {
  if (!name) {
    return (
      <div style={{ fontSize: 18, color: "#64748B", fontStyle: "italic" }}>—</div>
    );
  }

  return (
    <div style={{ minWidth: 0 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 20,
          fontWeight: 800,
          color,
        }}
      >
        <CountryFlag code={countryCode} className="h-4 w-6 shrink-0" />
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {name}
        </span>
      </div>
      {(subtitle || statValue !== undefined) && (
        <div style={{ marginTop: 4, fontSize: 14, color: "#64748B" }}>
          {subtitle}
          {statValue !== undefined ? ` · ${statValue}` : ""}
        </div>
      )}
    </div>
  );
}
