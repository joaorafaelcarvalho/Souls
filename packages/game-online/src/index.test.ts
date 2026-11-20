import { describe, expect, it } from 'vitest';
import { createAuthorizedGameView } from './index';
import { initializeGame } from '@souls/game-core';

describe('authorized online projection', () => {
  it('exposes only the viewer hand and public board data', () => {
    let uuidIndex = 0;
    const state = initializeGame({
      players: [
        { id: 1, deck: Array.from({ length: 20 }, () => 'card-a') },
        { id: 2, deck: Array.from({ length: 20 }, () => 'card-a') }
      ],
      cardDefinitions: [{
        id: 'card-a',
        name: 'Carta de teste',
        level: 0,
        type: 'melee',
        attack: 100,
        defense: 100,
        image: '/card.png'
      }],
      random: { next: () => 0 },
      uuidGenerator: {
        next: () => `00000000-0000-4000-8000-${String(uuidIndex++).padStart(12, '0')}`
      }
    });

    const view = createAuthorizedGameView(state, 1);
    const opponentHandId = state.players[2].hand[0];

    expect(view.viewer.hand).toEqual(state.players[1].hand);
    expect(view.players[2].hand).toBeNull();
    expect(opponentHandId === undefined ? undefined : view.visibleCardInstances[opponentHandId]).toBeUndefined();
  });
});
