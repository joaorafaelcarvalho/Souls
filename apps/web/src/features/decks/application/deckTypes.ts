import type { CardDefinitionId, CardLevel } from '@souls/game-core';

export interface DeckCardEntry {
  readonly cardDefinitionId: CardDefinitionId;
  readonly quantity: number;
}

export interface SavedDeck {
  readonly id: string;
  readonly name: string;
  readonly cards: readonly DeckCardEntry[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface PlayerCardOwnership {
  readonly cardDefinitionId: CardDefinitionId;
  readonly quantity: number;
}

export interface DeckValidationResult {
  readonly valid: boolean;
  readonly totalCards: number;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}

export interface DeckStats {
  readonly totalCards: number;
  readonly meleeCount: number;
  readonly rangedCount: number;
  readonly byLevel: Readonly<Record<CardLevel, number>>;
  readonly factionCounts: Readonly<Record<string, number>>;
  readonly averageAttack: number;
  readonly averageDefense: number;
  readonly totalSoulCost: number;
  readonly averageSoulCost: number;
  readonly warnings: readonly string[];
}

export type PlayerDeckPair = readonly [readonly CardDefinitionId[], readonly CardDefinitionId[]];
