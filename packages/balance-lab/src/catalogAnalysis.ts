import type { CardCatalog, CardLoreDefinition, LoreCatalog } from '@souls/game-content';
import type { CardLevel, CardType } from '@souls/game-core';

export interface CatalogAnalysis {
  readonly totalDefinitions: number;
  readonly byLevel: Readonly<Record<CardLevel, number>>;
  readonly byType: Readonly<Record<CardType, number>>;
  readonly byFaction: Readonly<Record<string, number>>;
  readonly averageAttackByLevel: Readonly<Record<CardLevel, number>>;
  readonly averageDefenseByLevel: Readonly<Record<CardLevel, number>>;
  readonly definitions: readonly {
    readonly id: string;
    readonly name: string;
    readonly type: CardType;
    readonly level: CardLevel;
    readonly attack: number;
    readonly defense: number;
    readonly factionId?: string;
  }[];
}

export function analyzeCatalog(catalog: CardCatalog, lore: LoreCatalog): CatalogAnalysis {
  const loreByCardId = new Map<string, CardLoreDefinition>(lore.cards.map((entry) => [entry.cardId, entry]));
  const byLevel: Record<CardLevel, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
  const attackTotals: Record<CardLevel, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
  const defenseTotals: Record<CardLevel, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
  const levelCounts: Record<CardLevel, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
  const byType: Record<CardType, number> = { melee: 0, ranged: 0 };
  const byFaction: Record<string, number> = {};

  const definitions = catalog.definitions.map((definition) => {
    const factionId = loreByCardId.get(definition.id)?.factionId;
    byLevel[definition.level] += 1;
    levelCounts[definition.level] += 1;
    attackTotals[definition.level] += definition.attack;
    defenseTotals[definition.level] += definition.defense;
    byType[definition.type] += 1;
    if (factionId !== undefined) byFaction[factionId] = (byFaction[factionId] ?? 0) + 1;
    return { id: definition.id, name: definition.name, type: definition.type, level: definition.level, attack: definition.attack, defense: definition.defense, ...(factionId === undefined ? {} : { factionId }) };
  });

  return {
    totalDefinitions: catalog.definitions.length,
    byLevel,
    byType,
    byFaction,
    averageAttackByLevel: { 0: average(attackTotals[0], levelCounts[0]), 1: average(attackTotals[1], levelCounts[1]), 2: average(attackTotals[2], levelCounts[2]), 3: average(attackTotals[3], levelCounts[3]), 4: average(attackTotals[4], levelCounts[4]) },
    averageDefenseByLevel: { 0: average(defenseTotals[0], levelCounts[0]), 1: average(defenseTotals[1], levelCounts[1]), 2: average(defenseTotals[2], levelCounts[2]), 3: average(defenseTotals[3], levelCounts[3]), 4: average(defenseTotals[4], levelCounts[4]) },
    definitions
  };
}

function average(total: number, count: number): number {
  return count === 0 ? 0 : Number((total / count).toFixed(2));
}
