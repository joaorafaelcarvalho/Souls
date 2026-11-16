import { describe, expect, it } from 'vitest';
import {
  OFFICIAL_DECK_LEVEL_DISTRIBUTION,
  loadBrowserCardCatalog,
  validateOfficialDeckComposition,
  validateOfficialDeckReferences
} from '../src/index.js';

describe('official deck validation', () => {
  it('accepts exactly the Deck Builder distribution', () => {
    const catalog = loadBrowserCardCatalog();
    const cards = ([0, 1, 2, 3, 4] as const).flatMap((level) => {
      const definition = catalog.definitions.find((candidate) => candidate.level === level)!;
      return Array.from({ length: OFFICIAL_DECK_LEVEL_DISTRIBUTION[level] }, () => definition.id);
    });

    expect(validateOfficialDeckComposition(cards, catalog.byId).valid).toBe(true);
    expect(validateOfficialDeckReferences(cards, catalog)).toEqual(cards);
  });

  it('rejects an otherwise known 20-card deck with the wrong level distribution', () => {
    const catalog = loadBrowserCardCatalog();
    const cavaleiro = catalog.definitions.find((definition) => definition.name === 'Cavaleiro')!.id;
    const validation = validateOfficialDeckComposition(Array.from({ length: 20 }, () => cavaleiro), catalog.byId);

    expect(validation.valid).toBe(false);
    expect(validation.byLevel).toEqual({ 0: 20, 1: 0, 2: 0, 3: 0, 4: 0 });
    expect(validation.expectedByLevel).toEqual({ 0: 10, 1: 4, 2: 3, 3: 2, 4: 1 });
    expect(() => validateOfficialDeckReferences(Array.from({ length: 20 }, () => cavaleiro), catalog)).toThrow(/distribuição encontrada/);
  });
});
