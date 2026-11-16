import { DECK_SIZE, type CardDefinitionId } from '@souls/game-core';
import type { CardCatalog } from '../catalog/types.js';
import { CatalogValidationError } from './errors.js';

export function validateDeckReferences(
  input: readonly unknown[],
  catalog: CardCatalog,
  source = 'deck'
): readonly CardDefinitionId[] {
  if (input.length !== DECK_SIZE) {
    throw new CatalogValidationError(
      `${source}: expected exactly ${DECK_SIZE} card definition UUIDs`
    );
  }

  return input.map((value, index) => {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new CatalogValidationError(`${source}[${index}]: expected a card definition UUID`);
    }

    if (catalog.byId[value] === undefined) {
      throw new CatalogValidationError(
        `${source}[${index}]: card definition UUID "${value}" was not found in the catalog`
      );
    }

    return value;
  });
}