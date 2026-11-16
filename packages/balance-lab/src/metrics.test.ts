import { describe, expect, it } from 'vitest';
import { loadNodeCardCatalog } from './catalog.js';
import { createDeckFixture } from './decks.js';
import { runSimulation } from './simulation.js';
import type { SimulationConfig } from './types.js';

function config(): SimulationConfig {
  const catalog = loadNodeCardCatalog();
  return {
    games: 5,
    seed: 20261113,
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

describe('Balance Lab telemetry', () => {
  it('attributes combat damage to the source player and received damage to the target', () => {
    const catalog = loadNodeCardCatalog();
    const result = runSimulation(config(), catalog.byId);

    for (const game of result.games) {
      expect(game.damageDealt).toEqual(game.combatDamageDealt);
      expect(game.damageReceived).toEqual(game.combatDamageReceived);
      expect(game.damageDealt[1]).toBe(game.damageReceived[2]);
      expect(game.damageDealt[2]).toBe(game.damageReceived[1]);
      expect(game.metricWarnings).toEqual([]);
    }
  }, 20_000);

  it('keeps HP penalties and excess damage separate from combat damage', () => {
    const catalog = loadNodeCardCatalog();
    const result = runSimulation(config(), catalog.byId);
    expect(result.games.every((game) => game.damageReceived[1] + game.hpPenalties[1] >= 0)).toBe(true);
    expect(result.games.every((game) => game.damageReceived[2] + game.hpPenalties[2] >= 0)).toBe(true);
    expect(result.games.every((game) => game.excessDamage[1] + game.excessDamage[2] >= 0)).toBe(true);
  }, 20_000);

  it('keeps per-definition draw, invocation and destruction counters consistent with totals', () => {
    const catalog = loadNodeCardCatalog();
    const result = runSimulation(config(), catalog.byId);

    for (const game of result.games) {
      for (const playerId of [1, 2] as const) {
        const drawn = Object.values(game.cardsDrawnByDefinition[playerId]).reduce((sum, count) => sum + count, 0);
        const invoked = Object.values(game.cardsInvokedByDefinition[playerId]).reduce((sum, count) => sum + count, 0);
        const destroyed = Object.values(game.cardsDestroyedByDefinition[playerId]).reduce((sum, count) => sum + count, 0);
        expect(drawn).toBe(game.cardsDrawn[playerId]);
        expect(invoked).toBe(game.cardsInvoked[playerId]);
        expect(destroyed).toBe(game.cardsDestroyed[playerId]);
      }
    }
  }, 20_000);
});
