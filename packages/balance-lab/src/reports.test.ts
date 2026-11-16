import { describe, expect, it } from 'vitest';
import { loadNodeCardCatalog } from './catalog.js';
import { createDeckFixture } from './decks.js';
import { aggregateMarkdown, simulationCsv } from './reports.js';
import { runSimulation } from './simulation.js';
import type { SimulationConfig } from './types.js';

describe('Balance Lab reports', () => {
  it('keeps the requested telemetry and deterministic rule coverage in Markdown and CSV', () => {
    const catalog = loadNodeCardCatalog();
    const config: SimulationConfig = {
      games: 1,
      seed: 77,
      maxRounds: 20,
      maxActions: 200,
      playerOneStrategy: 'high-cost',
      playerTwoStrategy: 'low-cost',
      playerOneDeck: createDeckFixture(catalog, 'high-cost'),
      playerTwoDeck: createDeckFixture(catalog, 'low-cost'),
      rulesVersion: 'SOULS v0.7',
      catalogVersion: `local-${catalog.definitions.length}-definitions`
    };
    const output = runSimulation(config, catalog.byId);
    const markdown = aggregateMarkdown(output.aggregate);
    const csv = simulationCsv(output.games);

    expect(markdown).toContain('Testes determinísticos do motor');
    expect(markdown).toContain('Dano de combate causado');
    expect(markdown).toContain('Cartas que não existem no baralho');
    expect(csv).toContain('playerOneStrategy');
    expect(csv).toContain('p1DamageDealt');
    expect(csv).toContain('p1RemainingHandByLevel');
  });
});
