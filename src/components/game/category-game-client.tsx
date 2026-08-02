"use client";

import { useState } from "react";
import type { CategoryDefinition } from "@/types/category";
import type { Difficulty } from "@/types/game";
import { GameBoard } from "./game-board";
import { GameSetupModal } from "./game-setup-modal";

interface CategoryGameClientProps {
  category: CategoryDefinition;
  categoryTitle: string;
  categoryDescription: string;
}

export function CategoryGameClient({
  category,
  categoryTitle,
  categoryDescription,
}: CategoryGameClientProps) {
  const [started, setStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");

  const handleStart = (selected: Difficulty) => {
    setDifficulty(selected);
    setStarted(true);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {!started ? (
        <GameSetupModal
          open
          categoryTitle={categoryTitle}
          categoryDescription={categoryDescription}
          onStart={handleStart}
        />
      ) : (
        <GameBoard
          category={category}
          mode="category"
          difficulty={difficulty}
          categoryTitle={categoryTitle}
          categoryDescription={categoryDescription}
        />
      )}
    </div>
  );
}
