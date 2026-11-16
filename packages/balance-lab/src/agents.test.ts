import { createEmptyBoard } from '@souls/game-core';
import { describe, expect, it } from 'vitest';
import { createAgent } from './agents.js';
import { createSeededRandom } from './random.js';
import type { LabObservation, LegalRetirementOption } from './types.js';

const lowCard = {
  id: 'low-card',
  name: 'Low card',
  level: 0 as const,
  type: 'melee' as const,
  attack: 500,
  defense: 500,
  image: '/images/cards/melee/example.svg'
};
const highCard = {
  id: 'high-card',
  name: 'High card',
  level: 4 as const,
  type: 'melee' as const,
  attack: 1_900,
  defense: 1_000,
  image: '/images/cards/melee/example.svg'
};

const retirement: LegalRetirementOption = {
  instanceId: 'board-low',
  cardDefinitionId: lowCard.id,
  definition: lowCard,
  position: { row: 4, column: 0, key: '4,0', type: 'melee', ownerId: 1 }
};

function observation(round: number): LabObservation {
  return {
    playerId: 1,
    activePlayerId: 1,
    round,
    phase: 'positioning',
    board: createEmptyBoard(),
    ownHp: 10_000,
    ownSouls: 1,
    opponentHp: 10_000,
    opponentSouls: 0,
    ownHand: [{ instanceId: 'hand-high', cardDefinitionId: highCard.id, ownerId: 1, definition: highCard }],
    boardCards: []
  };
}

describe('v0.7 strategic retirement decisions', () => {
  it('considers Soul Harvest only in a constrained strategic window', () => {
    const balanced = createAgent('balanced');
    const defensive = createAgent('defensive');

    expect(balanced.chooseRetirement(observation(4), [retirement], createSeededRandom(1))).toEqual(retirement);
    expect(balanced.chooseRetirement(observation(5), [retirement], createSeededRandom(1))).toBeNull();
    expect(defensive.chooseRetirement(observation(4), [retirement], createSeededRandom(1))).toBeNull();
  });
});
