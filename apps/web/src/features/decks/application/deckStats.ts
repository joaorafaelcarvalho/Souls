import type { CardCatalog } from '@souls/game-content';
import type { CardLoreDefinition } from '@souls/game-content';
import { summonCost, type CardLevel } from '@souls/game-core';
import type { DeckCardEntry, DeckStats } from './deckTypes';

const levels: readonly CardLevel[] = [0, 1, 2, 3, 4];

export function calculateDeckStats(
  cards: readonly DeckCardEntry[],
  catalog: CardCatalog,
  loreByCardId: ReadonlyMap<string, CardLoreDefinition>
): DeckStats {
  const byLevel: Record<CardLevel, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
  const factionCounts: Record<string, number> = {};
  let totalCards = 0;
  let meleeCount = 0;
  let rangedCount = 0;
  let attackTotal = 0;
  let defenseTotal = 0;
  let totalSoulCost = 0;

  for (const entry of cards) {
    const definition = catalog.byId[entry.cardDefinitionId];
    if (definition === undefined) continue;

    totalCards += entry.quantity;
    byLevel[definition.level] += entry.quantity;
    attackTotal += definition.attack * entry.quantity;
    defenseTotal += definition.defense * entry.quantity;
    totalSoulCost += summonCost(definition.level) * entry.quantity;

    if (definition.type === 'melee') meleeCount += entry.quantity;
    else rangedCount += entry.quantity;

    const factionId = loreByCardId.get(definition.id)?.factionId;
    if (factionId !== undefined) factionCounts[factionId] = (factionCounts[factionId] ?? 0) + entry.quantity;
  }

  const warnings: string[] = [];
  if (totalCards > 0 && byLevel[0] === 0) warnings.push('Poucas cartas gratuitas para os primeiros turnos.');
  if (totalCards > 0 && meleeCount > rangedCount * 3) warnings.push('Predomínio elevado de cartas melee.');
  if (totalCards > 0 && totalSoulCost / totalCards >= 2.5) warnings.push('Custo médio de invocação elevado.');

  return {
    totalCards,
    meleeCount,
    rangedCount,
    byLevel,
    factionCounts,
    averageAttack: totalCards === 0 ? 0 : Math.round(attackTotal / totalCards),
    averageDefense: totalCards === 0 ? 0 : Math.round(defenseTotal / totalCards),
    totalSoulCost,
    averageSoulCost: totalCards === 0 ? 0 : Number((totalSoulCost / totalCards).toFixed(1)),
    warnings
  };
}

export { levels };
