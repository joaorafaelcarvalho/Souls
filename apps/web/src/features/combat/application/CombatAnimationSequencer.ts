import type {
  CardInstanceId,
  CombatColumnTrace,
  CombatExchange,
  CombatResolutionTrace,
  ColumnCombatResult,
  GameEvent,
  PlayerId
} from '@souls/game-core';
import { combatVfxTiming } from '../combatVfxTiming';

export const COMBAT_ANIMATION_STAGES = [
  'highlight',
  'attack',
  'impact',
  'consequences',
  'transition'
] as const;

export type CombatAnimationStage = (typeof COMBAT_ANIMATION_STAGES)[number];
export type CombatAnimationSpeed = 1 | 2;
export type CombatAnimationCompletion = 'finished' | 'skipped';

export interface CombatAnimationDurations {
  readonly highlight: number;
  readonly attack: number;
  readonly impact: number;
  readonly consequences: number;
  readonly transition: number;
}

export const DEFAULT_COMBAT_ANIMATION_DURATIONS: CombatAnimationDurations = {
  highlight: combatVfxTiming.charge,
  attack: combatVfxTiming.lightningTravel,
  impact: combatVfxTiming.impact,
  consequences: combatVfxTiming.destructionFeedback,
  transition: combatVfxTiming.columnTransition
};

export interface CombatPlaybackState {
  readonly column: number;
  readonly columnIndex: number;
  readonly totalColumns: number;
  readonly stage: CombatAnimationStage;
  readonly stageIndex: number;
  readonly exchangeIndex: number;
  readonly exchangeCount: number;
  readonly attackerIds: readonly CardInstanceId[];
  readonly targetIds: readonly CardInstanceId[];
  readonly pathTargetIds: readonly CardInstanceId[];
  readonly destroyedCardIds: readonly CardInstanceId[];
  readonly activeDestroyedCardIds: readonly CardInstanceId[];
  readonly outcome: ColumnCombatResult['outcome'];
  readonly exchangeOutcome: CombatExchange['outcome'];
  readonly events: readonly GameEvent[];
  readonly soulAwards: CombatExchange['soulAwards'];
  readonly hpDamage: number;
  readonly cumulativeHpDamage: Readonly<Record<PlayerId, number>>;
  readonly hpDamageTarget?: PlayerId;
  readonly isCombined: boolean;
  readonly speed: CombatAnimationSpeed;
}

export interface CombatAnimationCallbacks {
  readonly onStep: (playback: CombatPlaybackState) => void;
  readonly onComplete: (reason: CombatAnimationCompletion) => void;
  readonly onCancel?: () => void;
}

export interface CombatAnimationOptions {
  readonly speed?: CombatAnimationSpeed;
  readonly reducedMotion?: boolean;
  readonly durations?: Partial<CombatAnimationDurations>;
}

type AnimationTimer = ReturnType<typeof setTimeout>;

interface ActiveRun {
  readonly id: number;
  readonly trace: CombatResolutionTrace;
  readonly callbacks: CombatAnimationCallbacks;
  readonly reducedMotion: boolean;
  readonly durations: CombatAnimationDurations;
  speed: CombatAnimationSpeed;
  columnIndex: number;
  stageIndex: number;
  exchangeIndex: number;
  timer: AnimationTimer | undefined;
}

function durationFor(run: ActiveRun, stage: CombatAnimationStage): number {
  return Math.max(0, run.durations[stage]) / run.speed;
}

function currentExchange(run: ActiveRun, column: CombatColumnTrace): CombatExchange {
  return column.result.exchanges[run.exchangeIndex]
    ?? column.result.exchanges[column.result.exchanges.length - 1]
    ?? {
      kind: 'direct',
      outcome: 'direct-damage',
      attackPower: column.result.initialAttackPower,
      remainingAttack: column.result.remainingAttack,
      destroyedCardIds: [],
      hpDamage: 0,
      soulAwards: []
    };
}

