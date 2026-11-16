import type { RandomSource } from '@souls/game-core';
import type {
  AiDecisionAgent,
  AiDifficulty,
  AiLegalPlacementOption,
  AiLegalRetirementOption,
  AiObservation,
  AiStrategy
} from './types.js';

function scoreStrategy(strategy: AiStrategy, option: AiLegalPlacementOption, observation: AiObservation): number {
  const offensive = option.position.type !== 'defense';
  const sameColumn = observation.boardCards.filter((card) => card.ownerId === observation.playerId && card.position?.column === option.position.column);
  const complementary = sameColumn.some((card) => card.position?.type !== option.position.type && card.position?.type !== 'defense');

  switch (strategy) {
    case 'aggressive': return option.definition.attack * 3 + (offensive ? 500 : 0) + option.definition.level * 20;
    case 'defensive': return option.definition.defense * 3 + (option.position.type === 'defense' ? 800 : 0);
    case 'low-cost': return (4 - option.definition.level) * 500 + option.definition.attack;
    case 'high-cost': return option.definition.level * 700 + option.definition.attack;
    case 'combined-attack': return (complementary ? 2_000 : 0) + (offensive ? 250 : 0) + option.definition.attack;
    case 'random-legal': return 0;
    case 'balanced': return option.definition.attack + option.definition.defense + (offensive ? 100 : 0);
  }
}

function scoreHard(
  option: AiLegalPlacementOption,
  observation: AiObservation,
  strategy: AiStrategy,
  legalOptions: readonly AiLegalPlacementOption[]
): number {
  const sameColumn = observation.boardCards.filter(
    (card) => card.ownerId === observation.playerId && card.position?.column === option.position.column
  );
  const opponentColumns = observation.boardCards.filter(
    (card) => card.ownerId !== observation.playerId && card.position?.column === option.position.column
  );
  const ownDefense = sameColumn.filter((card) => card.position?.type === 'defense');
  const ownRanged = sameColumn.filter((card) => card.position?.type === 'ranged');
  const opponentPressure = opponentColumns
    .filter((card) => card.position?.type !== 'defense')
    .reduce((total, card) => total + card.definition.attack, 0);
  const directLane = opponentColumns.length === 0 && option.position.type !== 'defense';
  const ownThreat = observation.ownHp < 4_000 && option.position.type === 'defense';
  const futureValue = option.definition.level * (observation.ownSouls >= option.definition.level ? 110 : 30);
  const strategyScore = scoreStrategy(strategy, option, observation);
  const isDefense = option.position.type === 'defense';
  const isRanged = option.position.type === 'ranged';
  const sameColumnRangedOption = legalOptions.some(
    (candidate) => candidate.instanceId !== option.instanceId
      && candidate.position.column === option.position.column
      && candidate.position.type === 'ranged'
  );
  const sameColumnDefenseOption = legalOptions.some(
    (candidate) => candidate.instanceId !== option.instanceId
      && candidate.position.column === option.position.column
      && candidate.position.type === 'defense'
  );

  let tacticalScore = 0;

  // Hard mode plans the two available placements as a sequence: establish a
  // shield first when a ranged card can follow in the same column.
  if (isDefense && ownDefense.length === 0 && sameColumnRangedOption) {
    tacticalScore += 3_600;
  }

  if (isRanged) {
    if (ownDefense.length > 0) {
      tacticalScore += 2_700 + ownDefense.reduce((total, card) => total + card.definition.defense, 0);
    } else {
      tacticalScore -= opponentPressure > 0 ? 3_800 : 900;
      if (sameColumnDefenseOption) {
        tacticalScore -= 1_500;
      }
    }
  }

  if (isDefense && ownRanged.length > 0) {
    tacticalScore += 2_000 + ownRanged.reduce((total, card) => total + card.definition.attack, 0);
  }

  if (isDefense && opponentPressure > 0) {
    tacticalScore += Math.min(3_000, opponentPressure * 2);
  }

  return strategyScore
    + (directLane ? 1_500 : 0)
    + (ownThreat ? option.definition.defense * 2 : 0)
    + futureValue
    + tacticalScore;
}

function scoreRetirement(option: AiLegalRetirementOption, observation: AiObservation, strategy: AiStrategy): number {
  if (strategy === 'defensive' || strategy === 'low-cost' || strategy === 'random-legal') return Number.NEGATIVE_INFINITY;
  const highCostInHand = observation.ownHand.some((card) => card.definition.level > observation.ownSouls);
  if (observation.round < 4 || observation.round % 4 !== 0 || observation.ownSouls >= 2 || !highCostInHand) return Number.NEGATIVE_INFINITY;
  const lowValue = 1_000 - option.definition.attack - option.definition.defense;
  const strategyBonus = strategy === 'high-cost' ? 1_200 : strategy === 'aggressive' ? 900 : strategy === 'balanced' ? 500 : 250;
  return (option.definition.level === 0 ? 1_000 + lowValue : -option.definition.level * 400) + strategyBonus;
}

function chooseBest<T>(options: readonly T[], score: (option: T) => number, random: RandomSource, noise: number): T | null {
  if (options.length === 0) return null;
  let bestScore = Number.NEGATIVE_INFINITY;
  let best: T[] = [];
  for (const option of options) {
    const value = score(option) + (noise === 0 ? 0 : random.next() * noise);
    if (value > bestScore) {
      bestScore = value;
      best = [option];
    } else if (value === bestScore) {
      best.push(option);
    }
  }
  return best[Math.floor(random.next() * best.length)] ?? best[0] ?? null;
}

export function createAiDecisionAgent(strategy: AiStrategy, difficulty: AiDifficulty): AiDecisionAgent {
  return {
    strategy,
    difficulty,
    chooseRetirement: (observation, options, random) => {
      const candidates = options.filter((option) => scoreRetirement(option, observation, strategy) !== Number.NEGATIVE_INFINITY);
      if (difficulty === 'easy' && (candidates.length === 0 || random.next() < 0.45)) return null;
      return chooseBest(candidates, (option) => scoreRetirement(option, observation, strategy), random, difficulty === 'easy' ? 900 : difficulty === 'normal' ? 120 : 20);
    },
    choosePlacement: (observation, options, random) => {
      if (difficulty === 'easy') {
        return chooseBest(options, (option) => scoreStrategy(strategy, option, observation), random, 2_500);
      }
      if (difficulty === 'hard') {
        return chooseBest(options, (option) => scoreHard(option, observation, strategy, options), random, 20);
      }
      return chooseBest(options, (option) => scoreStrategy(strategy, option, observation), random, 120);
    }
  };
}

export function strategyLabel(strategy: AiStrategy): string {
  return {
    'random-legal': 'Random Legal',
    balanced: 'Balanced',
    aggressive: 'Aggressive',
    defensive: 'Defensive',
    'low-cost': 'Early Pressure',
    'high-cost': 'Late Game',
    'combined-attack': 'Combined Attack'
  }[strategy];
}
