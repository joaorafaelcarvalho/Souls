import {
  canPlaceCard,
  createEmptyBoard,
  getBoardPosition,
  initializeGame,
  placeCard,
  type CardDefinition,
  type CardDefinitionId,
  type GameState
} from '@souls/game-core';
import { OFFICIAL_DECK_LEVEL_DISTRIBUTION } from '@souls/game-content';
import { createDeterministicUuidGenerator, createSeededRandom } from './random.js';
import type { InvocationCoverageReport, InvocationCoverageScenario, LevelCounter } from './types.js';

function levelCounter(): LevelCounter {
  return { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
}

function legalDeck(definitions: readonly CardDefinition[], preferred?: CardDefinition): string[] {
  const deck: string[] = [];
  for (const level of [0, 1, 2, 3, 4] as const) {
    const fallback = definitions.find((candidate) => candidate.level === level);
    if (fallback === undefined) continue;
    const quantity = OFFICIAL_DECK_LEVEL_DISTRIBUTION[level];
    for (let index = 0; index < quantity; index += 1) {
      deck.push(preferred?.level === level && index === 0 ? preferred.id : fallback.id);
    }
  }
  return deck;
}

function controlledState(definitions: readonly CardDefinition[], definition: CardDefinition, souls: number): GameState {
  const deck = legalDeck(definitions, definition);
  const opponentDeck = legalDeck(definitions);
  const initial = initializeGame({
    cardDefinitions: definitions,
    players: [
      { id: 1, deck },
      { id: 2, deck: opponentDeck }
    ],
    random: createSeededRandom(10_000 + definition.level),
    uuidGenerator: createDeterministicUuidGenerator()
  });
  const instanceId = Object.values(initial.cardInstances).find(
    (instance) => instance.ownerId === 1 && instance.cardDefinitionId === definition.id
  )?.instanceId;
  if (instanceId === undefined) throw new Error(`Não foi possível criar uma instância de ${definition.name}.`);

  return {
    ...initial,
    board: createEmptyBoard(),
    players: {
      ...initial.players,
      1: {
        ...initial.players[1],
        souls,
        hand: [instanceId],
        deck: initial.players[1].deck.filter((id) => id !== instanceId)
      }
    },
    turn: {
      ...initial.turn,
      firstPlayerId: 1,
      activePlayerId: 1,
      phase: 'first-round-positioning',
      placementsMade: 0,
      defensivePlacementMade: false,
      offensivePlacementMade: false,
      hasStartedPlacement: false,
      hasRetired: false
    }
  };
}

function invocationPosition(definition: CardDefinition): { readonly row: number; readonly column: number } {
  return definition.type === 'ranged' ? getBoardPosition(5, 0) : getBoardPosition(4, 0);
}

function tryInvocation(definitions: readonly CardDefinition[], definition: CardDefinition, souls: number): InvocationCoverageScenario {
  const state = controlledState(definitions, definition, souls);
  const instanceId = state.players[1].hand[0];
  if (instanceId === undefined) throw new Error('O cenário de invocação não recebeu uma carta na mão.');
  const position = invocationPosition(definition);
  const legal = canPlaceCard(state, {
    playerId: 1,
    instanceId,
    row: position.row,
    column: position.column
  });
  if (!legal) {
    return {
      level: definition.level,
      cardDefinitionId: definition.id,
      cardName: definition.name,
      type: definition.type,
      soulsBefore: souls,
      legal: false,
      invoked: false,
      reason: 'insufficient-souls'
    };
  }

  const result = placeCard(state, {
    playerId: 1,
    instanceId,
    row: position.row,
    column: position.column
  });
  return {
    level: definition.level,
    cardDefinitionId: definition.id,
    cardName: definition.name,
    type: definition.type,
    soulsBefore: souls,
    legal: true,
    invoked: result.events.some((event) => event.type === 'card-invoked'),
    reason: 'invoked'
  };
}

export function runInvocationCoverage(cardDefinitions: Readonly<Record<CardDefinitionId, CardDefinition>>): InvocationCoverageReport {
  const definitions = Object.values(cardDefinitions);
  const scenarios: InvocationCoverageScenario[] = [];
  const invocationsByLevel = levelCounter();
  const warnings: string[] = [];

  for (const level of [0, 1, 2, 3, 4] as const) {
    const definition = definitions.find((candidate) => candidate.level === level);
    if (definition === undefined) {
      warnings.push(`Não existe nenhuma carta de nível ${level} no catálogo para o teste de invocação.`);
      continue;
    }
    const success = tryInvocation(definitions, definition, level);
    scenarios.push(success);
    if (success.invoked) invocationsByLevel[level] += 1;
    if (!success.invoked) warnings.push(`A invocação determinística de nível ${level} não foi legal.`);

    if (level > 0) {
      const insufficient = tryInvocation(definitions, definition, level - 1);
      scenarios.push(insufficient);
      if (insufficient.legal || insufficient.invoked) {
        warnings.push(`O teste de custo insuficiente do nível ${level} foi aceite pelo motor.`);
      }
    }
  }

  return {
    scenarios,
    invocationsByLevel,
    allLevelsCovered: ([0, 1, 2, 3, 4] as const).every((level) => invocationsByLevel[level] > 0),
    warnings
  };
}
