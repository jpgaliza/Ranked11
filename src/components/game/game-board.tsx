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
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, Trophy, Star, RotateCcw, ArrowUpDown, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import type { CategoryDefinition } from "@/types/category";
import type { Difficulty, GameMode } from "@/types/game";
import type { RankedItem } from "@/types/category";
import { useGameState } from "@/hooks/use-game-state";
import { useGameTimer } from "@/hooks/use-game-timer";
import { useIsDark } from "@/hooks/use-is-dark";
import { calculateScore, slotsToPlayerOrder } from "@/lib/game/scoring";
import {
  buildAttemptRecord,
  incrementDailyAttemptCount,
  saveDailyFirstAttempt,
} from "@/lib/storage/daily-attempt-store";
import { saveResultPayload } from "@/lib/storage/result-payload-store";
import { getCategoryIcon } from "@/lib/view-models/category-display";
import { categoryManifest } from "@/lib/categories/loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryReveal } from "./category-reveal";
import { RankingSlot } from "./ranking-slots";
import { ItemPool } from "./item-pool";
import { DraggableItem } from "./draggable-item";

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
  const tItems = useTranslations("categories.items");
  const router = useRouter();
  const isDark = useIsDark();
  const { state, dispatch, startGame, initialized } = useGameState(
    category,
    mode,
    difficulty,
  );
  const [activeItem, setActiveItem] = useState<RankedItem | null>(null);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [revealOpen, setRevealOpen] = useState(showReveal);

  const categoryIcon = useMemo(() => {
    const entry = categoryManifest.categories.find((e) => e.id === category.id);
    return entry ? getCategoryIcon(entry) : "🏆";
  }, [category.id]);

  const getItemName = useCallback(
    (id: string) => (tItems.has(id) ? tItems(id) : id.replace(/-/g, " ")),
    [tItems],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor),
  );

  const handleSubmit = useCallback(() => {
    const playerOrder = slotsToPlayerOrder(state.slots);
    const scoreResult = calculateScore(playerOrder, state.correctOrder);
    dispatch({ type: "SUBMIT", payload: { score: scoreResult } });

    if (mode === "daily") {
      const attemptCount = incrementDailyAttemptCount();
      const isFirst = attemptCount === 1;
      if (isFirst) {
        saveDailyFirstAttempt(
          buildAttemptRecord(category.id, scoreResult.totalScore, scoreResult.itemScores, true),
        );
      }
    }

    saveResultPayload({
      categoryId: category.id,
      mode,
      scoreResult,
      playerOrder,
      submittedAt: new Date().toISOString(),
    });

    const params = new URLSearchParams({
      score: String(scoreResult.totalScore),
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
    if (!state.selectedItemId) return;
    dispatch({
      type: "ASSIGN_TO_SLOT",
      payload: { slotIndex: index, itemId: state.selectedItemId },
    });
  };

  const handleItemSelect = (itemId: string) => {
    dispatch({
      type: "SELECT_ITEM",
      payload: { itemId: state.selectedItemId === itemId ? null : itemId },
    });
  };

  const handleStart = () => {
    setRevealOpen(false);
    startGame(true);
  };

  const handleReset = () => {
    dispatch({ type: "RESET" });
    dispatch({ type: "SELECT_ITEM", payload: { itemId: null } });
  };

  const placedCount = state.slots.filter((s) => s !== null).length;
  const emptySlots = 10 - placedCount;

  const requestSubmit = () => {
    if (emptySlots > 0 && state.difficulty === "normal") {
      setConfirmSubmitOpen(true);
    } else {
      handleSubmit();
    }
  };

  const selectedItemName = state.selectedItemId
    ? getItemName(state.selectedItemId)
    : undefined;

  const backHref = mode === "daily" ? "/daily" : "/categories";
  const timerSeconds = Math.ceil((state.timerRemainingMs ?? 0) / 1000);
  const timerDisplay = `${Math.floor(timerSeconds / 60)}:${String(timerSeconds % 60).padStart(2, "0")}`;

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

      <div className="min-h-[calc(100dvh-4rem)] pb-8">
        <div
          className="sticky top-16 z-40 border-b border-border"
          style={{
            background: isDark ? "rgba(2,6,23,0.95)" : "rgba(248,250,252,0.97)",
          }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
            <Link
              href={backHref}
              className="flex items-center gap-1.5 text-sm transition-colors hover:text-primary font-display font-semibold"
              style={{ color: isDark ? "#94A3B8" : "#64748B" }}
            >
              <ChevronLeft size={16} /> {t("back")}
            </Link>

            <div className="flex-1 min-w-0 text-center">
              <h2
                className="truncate font-display font-extrabold text-base"
                style={{ color: isDark ? "#F8FAFC" : "#0F172A" }}
              >
                {categoryIcon} {categoryTitle}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {state.difficulty === "hard" && state.phase === "playing" && (
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                  style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}
                >
                  <Clock size={12} />
                  <span className="font-display font-bold text-sm">{timerDisplay}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border">
                <Star size={12} style={{ color: "#D4AF37" }} />
                <span
                  className="font-display font-bold text-sm"
                  style={{ color: isDark ? "#F8FAFC" : "#0F172A" }}
                >
                  {placedCount}/10
                </span>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border text-xs transition-all hover:border-primary hover:text-primary font-display font-semibold"
                style={{ color: isDark ? "#94A3B8" : "#64748B" }}
              >
                <RotateCcw size={12} /> {t("reset")}
              </button>
            </div>
          </div>

          <div
            className="h-1 w-full"
            style={{
              background: isDark ? "rgba(30,41,59,0.8)" : "rgba(226,232,240,0.8)",
            }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #B8960C, #D4AF37, #F0D060)",
              }}
              animate={{ width: `${placedCount * 10}%` }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-4">
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm"
            style={{
              borderColor: "rgba(212,175,55,0.2)",
              background: "rgba(212,175,55,0.06)",
              color: isDark ? "#94A3B8" : "#64748B",
            }}
          >
            <ArrowUpDown size={13} style={{ color: "#D4AF37", flexShrink: 0 }} />
            {t("selectHint")}
          </div>
        </div>

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 grid lg:grid-cols-2 gap-6">
            <div>
              <h3
                className="mb-3 flex items-center gap-2 font-display font-bold text-[0.85rem] tracking-widest"
                style={{ color: isDark ? "#94A3B8" : "#64748B" }}
              >
                <Trophy size={14} style={{ color: "#D4AF37" }} />
                {t("rank").toUpperCase()}
              </h3>
              <div className="space-y-2" role="list" aria-label={t("rankingSlots")}>
                {state.slots.map((item, index) => (
                  <RankingSlot
                    key={index}
                    index={index}
                    item={item}
                    categoryType={category.type}
                    selectedItemId={state.selectedItemId}
                    onSlotClick={handleSlotClick}
                    onItemSelect={handleItemSelect}
                    hasSelection={state.selectedItemId !== null}
                    selectedItemName={selectedItemName}
                  />
                ))}
              </div>
            </div>

            {state.phase === "playing" && (
              <ItemPool
                items={state.pool}
                categoryType={category.type}
                selectedItemId={state.selectedItemId}
                onItemSelect={handleItemSelect}
                onSubmit={requestSubmit}
                placedCount={placedCount}
              />
            )}
          </div>

          <DragOverlay>
            {activeItem ? (
              <DraggableItem
                item={activeItem}
                source="pool"
                categoryType={category.type}
                variant="pool"
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <Dialog open={confirmSubmitOpen} onOpenChange={setConfirmSubmitOpen}>
        <DialogContent className="glass-card">
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
            <Button
              onClick={() => {
                setConfirmSubmitOpen(false);
                handleSubmit();
              }}
            >
              {tCommon("submit")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
