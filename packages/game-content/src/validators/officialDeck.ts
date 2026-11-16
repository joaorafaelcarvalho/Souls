import { DECK_SIZE, type CardDefinition, type CardDefinitionId, type CardLevel } from '@souls/game-core';
import type { CardCatalog } from '../catalog/types.js';
import { CatalogValidationError } from './errors.js';
import { validateDeckReferences } from './validateDeckReferences.js';

export const OFFICIAL_DECK_LEVEL_DISTRIBUTION: Readonly<Record<CardLevel, number>> = {
  0: 10,
  1: 4,
  2: 3,
  3: 2,
  4: 1
};

export interface OfficialDeckValidationResult {
  readonly valid: boolean;
  readonly totalCards: number;
  readonly byLevel: Readonly<Record<CardLevel, number>>;
  readonly expectedByLevel: Readonly<Record<CardLevel, number>>;
  readonly errors: readonly string[];
}

function emptyLevels(): Record<CardLevel, number> {
  return { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
}

function formatDistribution(distribution: Readonly<Record<CardLevel, number>>): string {
  return 'N0=' + distribution[0] + ', N1=' + distribution[1] + ', N2=' + distribution[2] + ', N3=' + distribution[3] + ', N4=' + distribution[4];
}

export function validateOfficialDeckComposition(
  cardDefinitionIds: readonly CardDefinitionId[],
  definitions: Readonly<Record<CardDefinitionId, CardDefinition>>,
  source = 'deck'
): OfficialDeckValidationResult {
  const byLevel = emptyLevels();
  const errors: string[] = [];

  for (const [index, cardDefinitionId] of cardDefinitionIds.entries()) {
    const definition = definitions[cardDefinitionId];
    if (definition === undefined) {
      errors.push(source + '[' + index + ']: a definição "' + cardDefinitionId + '" não existe no catálogo oficial.');
      continue;
    }
    byLevel[definition.level] += 1;
  }

  if (cardDefinitionIds.length !== DECK_SIZE) {
    errors.push(source + ': a distribuição oficial exige exatamente ' + DECK_SIZE + ' cartas; foram encontradas ' + cardDefinitionIds.length + '.');
  }

  for (const level of [0, 1, 2, 3, 4] as const) {
    const expected = OFFICIAL_DECK_LEVEL_DISTRIBUTION[level];
    const found = byLevel[level];
    if (found !== expected) {
      errors.push(source + ': nível ' + level + ' exige ' + expected + ' cartas, mas foram encontradas ' + found + '.');
    }
  }

  if (errors.length > 0) {
    errors.unshift(source + ': distribuição encontrada (' + formatDistribution(byLevel) + '); esperada (' + formatDistribution(OFFICIAL_DECK_LEVEL_DISTRIBUTION) + ').');
  }

  return {
    valid: errors.length === 0,
    totalCards: cardDefinitionIds.length,
    byLevel,
    expectedByLevel: OFFICIAL_DECK_LEVEL_DISTRIBUTION,
    errors
  };
}

export function validateOfficialDeckReferences(
  input: readonly unknown[],
  catalog: CardCatalog,
  source = 'deck'
): readonly CardDefinitionId[] {
  const references = validateDeckReferences(input, catalog, source);
  const validation = validateOfficialDeckComposition(references, catalog.byId, source);
  if (!validation.valid) {
    throw new CatalogValidationError(validation.errors.join(' '));
  }
  return references;
}
