import { describe, expect, it } from 'vitest';
import { loadBrowserCardCatalog } from '../src/loaders/loadBrowserCatalog.js';
import { loadLoreCatalog } from '../src/lore/catalog.js';

describe('SOULS lore catalog', () => {
  it('contains five factions and one narrative record for each official card', () => {
    const cards = loadBrowserCardCatalog();
    const lore = loadLoreCatalog();
    const cardIds = new Set(cards.definitions.map((definition) => definition.id));
    const factionIds = new Set(lore.factions.map((faction) => faction.id));

    expect(lore.factions).toHaveLength(5);
    expect(new Set(lore.factions.map((faction) => faction.id)).size).toBe(5);
    expect(lore.cards).toHaveLength(26);
    expect(new Set(lore.cards.map((entry) => entry.cardId)).size).toBe(26);
    expect(lore.cards.every((entry) => cardIds.has(entry.cardId))).toBe(true);
    expect(lore.cards.every((entry) => factionIds.has(entry.factionId))).toBe(true);
  });
});
