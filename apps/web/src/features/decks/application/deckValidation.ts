import { OFFICIAL_DECK_LEVEL_DISTRIBUTION, validateOfficialDeckComposition, type CardCatalog } from '@souls/game-content';
import { DECK_SIZE, summonCost, type CardDefinitionId, type CardLevel } from '@souls/game-core';
import type { DeckCardEntry, DeckValidationResult, SavedDeck } from './deckTypes';

export function totalDeckCards(cards: readonly DeckCardEntry[]): number {
  return cards.reduce((total, entry) => total + entry.quantity, 0);
}

export const MAX_CARDS_BY_LEVEL = OFFICIAL_DECK_LEVEL_DISTRIBUTION;

export function levelQuantity(cards: readonly DeckCardEntry[], catalog: CardCatalog, level: CardLevel): number {
  return cards.reduce((total, entry) => {
    const definition = catalog.byId[entry.cardDefinitionId];
    return definition?.level === level ? total + entry.quantity : total;
  }, 0);
}

export function flattenDeckEntries(cards: readonly DeckCardEntry[]): CardDefinitionId[] {
  return cards.flatMap((entry) => Array.from({ length: entry.quantity }, () => entry.cardDefinitionId));
}

export function entryQuantity(cards: readonly DeckCardEntry[], cardDefinitionId: CardDefinitionId): number {
  return cards.find((entry) => entry.cardDefinitionId === cardDefinitionId)?.quantity ?? 0;
}

export function upsertDeckEntry(
  cards: readonly DeckCardEntry[],
  cardDefinitionId: CardDefinitionId,
  delta: number
): DeckCardEntry[] {
  const current = entryQuantity(cards, cardDefinitionId);
  const nextQuantity = Math.max(0, current + delta);
  const without = cards.filter((entry) => entry.cardDefinitionId !== cardDefinitionId);

  return nextQuantity === 0
    ? without
    : [...without, { cardDefinitionId, quantity: nextQuantity }];
}

export function validateDeckCards(
  cards: readonly DeckCardEntry[],
  catalog: CardCatalog,
  options: { readonly requireTwenty?: boolean } = {}
): DeckValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const seen = new Set<string>();
  let totalCards = 0;

  for (const entry of cards) {
    if (seen.has(entry.cardDefinitionId)) {
      errors.push('O baralho não pode repetir a mesma definição em entradas separadas.');
    }
    seen.add(entry.cardDefinitionId);

    if (catalog.byId[entry.cardDefinitionId] === undefined) {
      errors.push(`A carta ${entry.cardDefinitionId} não existe no catálogo oficial.`);
    }

    if (!Number.isInteger(entry.quantity) || entry.quantity <= 0) {
      errors.push('As quantidades das cartas devem ser inteiros positivos.');
      continue;
    }

    totalCards += entry.quantity;
  }

  if (options.requireTwenty !== false && totalCards !== DECK_SIZE) {
    errors.push(`Um baralho válido precisa de exatamente ${DECK_SIZE} cartas.`);
  }

  if (options.requireTwenty !== false) {
    const official = validateOfficialDeckComposition(flattenDeckEntries(cards), catalog.byId, 'baralho');
    errors.push(...official.errors);
  }

  for (const level of [0, 1, 2, 3, 4] as const) {
    const quantity = levelQuantity(cards, catalog, level);
    if (quantity > MAX_CARDS_BY_LEVEL[level]) {
      errors.push(`O nível ${level} permite no máximo ${MAX_CARDS_BY_LEVEL[level]} cartas neste baralho.`);
    }
  }

  if (totalCards === 0) {
    warnings.push('O baralho ainda não contém cartas.');
  }

  return { valid: errors.length === 0, totalCards, errors, warnings };
}

export function validateSavedDeck(deck: SavedDeck, catalog: CardCatalog): DeckValidationResult {
  const base = validateDeckCards(deck.cards, catalog);
  const errors = [...base.errors];

  if (deck.name.trim().length === 0) {
    errors.push('O baralho precisa de um nome.');
  }

  return { ...base, errors, valid: errors.length === 0 };
}

export function calculateDeckCost(cards: readonly DeckCardEntry[], catalog: CardCatalog): number {
  return cards.reduce((total, entry) => {
    const definition = catalog.byId[entry.cardDefinitionId];
    return definition === undefined ? total : total + summonCost(definition.level) * entry.quantity;
  }, 0);
}