function playbackFor(run: ActiveRun, column: CombatColumnTrace, stage: CombatAnimationStage): CombatPlaybackState {
  const exchange = currentExchange(run, column);
  const exchangeStage = stage === 'impact' || stage === 'consequences';
  const targetIds = exchangeStage && exchange.targetId === undefined
    ? []
    : exchangeStage && exchange.targetId !== undefined
      ? [exchange.targetId]
      : [];
  const currentExchangeDestroyedCardIds = stage === 'impact' || stage === 'consequences' || stage === 'transition'
    ? exchange.destroyedCardIds
    : [];
  const previousColumnsDestroyedCardIds = run.trace.columns
    .slice(0, run.columnIndex)
    .flatMap((entry) => entry.result.destroyedCardIds);
  const priorExchangesDestroyedCardIds = stage === 'impact' || stage === 'consequences' || stage === 'transition'
    ? column.result.exchanges
      .slice(0, run.exchangeIndex)
      .flatMap((entry) => entry.destroyedCardIds)
    : [];
  const destroyedCardIds = [...new Set([
    ...previousColumnsDestroyedCardIds,
    ...priorExchangesDestroyedCardIds,
    ...currentExchangeDestroyedCardIds
  ])];
  const activeDestroyedCardIds = stage === 'consequences'
    ? currentExchangeDestroyedCardIds
    : [];
  const hpDamage = stage === 'consequences' ? exchange.hpDamage : 0;
  const cumulativeHpDamage = { 1: 0, 2: 0 } as Record<PlayerId, number>;
  const addDamage = (entry: CombatExchange) => {
    if (entry.hpDamageTarget !== undefined) {
      cumulativeHpDamage[entry.hpDamageTarget] += entry.hpDamage;
    }
  };
  run.trace.columns.slice(0, run.columnIndex).forEach((entry) => entry.result.exchanges.forEach(addDamage));
  column.result.exchanges.slice(0, run.exchangeIndex).forEach(addDamage);
  if (run.stageIndex >= COMBAT_ANIMATION_STAGES.indexOf('consequences')) {
    addDamage(exchange);
  }

  return {
    column: column.column,
    columnIndex: run.columnIndex,
    totalColumns: run.trace.columns.length,
    stage,
    stageIndex: run.stageIndex,
    exchangeIndex: run.exchangeIndex,
    exchangeCount: Math.max(1, column.result.exchanges.length),
    attackerIds: column.attackerIds,
    targetIds,
    pathTargetIds: column.targetIds,
    destroyedCardIds,
    activeDestroyedCardIds,
    outcome: column.result.outcome,
    exchangeOutcome: exchange.outcome,
    events: column.events,
    soulAwards: exchange.soulAwards,
    hpDamage,
    cumulativeHpDamage,
    ...(stage === 'consequences' && exchange.hpDamageTarget === undefined
      ? {}
      : stage === 'consequences' && exchange.hpDamageTarget !== undefined
        ? { hpDamageTarget: exchange.hpDamageTarget }
        : {}),
    isCombined: column.attackerIds.length > 1,
    speed: run.speed
  };
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export class CombatAnimationSequencer {
  private activeRun: ActiveRun | undefined;
  private nextRunId = 0;

  public play(trace: CombatResolutionTrace, callbacks: CombatAnimationCallbacks, options: CombatAnimationOptions = {}): void {
    this.cancel();

    const durations = {
      ...DEFAULT_COMBAT_ANIMATION_DURATIONS,
      ...options.durations
    };
    const run: ActiveRun = {
      id: this.nextRunId,
      trace,
      callbacks,
      reducedMotion: options.reducedMotion === true,
      durations,
      speed: options.speed ?? 1,
      columnIndex: 0,
      stageIndex: 0,
      exchangeIndex: 0,
      timer: undefined
    };

    this.nextRunId += 1;
    this.activeRun = run;

    if (trace.columns.length === 0) {
      this.complete(run, 'finished');
      return;
    }

    if (run.reducedMotion) {
      for (run.columnIndex = 0; run.columnIndex < trace.columns.length; run.columnIndex += 1) {
        run.stageIndex = COMBAT_ANIMATION_STAGES.indexOf('consequences');
        const column = trace.columns[run.columnIndex];
        if (column !== undefined) {
          run.exchangeIndex = Math.max(0, column.result.exchanges.length - 1);
          callbacks.onStep(playbackFor(run, column, 'consequences'));
        }
      }
      this.complete(run, 'finished');
      return;
    }

    this.emitStage(run);
  }

  public setSpeed(speed: CombatAnimationSpeed): void {
    const run = this.activeRun;
    if (run === undefined || run.speed === speed) {
      return;
    }

    run.speed = speed;

    if (run.timer !== undefined) {
      clearTimeout(run.timer);
      run.timer = undefined;
      this.scheduleStage(run);
    }
  }

  public skip(): void {
    const run = this.activeRun;
    if (run === undefined) {
      return;
    }

    if (run.timer !== undefined) {
      clearTimeout(run.timer);
      run.timer = undefined;
    }

    for (let index = run.columnIndex; index < run.trace.columns.length; index += 1) {
      const column = run.trace.columns[index];
      if (column === undefined) {
        continue;
      }
      run.columnIndex = index;
      run.stageIndex = COMBAT_ANIMATION_STAGES.indexOf('consequences');
      run.exchangeIndex = Math.max(0, column.result.exchanges.length - 1);
      run.callbacks.onStep(playbackFor(run, column, 'consequences'));
    }

    this.complete(run, 'skipped');
  }

  public cancel(notify = true): void {
    const run = this.activeRun;
    if (run === undefined) {
      return;
    }

    if (run.timer !== undefined) {
      clearTimeout(run.timer);
      run.timer = undefined;
    }
    this.activeRun = undefined;

    if (notify) {
      run.callbacks.onCancel?.();
    }
  }

  private emitStage(run: ActiveRun): void {
    if (this.activeRun?.id !== run.id) {
      return;
    }

    const column = run.trace.columns[run.columnIndex];
    const stage = COMBAT_ANIMATION_STAGES[run.stageIndex];

    if (column === undefined || stage === undefined) {
      this.complete(run, 'finished');
      return;
    }

    run.callbacks.onStep(playbackFor(run, column, stage));
    this.scheduleStage(run);
  }

  private scheduleStage(run: ActiveRun): void {
    if (this.activeRun?.id !== run.id) {
      return;
    }

    const stage = COMBAT_ANIMATION_STAGES[run.stageIndex];
    if (stage === undefined) {
      this.advance(run);
      return;
    }

    const duration = durationFor(run, stage);
    if (duration === 0) {
      this.advance(run);
      return;
    }

    run.timer = setTimeout(() => {
      run.timer = undefined;
      this.advance(run);
    }, duration);
  }

  private advance(run: ActiveRun): void {
    if (this.activeRun?.id !== run.id) {
      return;
    }

    if (run.stageIndex === COMBAT_ANIMATION_STAGES.indexOf('consequences')
      && run.exchangeIndex < (run.trace.columns[run.columnIndex]?.result.exchanges.length ?? 1) - 1) {
      run.exchangeIndex += 1;
      run.stageIndex = COMBAT_ANIMATION_STAGES.indexOf('impact');
      this.emitStage(run);
      return;
    }

    if (run.stageIndex < COMBAT_ANIMATION_STAGES.length - 1) {
      run.stageIndex += 1;
      this.emitStage(run);
      return;
    }

    if (run.columnIndex < run.trace.columns.length - 1) {
      run.columnIndex += 1;
      run.exchangeIndex = 0;
      run.stageIndex = 0;
      this.emitStage(run);
      return;
    }

    this.complete(run, 'finished');
  }

  private complete(run: ActiveRun, reason: CombatAnimationCompletion): void {
    if (this.activeRun?.id !== run.id) {
      return;
    }

    if (run.timer !== undefined) {
      clearTimeout(run.timer);
      run.timer = undefined;
    }
    this.activeRun = undefined;
    run.callbacks.onComplete(reason);
  }
}
