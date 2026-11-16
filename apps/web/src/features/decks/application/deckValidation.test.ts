import { loadBrowserCardCatalog } from '@souls/game-content';
import { describe, expect, it } from 'vitest';
import { calculateDeckStats } from './deckStats';
import { flattenDeckEntries, validateDeckCards } from './deckValidation';

describe('Deck Builder contracts', () => {
  it('validates a 20-card composition by official UUID', () => {
    const catalog = loadBrowserCardCatalog();
    const entries = ([0, 1, 2, 3, 4] as const).map((level) => ({
      cardDefinitionId: catalog.definitions.find((card) => card.level === level)!.id,
      quantity: ({ 0: 10, 1: 4, 2: 3, 3: 2, 4: 1 } as const)[level]
    }));

    expect(validateDeckCards(entries, catalog)).toMatchObject({ valid: true, totalCards: 20 });
    expect(flattenDeckEntries(entries)).toHaveLength(20);
  });

  it('calculates weighted statistics using quantities', () => {
    const catalog = loadBrowserCardCatalog();
    const cavaleiro = catalog.definitions.find((definition) => definition.name === 'Cavaleiro')!;
    const lore = new Map<string, never>();
    const stats = calculateDeckStats([{ cardDefinitionId: cavaleiro.id, quantity: 20 }], catalog, lore);

    expect(stats.totalCards).toBe(20);
    expect(stats.averageAttack).toBe(cavaleiro.attack);
    expect(stats.averageDefense).toBe(cavaleiro.defense);
    expect(stats.byLevel[cavaleiro.level]).toBe(20);
  });

  it('enforces the requested total limit per card level', () => {
    const catalog = loadBrowserCardCatalog();
    const levelZero = catalog.definitions.find((definition) => definition.level === 0)!;
    const levelOne = catalog.definitions.find((definition) => definition.level === 1)!;

    expect(validateDeckCards([{ cardDefinitionId: levelZero.id, quantity: 11 }], catalog, { requireTwenty: false }).valid).toBe(false);
    expect(validateDeckCards([{ cardDefinitionId: levelOne.id, quantity: 5 }], catalog, { requireTwenty: false }).valid).toBe(false);
  });

  it('rejects a complete deck that does not follow the official 10/4/3/2/1 distribution', () => {
    const catalog = loadBrowserCardCatalog();
    const levelZero = catalog.definitions.find((definition) => definition.level === 0)!;

    const validation = validateDeckCards([{ cardDefinitionId: levelZero.id, quantity: 20 }], catalog);

    expect(validation.valid).toBe(false);
    expect(validation.errors.some((error) => error.includes('distribuição encontrada'))).toBe(true);
  });
});
