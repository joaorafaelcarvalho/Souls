import { loadBrowserCardCatalog } from '@souls/game-content';
import { afterEach, describe, expect, it } from 'vitest';
import { createSavedDeck, loadSavedDecks, persistSavedDecks } from './deckStorage';

afterEach(() => window.localStorage.clear());

describe('deck storage', () => {
  it('provides a valid prototype deck when storage is empty', () => {
    const decks = loadSavedDecks(loadBrowserCardCatalog());
    expect(decks[0]?.id).toBe('prototype-technical-deck');
    expect(decks[0]?.cards.reduce((total, entry) => total + entry.quantity, 0)).toBe(20);
  });

  it('persists saved deck definitions without duplicating card attributes', () => {
    const deck = createSavedDeck('Teste', []);
    persistSavedDecks([deck]);

    expect(loadSavedDecks(loadBrowserCardCatalog())).toMatchObject([{ id: deck.id, name: 'Teste', cards: [] }]);
  });
});
