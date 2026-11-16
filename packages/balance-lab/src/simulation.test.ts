import { describe, expect, it } from 'vitest';
import { loadNodeCardCatalog } from './catalog.js';
import { createDeckFixture, createNegativeDeckFixture } from './decks.js';
import { runPairedSimulation, runSimulation } from './simulation.js';
import type { SimulationConfig } from './types.js';

function config(seed: number): SimulationConfig {
  const catalog = loadNodeCardCatalog();
  return {
    games: 3,
    seed,
    maxRounds: 60,
    maxActions: 600,
    playerOneStrategy: 'balanced',
    playerTwoStrategy: 'aggressive',
    playerOneDeck: createDeckFixture(catalog, 'balanced'),
    playerTwoDeck: createDeckFixture(catalog, 'aggressive'),
    rulesVersion: 'SOULS v0.7',
    catalogVersion: `local-${catalog.definitions.length}-definitions`
  };
}

describe('Balance Lab simulation', () => {
  it('executes complete or safely bounded games through game-core', () => {
    const catalog = loadNodeCardCatalog();
    const result = runSimulation(config(1234), catalog.byId);

    expect(result.games).toHaveLength(3);
    expect(result.aggregate.games).toBe(3);
    expect(result.games.every((game) => game.actions > 0)).toBe(true);
    expect(result.games.every((game) => game.status === 'completed' || game.status === 'inconclusive')).toBe(true);
  }, 20_000);

  it('repeats the same game metrics with the same seed', () => {
    const catalog = loadNodeCardCatalog();
    const first = runSimulation(config(4321), catalog.byId);
    const second = runSimulation(config(4321), catalog.byId);

    expect(first.games).toEqual(second.games);
  }, 20_000);

  it('keeps paired seeds equal while explicitly inverting player priority and positions', () => {
    const catalog = loadNodeCardCatalog();
    const result = runPairedSimulation(config(777), catalog.byId);

    expect(result.comparisons).toHaveLength(3);
    expect(result.comparisons.every((pair) => pair.seed === 777 + pair.pairIndex - 1)).toBe(true);
    expect(result.baseline.games.every((game) => game.firstPlayerId === 1)).toBe(true);
    expect(result.swapped.games.every((game) => game.firstPlayerId === 2)).toBe(true);
    expect(result.baseline.games.map((game) => game.seed)).toEqual(result.swapped.games.map((game) => game.seed));
  }, 20_000);

  it('retains detailed events only for the selected games', () => {
    const catalog = loadNodeCardCatalog();
    const result = runSimulation({ ...config(99), eventGames: [2] }, catalog.byId);

    expect(result.games[0]?.events).toBeUndefined();
    expect(result.games[1]?.events).toBeDefined();
    expect(result.games[2]?.events).toBeUndefined();
  }, 20_000);

  it('rejects an invalid deck before starting a simulation', () => {
    const catalog = loadNodeCardCatalog();
    expect(() => runSimulation({
      ...config(100),
      playerOneDeck: createNegativeDeckFixture(catalog)
    }, catalog.byId)).toThrow(/baralhos inválidos|distribuição encontrada/);
  });
});
