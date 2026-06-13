"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import type { CategoryDefinition } from "@/types/category";
import type { Difficulty, GameMode } from "@/types/game";
import type { RankedItem } from "@/types/category";
import { useGameState } from "@/hooks/use-game-state";
import { useGameTimer } from "@/hooks/use-game-timer";
import { calculateScore, slotsToPlayerOrder } from "@/lib/game/scoring";
import {
  buildAttemptRecord,
  incrementDailyAttemptCount,
  saveDailyFirstAttempt,
} from "@/lib/storage/daily-attempt-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryReveal } from "./category-reveal";
import { InteractionToggle } from "./interaction-toggle";
import { GameTimer } from "./game-timer";
import { RankingSlot } from "./ranking-slots";
import { ItemPool } from "./item-pool";
import { ItemCard } from "./item-card";
import { ScoreBreakdown } from "./score-breakdown";

interface GameBoardProps {
  category: CategoryDefinition;
  mode: GameMode;
  difficulty?: Difficulty;
  categoryTitle: string;
  categoryDescription: string;
  showReveal?: boolean;
}

export function GameBoard({
  category,
  mode,
  difficulty = "normal",
  categoryTitle,
  categoryDescription,
  showReveal = false,
}: GameBoardProps) {
  const t = useTranslations("game");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { state, dispatch, startGame, setInteractionMode, initialized } = useGameState(
    category,
    mode,
    difficulty,
  );
  const [activeItem, setActiveItem] = useState<RankedItem | null>(null);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [revealOpen, setRevealOpen] = useState(showReveal);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor),
  );

  const handleSubmit = useCallback(() => {
    const playerOrder = slotsToPlayerOrder(state.slots);
    const score = calculateScore(playerOrder, state.correctOrder);
    dispatch({ type: "SUBMIT", payload: { score } });

    if (mode === "daily") {
      const attemptCount = incrementDailyAttemptCount();
      const isFirst = attemptCount === 1;
      if (isFirst) {
        saveDailyFirstAttempt(
          buildAttemptRecord(category.id, score.totalScore, score.itemScores, true),
        );
      }
    }

    const params = new URLSearchParams({
      score: String(score.totalScore),
      mode,
      categoryId: category.id,
    });
    router.push(`/results?${params.toString()}`);
  }, [state.slots, state.correctOrder, dispatch, mode, category.id, router]);

  useGameTimer(
    state.timerRemainingMs,
    state.phase === "playing" && state.difficulty === "hard",
    (remainingMs) => dispatch({ type: "TICK_TIMER", payload: { remainingMs } }),
    handleSubmit,
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dispatch({ type: "SELECT_ITEM", payload: { itemId: null } });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dispatch]);

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current as { item: RankedItem };
    setActiveItem(data?.item ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveItem(null);
    const { active, over } = event;
    if (!over) return;

    const data = active.data.current as {
      item: RankedItem;
      source: "pool" | "slot";
    };
    const itemId = data.item.id;
    const overId = over.id as string;

    if (overId === "pool") {
      if (data.source === "slot") {
        const slotIndex = state.slots.findIndex((s) => s?.id === itemId);
        if (slotIndex >= 0) {
          dispatch({ type: "REMOVE_FROM_SLOT", payload: { slotIndex } });
        }
      }
      return;
    }

    if (overId.startsWith("slot-")) {
      const slotIndex = parseInt(overId.replace("slot-", ""), 10);
      dispatch({ type: "ASSIGN_TO_SLOT", payload: { slotIndex, itemId } });
    }
  };

  const handleSlotClick = (index: number) => {
    if (state.interactionMode !== "select" || !state.selectedItemId) return;
    dispatch({
      type: "ASSIGN_TO_SLOT",
      payload: { slotIndex: index, itemId: state.selectedItemId },
    });
  };

  const handleItemSelect = (itemId: string) => {
    if (state.interactionMode !== "select") return;
    dispatch({ type: "SELECT_ITEM", payload: { itemId } });
  };

  const handleStart = () => {
    setRevealOpen(false);
    const isFirst = mode !== "daily" || true;
    startGame(isFirst);
  };

  const emptySlots = state.slots.filter((s) => s === null).length;
  const requestSubmit = () => {
    if (emptySlots > 0 && state.difficulty === "normal") {
      setConfirmSubmitOpen(true);
    } else {
      handleSubmit();
    }
  };

  useEffect(() => {
    if (!initialized || showReveal) return;
    startGame(true);
  }, [initialized, showReveal, startGame]);

  if (!initialized) return null;

  return (
    <>
      {showReveal && (
        <CategoryReveal
          open={revealOpen}
          categoryTitle={categoryTitle}
          categoryDescription={categoryDescription}
          onStart={handleStart}
        />
      )}

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">{categoryTitle}</h1>
            <p className="text-sm text-muted-foreground">{categoryDescription}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {state.difficulty === "hard" && (
              <Badge variant="outline">{t("hardMode")}</Badge>
            )}
            {mode === "daily" && !state.isFirstDailyAttempt && (
              <Badge variant="secondary">{t("replayNotice")}</Badge>
            )}
            <InteractionToggle
              mode={state.interactionMode}
              onChange={setInteractionMode}
            />
          </div>
        </div>

        {state.difficulty === "hard" && state.phase === "playing" && (
          <GameTimer remainingMs={state.timerRemainingMs} />
        )}

        {state.interactionMode === "select" && state.phase === "playing" && (
          <p className="text-sm text-muted-foreground" role="status">
            {t("selectHint")}
          </p>
        )}

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid gap-8 lg:grid-cols-[2fr_3fr]">
            <ItemPool
              items={state.pool}
              interactionMode={state.interactionMode}
              selectedItemId={state.selectedItemId}
              onItemSelect={handleItemSelect}
            />
            <div className="space-y-2" role="list" aria-label={t("rankingSlots")}>
              {state.slots.map((item, index) => (
                <RankingSlot
                  key={index}
                  index={index}
                  item={item}
                  interactionMode={state.interactionMode}
                  selectedItemId={state.selectedItemId}
                  onSlotClick={handleSlotClick}
                  onItemSelect={handleItemSelect}
                  hasSelection={state.selectedItemId !== null}
                />
              ))}
            </div>
          </div>

          <DragOverlay>
            {activeItem ? <ItemCard item={activeItem} isDragging /> : null}
          </DragOverlay>
        </DndContext>

        {state.phase === "playing" && (
          <div className="flex justify-center pt-4">
            <Button size="lg" onClick={requestSubmit}>
              {tCommon("submit")}
            </Button>
          </div>
        )}

        {state.score && (
          <ScoreBreakdown score={state.score} />
        )}
      </div>

      <Dialog open={confirmSubmitOpen} onOpenChange={setConfirmSubmitOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("confirmSubmit")}</DialogTitle>
            <DialogDescription>
              {t("confirmSubmitHint", { count: emptySlots })}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setConfirmSubmitOpen(false)}>
              {tCommon("cancel")}
            </Button>
            <Button onClick={() => { setConfirmSubmitOpen(false); handleSubmit(); }}>
              {tCommon("submit")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
