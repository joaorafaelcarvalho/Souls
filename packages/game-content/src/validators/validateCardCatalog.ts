import type { CardDefinition } from '@souls/game-core';
import { createCardCatalog } from '../catalog/createCardCatalog.js';
import type { CardCatalog } from '../catalog/types.js';
import { validateCardDefinition } from './validateCardDefinition.js';

export function validateCardCatalog(
  inputs: readonly unknown[],
  source = 'card catalog'
): CardCatalog {
  const definitions: CardDefinition[] = [];

  for (const [index, input] of inputs.entries()) {
    definitions.push(validateCardDefinition(input, `${source}[${index}]`));
  }

  return createCardCatalog(definitions);
}