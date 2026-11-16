import type { CombatColumnTrace, CombatResolutionTrace } from '@souls/game-core';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  CombatAnimationSequencer,
  type CombatAnimationStage
} from './CombatAnimationSequencer';

function trace(columns = [0, 1], exchangesPerColumn = 1, destroyedFirstExchange = false): CombatResolutionTrace {
  return {
    columns: columns.map((column): CombatColumnTrace => ({
      column,
      attackerIds: [`attacker-${column}`],
      targetIds: [`target-${column}`],
      result: {
        kind: 'column',
        outcome: 'direct-damage',
        initialAttackPower: 700,
        remainingAttack: 700,
        destroyedCardIds: destroyedFirstExchange ? ['destroyed-card'] : [],
        hpDamage: 700,
        hpDamageTarget: 2,
        soulAwards: [],
        exchanges: Array.from({ length: exchangesPerColumn }, (_, exchangeIndex) => ({
          kind: 'direct' as const,
          outcome: 'direct-damage' as const,
          attackPower: 700,
          remainingAttack: 700,
          destroyedCardIds: destroyedFirstExchange && exchangeIndex === 0 ? ['destroyed-card'] : [],
          hpDamage: 700,
          hpDamageTarget: 2,
          soulAwards: []
        }))
      },
      events: []
    })),
    trailingEvents: []
  };
}
describe('CombatAnimationSequencer', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('plays every stage in column order without overlap', () => {
    vi.useFakeTimers();
    const stages: string[] = [];
    const completions: string[] = [];
    const sequencer = new CombatAnimationSequencer();

    sequencer.play(trace(), {
      onStep: (playback) => stages.push(`${playback.column}:${playback.stage}`),
      onComplete: (reason) => completions.push(reason)
    }, { durations: { highlight: 1, attack: 1, impact: 1, consequences: 1, transition: 1 } });

    expect(stages).toEqual(['0:highlight']);
    vi.runAllTimers();

    const expectedStages: CombatAnimationStage[] = ['highlight', 'attack', 'impact', 'consequences', 'transition'];
    expect(stages).toEqual([
      ...expectedStages.map((stage) => `0:${stage}`),
      ...expectedStages.map((stage) => `1:${stage}`)
    ]);
    expect(completions).toEqual(['finished']);
  });

  it('skips remaining columns at the consequence stage and completes once', () => {
    vi.useFakeTimers();
    const stages: string[] = [];
    const completions: string[] = [];
    const sequencer = new CombatAnimationSequencer();

    sequencer.play(trace([0, 2, 3]), {
      onStep: (playback) => stages.push(`${playback.column}:${playback.stage}`),
      onComplete: (reason) => completions.push(reason)
    }, { durations: { highlight: 100, attack: 100, impact: 100, consequences: 100, transition: 100 } });

    expect(stages).toEqual(['0:highlight']);
    sequencer.skip();

    expect(stages).toEqual(['0:highlight', '0:consequences', '2:consequences', '3:consequences']);
    expect(completions).toEqual(['skipped']);
  });

  it('presents multiple exchanges in the same column in order', () => {
    const stages: string[] = [];
    let destroyedAtSecondImpact: readonly string[] = [];
    const sequencer = new CombatAnimationSequencer();

    sequencer.play(trace([0], 2, true), {
      onStep: (playback) => {
        stages.push(`${playback.stage}:${playback.exchangeIndex}`);
        if (playback.stage === 'impact' && playback.exchangeIndex === 1) {
          destroyedAtSecondImpact = playback.destroyedCardIds;
        }
      },
      onComplete: () => stages.push('complete')
    }, { durations: { highlight: 0, attack: 0, impact: 0, consequences: 0, transition: 0 } });

    expect(stages).toEqual([
      'highlight:0',
      'attack:0',
      'impact:0',
      'consequences:0',
      'impact:1',
      'consequences:1',
      'transition:1',
      'complete'
    ]);
    expect(destroyedAtSecondImpact).toEqual(['destroyed-card']);
  });

  it('accumulates HP damage only after each exchange reaches consequences', () => {
    const cumulativeAtSteps: Array<{ stage: string; exchange: number; damage: number }> = [];
    const sequencer = new CombatAnimationSequencer();

    sequencer.play(trace([0, 1], 2), {
      onStep: (playback) => cumulativeAtSteps.push({
        stage: playback.stage,
        exchange: playback.exchangeIndex,
        damage: playback.cumulativeHpDamage[2]
      }),
      onComplete: () => undefined
    }, { durations: { highlight: 0, attack: 0, impact: 0, consequences: 0, transition: 0 } });

    expect(cumulativeAtSteps.filter((step) => step.stage === 'consequences').map((step) => step.damage)).toEqual([700, 1_400, 2_100, 2_800]);
    expect(cumulativeAtSteps.find((step) => step.stage === 'impact' && step.exchange === 1)?.damage).toBe(700);
  });

  it('completes immediately when the trace has no attacking columns', () => {
    const callbacks: string[] = [];
    const sequencer = new CombatAnimationSequencer();

    sequencer.play({ columns: [], trailingEvents: [] }, {
      onStep: () => callbacks.push('step'),
      onComplete: () => callbacks.push('complete')
    });

    expect(callbacks).toEqual(['complete']);
  });

  it('respects reduced motion and speed changes', () => {
    vi.useFakeTimers();
    const reducedSteps: string[] = [];
    const reduced = new CombatAnimationSequencer();

    reduced.play(trace([1, 3]), {
      onStep: (playback) => reducedSteps.push(`${playback.column}:${playback.stage}`),
      onComplete: () => reducedSteps.push('complete')
    }, { reducedMotion: true });

    expect(reducedSteps).toEqual(['1:consequences', '3:consequences', 'complete']);

    const normalSteps: string[] = [];
    const sequencer = new CombatAnimationSequencer();
    sequencer.play(trace([0]), {
      onStep: (playback) => normalSteps.push(playback.stage),
      onComplete: () => normalSteps.push('complete')
    }, { durations: { highlight: 100, attack: 0, impact: 0, consequences: 0, transition: 0 } });

    vi.advanceTimersByTime(99);
    expect(normalSteps).toEqual(['highlight']);
    sequencer.setSpeed(2);
    vi.advanceTimersByTime(50);
    expect(normalSteps).toEqual(['highlight', 'attack', 'impact', 'consequences', 'transition', 'complete']);
  });

  it('cancels timers and never calls stale completion callbacks', () => {
    vi.useFakeTimers();
    const callbacks: string[] = [];
    const sequencer = new CombatAnimationSequencer();

    sequencer.play(trace([0]), {
      onStep: () => callbacks.push('step'),
      onComplete: () => callbacks.push('complete'),
      onCancel: () => callbacks.push('cancel')
    }, { durations: { highlight: 100, attack: 100, impact: 100, consequences: 100, transition: 100 } });

    sequencer.cancel();
    vi.runAllTimers();

    expect(callbacks).toEqual(['step', 'cancel']);
  });
});
