import { describe, expect, it } from 'vitest';
import { loadBrowserCardCatalog } from '@souls/game-content';
import { createDemoGame } from './match';

describe('createDemoGame', () => {
  it('keeps the first-player result owned by game-core random input', () => {
    const playerOneStarts = createDemoGame({ next: () => 0 });
    const playerTwoStarts = createDemoGame({ next: () => 0.75 });

    expect(playerOneStarts.turn.firstPlayerId).toBe(1);
    expect(playerTwoStarts.turn.firstPlayerId).toBe(2);
    expect(playerTwoStarts.turn.activePlayerId).toBe(2);
  });

  it('passes selected definition decks to the official game initializer', () => {
    const catalog = loadBrowserCardCatalog();
    const deckOne = ([0, 1, 2, 3, 4] as const).flatMap((level) => {
      const definition = catalog.definitions.find((candidate) => candidate.level === level)!;
      return Array.from({ length: ({ 0: 10, 1: 4, 2: 3, 3: 2, 4: 1 } as const)[level] }, () => definition.id);
    });
    const deckTwo = [...deckOne];
    const state = createDemoGame({ next: () => 0 }, [deckOne, deckTwo]);

    const playerOneDefinitions = [...state.players[1].hand, ...state.players[1].deck].map((id) => state.cardInstances[id]!.cardDefinitionId);
    const playerTwoDefinitions = [...state.players[2].hand, ...state.players[2].deck].map((id) => state.cardInstances[id]!.cardDefinitionId);

    expect(new Set(playerOneDefinitions)).toEqual(new Set(deckOne));
    expect(new Set(playerTwoDefinitions)).toEqual(new Set(deckTwo));
  });
});
