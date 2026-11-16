import type { CardDefinition, CardDefinitionId } from '@souls/game-core';
import { CatalogValidationError } from '../validators/errors.js';
import type { CardCatalog } from './types.js';

export function createCardCatalog(definitions: readonly CardDefinition[]): CardCatalog {
  const byId: Record<CardDefinitionId, CardDefinition> = {};

  for (const definition of definitions) {
    if (byId[definition.id] !== undefined) {
      throw new CatalogValidationError(
        `Duplicate card definition UUID "${definition.id}".`
      );
    }

    byId[definition.id] = definition;
  }

  return {
    definitions: [...definitions],
    byId
  };
}