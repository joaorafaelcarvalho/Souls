import { describe, expect, it } from 'vitest';
import type { CombatPlaybackState } from '../../features/combat/application/CombatAnimationSequencer';
import { audioAssetsForCombatPlayback, audioAssetsForEvent } from './audioEvents';

const basePlayback: CombatPlaybackState = {
  column: 0,
  columnIndex: 0,
  totalColumns: 1,
  stage: 'attack',
  stageIndex: 1,
  exchangeIndex: 0,
  exchangeCount: 1,
  attackerIds: ['melee-1'],
  targetIds: [],
  pathTargetIds: [],
  destroyedCardIds: [],
  activeDestroyedCardIds: [],
  outcome: 'direct-damage',
  exchangeOutcome: 'direct-damage',
  events: [],
  soulAwards: [],
  hpDamage: 0,
  cumulativeHpDamage: { 1: 0, 2: 0 },
  isCombined: false,
  speed: 1
};

const context = {
  cardInstances: {
    'melee-1': { cardDefinitionId: 'melee-definition' },
    'ranged-1': { cardDefinitionId: 'ranged-definition' }
  },
  cardDefinitions: {
    'melee-definition': { type: 'melee' as const },
    'ranged-definition': { type: 'ranged' as const }
  }
};

describe('audio event bindings', () => {
  it('maps official events without inventing new domain events', () => {
    expect(audioAssetsForEvent({ type: 'card-drawn', playerId: 1, attempt: 1, instanceId: 'card-1' })).toEqual(['sfx.card.draw']);
    expect(audioAssetsForEvent({ type: 'card-invoked', playerId: 1, instanceId: 'card-1', position: '3,0' })).toEqual(['sfx.card.place']);
    expect(audioAssetsForEvent({ type: 'souls-spent', playerId: 1, amount: 1, reason: 'failed-draw' })).toEqual(['sfx.soul.spend']);
    expect(audioAssetsForEvent({ type: 'souls-spent', playerId: 1, amount: 1, reason: 'invocation' })).toEqual(['sfx.soul.spend', 'sfx.card.summon']);
    expect(audioAssetsForEvent({ type: 'damage-dealt', targetPlayerId: 2, amount: 500, reason: 'failed-draw' })).toEqual(['sfx.player.damage']);
    expect(audioAssetsForEvent({ type: 'turn-started', round: 2, playerId: 1, phase: 'draw' })).toEqual([]);
  });

  it('places timeline markers at attack and impact stages, including blocks', () => {
    expect(audioAssetsForCombatPlayback(basePlayback, context)).toEqual(['sfx.combat.melee']);
    expect(audioAssetsForCombatPlayback({
      ...basePlayback,
      stage: 'attack',
      attackerIds: ['ranged-1']
    }, context)).toEqual(['sfx.combat.ranged']);
    expect(audioAssetsForCombatPlayback({
      ...basePlayback,
      stage: 'impact',
      exchangeOutcome: 'blocked'
    }, context)).toEqual(['sfx.combat.block']);
    expect(audioAssetsForCombatPlayback({
      ...basePlayback,
      stage: 'consequences',
      activeDestroyedCardIds: ['melee-1'],
      soulAwards: [{ playerId: 1, amount: 1 }],
      hpDamage: 300
    }, context)).toEqual(['sfx.combat.destroy', 'sfx.soul.gain', 'sfx.player.damage']);
  });
});
