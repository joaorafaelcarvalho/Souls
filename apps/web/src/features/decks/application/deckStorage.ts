import type { CardCatalog } from '@souls/game-content';
import { validateDeckCards } from './deckValidation';
import type { DeckCardEntry, SavedDeck } from './deckTypes';

const STORAGE_KEY = 'souls.saved-decks.v1';
const STORAGE_VERSION = 1;

interface PersistedDecks {
  readonly version: number;
  readonly decks: readonly SavedDeck[];
}

function makeId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') return globalThis.crypto.randomUUID();
  return `deck-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createSavedDeck(name: string, cards: readonly DeckCardEntry[] = []): SavedDeck {
  const now = new Date().toISOString();
  return { id: makeId(), name, cards, createdAt: now, updatedAt: now };
}

export function createPrototypeDeck(catalog: CardCatalog): SavedDeck {
  const entries = [
    ['Cavaleiro', 3], ['Arqueiro', 2], ['Defensor', 2], ['Mago', 1], ['Escudeiro das Cinzas', 1], ['Batedora do Breu', 1],
    ['Cavaleiro Negro', 1], ['Arqueira do Crepúsculo', 1], ['Vigia da Capela', 1], ['Lanceiro de Ferro', 1],
    ['Guardião das Correntes', 1], ['Caçadora da Lua Pálida', 1], ['Tecelão de Almas', 1],
    ['Paladino da Última Vigília', 1], ['Matriarca dos Selos', 1], ['Rei Exilado', 1]
  ] as const;
  const cards = entries.flatMap(([name, quantity]) => {
    const cardDefinitionId = catalog.definitions.find((definition) => definition.name === name)?.id;
    return cardDefinitionId === undefined ? [] : [{ cardDefinitionId, quantity }];
  });

  return {
    id: 'prototype-technical-deck',
    name: 'Baralho Técnico',
    cards,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  };
}

function storageAvailable(): boolean {
  return typeof window !== 'undefined' && window.localStorage !== undefined;
}

export function loadSavedDecks(catalog: CardCatalog): SavedDeck[] {
  const fallback = [createPrototypeDeck(catalog)];
  if (!storageAvailable()) return fallback;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw) as Partial<PersistedDecks>;
    if (parsed.version !== STORAGE_VERSION || !Array.isArray(parsed.decks)) return fallback;

    const valid = parsed.decks.filter((deck): deck is SavedDeck => {
      if (deck === null || typeof deck !== 'object') return false;
      const candidate = deck as SavedDeck;
      return typeof candidate.id === 'string'
        && typeof candidate.name === 'string'
        && Array.isArray(candidate.cards)
        && typeof candidate.createdAt === 'string'
        && typeof candidate.updatedAt === 'string'
        && validateDeckCards(candidate.cards, catalog, { requireTwenty: false }).errors.length === 0;
    });

    return valid.length === 0 ? fallback : valid;
  } catch {
    return fallback;
  }
}

export function persistSavedDecks(decks: readonly SavedDeck[]): void {
  if (!storageAvailable()) return;
  const payload: PersistedDecks = { version: STORAGE_VERSION, decks };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function updateSavedDeck(deck: SavedDeck, name: string, cards: readonly DeckCardEntry[]): SavedDeck {
  return { ...deck, name: name.trim() || deck.name, cards, updatedAt: new Date().toISOString() };
}

export { STORAGE_KEY };
