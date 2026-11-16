import { getBoardPosition, type GameState, type PlayerId } from '@souls/game-core';
import { createAiDecisionAgent, createAiObservation, getLegalPlacements as getAiLegalPlacements, getLegalRetirements as getAiLegalRetirements, strategyLabel as aiStrategyLabel } from '@souls/game-ai';
import type { AgentStrategy, HandPlacementDiagnostic, LabAgent, LabObservation, LegalPlacementOption, LegalRetirementOption } from './types.js';

export function createLabObservation(state: GameState, playerId: PlayerId): LabObservation {
  return createAiObservation(state, playerId);
}

export function getLegalPlacements(state: GameState, playerId: PlayerId): LegalPlacementOption[] {
  return getAiLegalPlacements(state, playerId);
}

export function getLegalRetirements(state: GameState, playerId: PlayerId): LegalRetirementOption[] {
  return getAiLegalRetirements(state, playerId);
}

function compatibleRows(playerId: PlayerId, type: 'melee' | 'ranged'): readonly number[] {
  if (playerId === 1) return type === 'ranged' ? [5] : [3, 4];
  return type === 'ranged' ? [0] : [1, 2];
}

/**
 * A read-only laboratory diagnostic. It deliberately delegates legality to
 * getLegalPlacements/canPlaceCard and only explains why a hand card produced
 * no legal option at the current positioning step.
 */
export function getHandPlacementDiagnostics(state: GameState, playerId: PlayerId): HandPlacementDiagnostic[] {
  const legalInstanceIds = new Set(getLegalPlacements(state, playerId).map((option) => option.instanceId));
  const diagnostics: HandPlacementDiagnostic[] = [];

  for (const instanceId of state.players[playerId].hand) {
    const instance = state.cardInstances[instanceId];
    const definition = instance === undefined ? undefined : state.cardDefinitions[instance.cardDefinitionId];
    if (instance === undefined || definition === undefined || legalInstanceIds.has(instanceId)) continue;

    if (definition.level > state.players[playerId].souls) {
      diagnostics.push({ instanceId, cardDefinitionId: definition.id, level: definition.level, reason: 'insufficient-souls' });
      continue;
    }

    const rows = compatibleRows(playerId, definition.type);
    const compatibleCells = rows.flatMap((row) => Array.from({ length: 4 }, (_, column) => getBoardPosition(row, column)));
    const hasEmptyCompatibleCell = compatibleCells.some((position) => state.board.occupants[position.key] === null);
    if (!hasEmptyCompatibleCell) {
      diagnostics.push({ instanceId, cardDefinitionId: definition.id, level: definition.level, reason: 'no-space' });
      continue;
    }

    const hasUnblockedCell = compatibleCells.some((position) => {
      if (position.type === 'defense') return !state.turn.defensivePlacementMade;
      return !state.turn.offensivePlacementMade;
    });
    diagnostics.push({
      instanceId,
      cardDefinitionId: definition.id,
      level: definition.level,
      reason: hasUnblockedCell ? 'no-space' : 'placement-limit'
    });
  }

  return diagnostics;
}

export function strategyLabel(strategy: AgentStrategy): string {
  return aiStrategyLabel(strategy);
}

export function createAgent(strategy: AgentStrategy): LabAgent {
  return createAiDecisionAgent(strategy, 'normal');
}
