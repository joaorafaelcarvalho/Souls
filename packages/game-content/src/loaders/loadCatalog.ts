import type { CardDefinition } from '@souls/game-core';
import { createCardCatalog } from '../catalog/createCardCatalog.js';
import type { CardCatalog } from '../catalog/types.js';
import { validateCardDefinition } from '../validators/validateCardDefinition.js';

export type CatalogModule = CardDefinition | { readonly default: unknown };

function unwrapModule(value: unknown): unknown {
  if (
    typeof value === 'object' &&
    value !== null &&
    'default' in value
  ) {
    return (value as { readonly default: unknown }).default;
  }

  return value;
}

export function loadCatalogFromEntries(
  entries: Readonly<Record<string, unknown>>
): CardCatalog {
  const definitions = Object.entries(entries)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([source, value]) => validateCardDefinition(unwrapModule(value), source));

  return createCardCatalog(definitions);
}