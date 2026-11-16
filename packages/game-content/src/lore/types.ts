import type { CardDefinitionId } from '@souls/game-core';

export interface FactionDefinition {
  readonly id: string;
  readonly name: string;
  readonly motto: string;
  readonly summary: string;
  readonly description: string;
  readonly colors: readonly [string, string];
  readonly emblem: string;
}

export interface CardLoreDefinition {
  readonly cardId: CardDefinitionId;
  readonly factionId: string;
  readonly epithet: string;
  readonly shortDescription: string;
  readonly story: string;
}

export interface LoreCatalog {
  readonly factions: readonly FactionDefinition[];
  readonly cards: readonly CardLoreDefinition[];
}
