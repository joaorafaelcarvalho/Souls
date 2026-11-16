import { describe, expect, it } from 'vitest';
import { createAiDecisionAgent } from './decision.js';
import type { AiLegalPlacementOption, AiObservation } from './types.js';

const observation: AiObservation = {
  playerId: 2,
  activePlayerId: 2,
  round: 4,
  phase: 'positioning',
  board: { occupants: {} as AiObservation['board']['occupants'] },
  ownHp: 10_000,
  ownSouls: 3,
  opponentHp: 7_500,
  opponentSouls: 2,
  ownHand: [],
  boardCards: []
};

const options: readonly AiLegalPlacementOption[] = [
  {
    instanceId: 'free-card',
    cardDefinitionId: 'free-definition',
    definition: { id: 'free-definition', name: 'Free', level: 0, type: 'melee', attack: 500, defense: 500, image: '' },
    position: { row: 1, column: 0, type: 'melee', ownerId: 2, key: '1,0' }
  },
  {
    instanceId: 'strong-card',
    cardDefinitionId: 'strong-definition',
    definition: { id: 'strong-definition', name: 'Strong', level: 3, type: 'melee', attack: 1_700, defense: 600, image: '' },
    position: { row: 1, column: 1, type: 'melee', ownerId: 2, key: '1,1' }
  }
];

function cardView(
  instanceId: string,
  ownerId: 1 | 2,
  definition: AiLegalPlacementOption['definition'],
  position: AiLegalPlacementOption['position']
) {
  return { instanceId, cardDefinitionId: definition.id, ownerId, definition, position };
}

describe('game-ai decision engine', () => {
  it('returns only one of the legal options for every difficulty', () => {
    for (const difficulty of ['easy', 'normal', 'hard'] as const) {
      const agent = createAiDecisionAgent('balanced', difficulty);
      const choice = agent.choosePlacement(observation, options, { next: () => 0 });
      expect(options).toContain(choice);
    }
  });

  it('keeps difficulty in the decision layer instead of changing game rules', () => {
    const easy = createAiDecisionAgent('balanced', 'easy');
    const hard = createAiDecisionAgent('balanced', 'hard');

    expect(easy.difficulty).toBe('easy');
    expect(hard.difficulty).toBe('hard');
    expect(easy.strategy).toBe(hard.strategy);
  });

  it('can value a legal higher-level opportunity when Souls are available', () => {
    const hard = createAiDecisionAgent('balanced', 'hard');
    const choice = hard.choosePlacement(observation, options, { next: () => 0 });

    expect(choice?.instanceId).toBe('strong-card');
  });

  it('protects a ranged placement by choosing the same-column defense first', () => {
    const hard = createAiDecisionAgent('aggressive', 'hard');
    const defense: AiLegalPlacementOption = {
      instanceId: 'defense-card',
      cardDefinitionId: 'defense-definition',
      definition: { id: 'defense-definition', name: 'Defense', level: 1, type: 'melee', attack: 300, defense: 1_400, image: '' },
      position: { row: 1, column: 0, type: 'defense', ownerId: 2, key: '1,0' }
    };
    const ranged: AiLegalPlacementOption = {
      instanceId: 'ranged-card',
      cardDefinitionId: 'ranged-definition',
      definition: { id: 'ranged-definition', name: 'Ranged', level: 1, type: 'ranged', attack: 1_200, defense: 200, image: '' },
      position: { row: 1, column: 0, type: 'ranged', ownerId: 2, key: '1,0' }
    };
    const threatened = {
      ...observation,
      boardCards: [cardView(
        'enemy-melee',
        1,
        { id: 'enemy-definition', name: 'Enemy', level: 1, type: 'melee', attack: 1_000, defense: 300, image: '' },
        { row: 0, column: 0, type: 'melee', ownerId: 1, key: '0,0' }
      )]
    };

    expect(hard.choosePlacement(threatened, [ranged, defense], { next: () => 0 })?.instanceId).toBe('defense-card');
  });

  it('prefers a ranged card in a column protected by its own defense', () => {
    const hard = createAiDecisionAgent('balanced', 'hard');
    const protectedRanged: AiLegalPlacementOption = {
      instanceId: 'protected-ranged',
      cardDefinitionId: 'protected-ranged-definition',
      definition: { id: 'protected-ranged-definition', name: 'Protected Ranged', level: 1, type: 'ranged', attack: 1_000, defense: 200, image: '' },
      position: { row: 1, column: 1, type: 'ranged', ownerId: 2, key: '1,1' }
    };
    const exposedRanged: AiLegalPlacementOption = {
      ...protectedRanged,
      instanceId: 'exposed-ranged',
      cardDefinitionId: 'exposed-ranged-definition',
      definition: { ...protectedRanged.definition, id: 'exposed-ranged-definition', name: 'Exposed Ranged' },
      position: { row: 1, column: 2, type: 'ranged', ownerId: 2, key: '1,2' }
    };
    const protectedObservation = {
      ...observation,
      boardCards: [cardView(
        'own-defense',
        2,
        { id: 'own-defense-definition', name: 'Shield', level: 1, type: 'melee', attack: 200, defense: 1_500, image: '' },
        { row: 1, column: 1, type: 'defense', ownerId: 2, key: '1,1' }
      )]
    };

    expect(hard.choosePlacement(protectedObservation, [exposedRanged, protectedRanged], { next: () => 0 })?.instanceId).toBe('protected-ranged');
  });
});
