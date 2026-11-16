import { loadBrowserCardCatalog } from '@souls/game-content';
import { initializeGame, placeCard, type RandomSource } from '@souls/game-core';
import { describe, expect, it } from 'vitest';

const fixedRandom: RandomSource = { next: () => 0 };

function stateWithDefinition(definitionName: string) {
  const catalog = loadBrowserCardCatalog();
  const definition = catalog.definitions.find((entry) => entry.name === definitionName);

  if (definition === undefined) {
    throw new Error(`Definition ${definitionName} is missing from the catalog.`);
  }

  const deck = Array.from({ length: 20 }, () => definition.id);
  return initializeGame({
    cardDefinitions: catalog.definitions,
    players: [{ id: 1, deck }, { id: 2, deck }],
    random: fixedRandom
  });
}

describe('card expansion integration', () => {
  it('rejects a level-four invocation without enough Souls', () => {
    const initial = stateWithDefinition('Rei Exilado');
    const instanceId = initial.players[1].hand[0];

    if (instanceId === undefined) {
      throw new Error('The expansion fixture hand is empty.');
    }

    const state = {
      ...initial,
      players: { ...initial.players, 1: { ...initial.players[1], souls: 3 } }
    };

    expect(() => placeCard(state, { playerId: 1, instanceId, row: 4, column: 0 })).toThrowError(
      expect.objectContaining({ code: 'insufficient-souls' })
    );
  });

  it('pays the official level-four cost when the player has enough Souls', () => {
    const initial = stateWithDefinition('Rei Exilado');
    const instanceId = initial.players[1].hand[0];

    if (instanceId === undefined) {
      throw new Error('The expansion fixture hand is empty.');
    }

    const state = {
      ...initial,
      players: { ...initial.players, 1: { ...initial.players[1], souls: 4 } }
    };
    const result = placeCard(state, { playerId: 1, instanceId, row: 4, column: 0 });

    expect(result.state.players[1].souls).toBe(0);
    expect(result.state.board.occupants['4,0']).toBe(instanceId);
  });
});
