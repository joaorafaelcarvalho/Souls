import { describe, expect, it } from 'vitest';
import { loadNodeCardCatalog } from './catalog.js';
import { analyzeDeckFixture, createDeckFixture, createNegativeDeckFixture } from './decks.js';
import type { AgentStrategy } from './types.js';

describe('Balance Lab deck fixtures', () => {
  it('creates valid 20-card fixtures with distinct strategic profiles', () => {
    const catalog = loadNodeCardCatalog();
    const strategies: readonly AgentStrategy[] = ['balanced', 'aggressive', 'defensive', 'low-cost', 'high-cost', 'combined-attack'];
    const distributions = strategies.map((strategy, index) => analyzeDeckFixture(index === 0 ? 1 : 2, createDeckFixture(catalog, strategy), catalog.byId));

    for (const distribution of distributions) {
      expect(distribution.totalCards).toBe(20);
      expect(distribution.valid).toBe(true);
      expect(distribution.practicalToStart).toBe(true);
      expect(distribution.validationErrors).toEqual([]);
      expect(distribution.byLevel).toEqual({ 0: 10, 1: 4, 2: 3, 3: 2, 4: 1 });
    }

    expect(distributions.find((entry) => entry.profile === 'aggressive')?.byLevel[0]).toBeGreaterThan(0);
    expect(distributions.find((entry) => entry.profile === 'defensive')?.byLevel[0]).toBeGreaterThan(0);
    expect(distributions.find((entry) => entry.profile === 'low-cost')?.byLevel[0]).toBe(10);
    expect(distributions.find((entry) => entry.profile === 'high-cost')?.byLevel[4]).toBeGreaterThan(0);
    expect(distributions.find((entry) => entry.profile === 'combined-attack')?.byType.melee).toBeGreaterThan(0);
    expect(distributions.find((entry) => entry.profile === 'combined-attack')?.byType.ranged).toBeGreaterThan(0);
  });

  it('keeps the all-expensive fixture as an explicit negative scenario', () => {
    const catalog = loadNodeCardCatalog();
    const distribution = analyzeDeckFixture(1, createNegativeDeckFixture(catalog), catalog.byId);

    expect(distribution.profile).toBe('expensive-negative');
    expect(distribution.totalCards).toBe(20);
    expect(distribution.valid).toBe(false);
    expect(distribution.practicalToStart).toBe(false);
    expect(distribution.freeCards).toBe(0);
    expect(distribution.validationErrors.some((error) => error.includes('distribuição encontrada'))).toBe(true);
  });
});
