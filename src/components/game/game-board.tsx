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
import { useCallback, useEffect, useRef, useState } from "react";
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
import { cn } from "@/lib/utils/cn";
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
import { DraggableItem, DragItemOverlay } from "./draggable-item";

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
  const [timeUpOpen, setTimeUpOpen] = useState(false);
  const [revealOpen, setRevealOpen] = useState(showReveal);
  const timeUpHandledRef = useRef(false);

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
    const scoreResult = calculateScore(
      playerOrder,
      state.correctOrder,
      category.items,
    );
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
  }, [state.slots, state.correctOrder, dispatch, mode, category.id, category.items, router]);

  const handleTimeUp = useCallback(() => {
    if (timeUpHandledRef.current) return;
    timeUpHandledRef.current = true;
    setTimeUpOpen(true);
    dispatch({ type: "TICK_TIMER", payload: { remainingMs: 0 } });
  }, [dispatch]);

  useGameTimer(
    state.timerRemainingMs,
    state.phase === "playing" && state.difficulty === "hard" && !timeUpOpen,
    (remainingMs) => dispatch({ type: "TICK_TIMER", payload: { remainingMs } }),
    handleTimeUp,
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !timeUpOpen) {
        dispatch({ type: "SELECT_ITEM", payload: { itemId: null } });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dispatch, timeUpOpen]);

  const handleDragStart = (event: DragStartEvent) => {
    if (isFrozen) return;
    const data = event.active.data.current as {
      item: RankedItem;
      source: "pool" | "slot";
    };
    setActiveItem(data?.item ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (isFrozen) return;
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
    if (isFrozen || !state.selectedItemId) return;
    dispatch({
      type: "ASSIGN_TO_SLOT",
      payload: { slotIndex: index, itemId: state.selectedItemId },
    });
  };

  const handleItemSelect = (itemId: string) => {
    if (isFrozen) return;

    if (state.selectedItemId && state.selectedItemId !== itemId) {
      const targetSlotIndex = state.slots.findIndex((slot) => slot?.id === itemId);
      if (targetSlotIndex >= 0) {
        dispatch({
          type: "ASSIGN_TO_SLOT",
          payload: { slotIndex: targetSlotIndex, itemId: state.selectedItemId },
        });
        return;
      }
    }

    dispatch({
      type: "SELECT_ITEM",
      payload: { itemId: state.selectedItemId === itemId ? null : itemId },
    });
  };

  const handleStart = () => {
    setRevealOpen(false);
    timeUpHandledRef.current = false;
    setTimeUpOpen(false);
    startGame(true);
  };

  const handleReset = () => {
    if (timeUpOpen) return;
    timeUpHandledRef.current = false;
    dispatch({ type: "RESET" });
    dispatch({ type: "SELECT_ITEM", payload: { itemId: null } });
  };

  const placedCount = state.slots.filter((s) => s !== null).length;
  const emptySlots = 10 - placedCount;
  const isFrozen = timeUpOpen;

  const requestSubmit = () => {
    if (isFrozen) return;
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

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          className="z-40 shrink-0 border-b border-border"
          style={{
            background: isDark ? "rgba(2,6,23,0.95)" : "rgba(248,250,252,0.97)",
          }}
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 px-4 py-2 sm:px-6 sm:py-2.5">
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
                {categoryTitle}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {state.difficulty === "hard" &&
                (state.phase === "playing" || timeUpOpen) && (
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

        <div className="mx-auto w-full max-w-6xl shrink-0 px-4 pt-2 sm:px-6">
          <div
            className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs leading-snug"
            style={{
              borderColor: "rgba(212,175,55,0.2)",
              background: "rgba(212,175,55,0.06)",
              color: isDark ? "#94A3B8" : "#64748B",
            }}
          >
            <ArrowUpDown size={12} style={{ color: "#D4AF37", flexShrink: 0 }} />
            {t("selectHint")}
          </div>
        </div>

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="mx-auto grid h-full min-h-0 w-full max-w-6xl flex-1 grid-cols-1 gap-4 px-4 pb-3 pt-2 md:grid-cols-2 md:gap-5 sm:px-6">
              <div className="flex w-full shrink-0 flex-col md:min-h-0 md:h-full">
                <h3
                  className="mb-1.5 flex shrink-0 items-center gap-1.5 font-display text-xs font-bold tracking-widest"
                  style={{ color: isDark ? "#94A3B8" : "#64748B" }}
                >
                  <Trophy size={12} style={{ color: "#D4AF37" }} />
                  {t("rank").toUpperCase()}
                </h3>
                <div
                  className="grid shrink-0 grid-cols-2 auto-rows-min gap-1.5 md:min-h-0 md:flex-1 md:grid-cols-1 md:grid-rows-10 md:gap-1.5"
                  role="list"
                  aria-label={t("rankingSlots")}
                >
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
                <div className="flex w-full flex-col self-start">
                  <ItemPool
                    items={state.pool}
                    categoryType={category.type}
                    selectedItemId={state.selectedItemId}
                    onItemSelect={handleItemSelect}
                    onSubmit={requestSubmit}
                    placedCount={placedCount}
                  />
                </div>
              )}
            </div>
          </div>

          <DragOverlay
            dropAnimation={null}
            style={{ width: "auto", height: "auto" }}
            className="rounded-lg"
          >
            {activeItem ? (
              <DragItemOverlay
                item={activeItem}
                categoryType={category.type}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <Dialog open={timeUpOpen} onOpenChange={() => {}}>
        <DialogContent
          className={cn(
            "gold-glow sm:max-w-md gap-0 border-0 p-0 rounded-xl",
            isDark ? "glass-daily-card" : "border border-border bg-white shadow-lg",
          )}
          showCloseButton={false}
          onEscapeKeyDown={(event) => event.preventDefault()}
          onPointerDownOutside={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <div className="relative z-[1] h-1 w-full gold-gradient-btn" />
          <div className="relative z-[1] p-6 pt-5">
            <DialogHeader className="space-y-3 text-center">
              <div className="flex items-center justify-center gap-2.5">
                <Clock size={22} style={{ color: "#EF4444" }} />
                <DialogTitle className="gold-text font-display text-2xl font-extrabold tracking-widest">
                  {t("timeUpTitle").toUpperCase()}
                </DialogTitle>
              </div>
              <DialogDescription
                className="text-sm font-medium leading-relaxed"
                style={{ color: isDark ? "#CBD5E1" : "#475569" }}
              >
                {t("timeUpHint")}
              </DialogDescription>
            </DialogHeader>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="gold-glow gold-gradient-btn mt-6 flex w-full cursor-pointer items-center justify-center rounded-lg py-3.5 font-display font-extrabold tracking-wider"
              style={{ color: "#0F172A" }}
            >
              {t("seeResults")}
            </motion.button>
          </div>
        </DialogContent>
      </Dialog>

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
