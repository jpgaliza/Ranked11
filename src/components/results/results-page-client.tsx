"use client";

import { useEffect, useState } from "react";
import type { CategoryDefinition } from "@/types/category";
import type { GameMode } from "@/types/game";
import { getResultPayload, type ResultPayload } from "@/lib/storage/result-payload-store";
import { CategoryResultsScreen } from "./category-results-screen";
import { DailyChallengeResults } from "./daily-challenge-results";

interface ResultsPageClientProps {
  category: CategoryDefinition | null;
  categoryTitle: string | null;
  mode: GameMode;
  urlScore: number;
}

export function ResultsPageClient({
  category,
  categoryTitle,
  mode,
  urlScore,
}: ResultsPageClientProps) {
  const [payload, setPayload] = useState<ResultPayload | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPayload(getResultPayload());
    setReady(true);
  }, []);

  if (!ready) return null;

  if (mode === "daily") {
    const totalScore = payload?.scoreResult?.totalScore ?? urlScore;
    return (
      <DailyChallengeResults
        totalScore={totalScore}
        payload={payload}
        category={category}
        categoryTitle={categoryTitle}
      />
    );
  }

  if (category && categoryTitle && payload) {
    return (
      <CategoryResultsScreen
        category={category}
        categoryTitle={categoryTitle}
        payload={payload}
        urlScore={urlScore}
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <p className="text-muted-foreground">
        {categoryTitle ? `${categoryTitle} — ${urlScore} pts` : `${urlScore} pts`}
      </p>
    </div>
  );
}
