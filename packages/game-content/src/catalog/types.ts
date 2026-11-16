import type { CardDefinition, CardDefinitionId } from '@souls/game-core';

export interface CardCatalog {
  readonly definitions: readonly CardDefinition[];
  readonly byId: Readonly<Record<CardDefinitionId, CardDefinition>>;
}