import { canPlaceCard, getBoardPosition, type GameState, type PlayerId } from '@souls/game-core';
import type {
  AiCardView,
  AiLegalPlacementOption,
  AiLegalRetirementOption,
  AiObservation
} from './types.js';

function boardCardsFor(state: GameState): AiCardView[] {
  const cards: AiCardView[] = [];
  for (let row = 0; row < 6; row += 1) {
    for (let column = 0; column < 4; column += 1) {
      const position = getBoardPosition(row, column);
      const instanceId = state.board.occupants[position.key];
      if (instanceId === null) continue;
      const instance = state.cardInstances[instanceId];
      const definition = instance === undefined ? undefined : state.cardDefinitions[instance.cardDefinitionId];
      if (instance === undefined || definition === undefined) continue;
      cards.push({ instanceId, cardDefinitionId: instance.cardDefinitionId, ownerId: instance.ownerId, definition, position });
    }
  }
  return cards;
}

export function createAiObservation(state: GameState, playerId: PlayerId): AiObservation {
  const own = state.players[playerId];
  const opponent = state.players[playerId === 1 ? 2 : 1];
  const ownHand = own.hand.flatMap((instanceId) => {
    const instance = state.cardInstances[instanceId];
    const definition = instance === undefined ? undefined : state.cardDefinitions[instance.cardDefinitionId];
    return instance === undefined || definition === undefined
      ? []
      : [{ instanceId, cardDefinitionId: instance.cardDefinitionId, ownerId: playerId, definition }];
  });

  return {
    playerId,
    activePlayerId: state.turn.activePlayerId,
    round: state.turn.round,
    phase: state.turn.phase,
    board: state.board,
    ownHp: own.hp,
    ownSouls: own.souls,
    opponentHp: opponent.hp,
    opponentSouls: opponent.souls,
    ownHand,
    boardCards: boardCardsFor(state)
  };
}

export function getLegalPlacements(state: GameState, playerId: PlayerId): AiLegalPlacementOption[] {
  const rows = playerId === 1 ? [3, 4, 5] : [0, 1, 2];
  const options: AiLegalPlacementOption[] = [];
  for (const instanceId of state.players[playerId].hand) {
    const instance = state.cardInstances[instanceId];
    const definition = instance === undefined ? undefined : state.cardDefinitions[instance.cardDefinitionId];
    if (instance === undefined || definition === undefined) continue;
    for (const row of rows) {
      for (let column = 0; column < 4; column += 1) {
        const position = getBoardPosition(row, column);
        if (!canPlaceCard(state, { playerId, instanceId, row, column })) continue;
        options.push({ instanceId, cardDefinitionId: definition.id, definition, position });
      }
    }
  }
  return options;
}

export function getLegalRetirements(state: GameState, playerId: PlayerId): AiLegalRetirementOption[] {
  return boardCardsFor(state)
    .filter((card) => card.ownerId === playerId && card.position !== undefined)
    .map((card) => ({
      instanceId: card.instanceId,
      cardDefinitionId: card.cardDefinitionId,
      definition: card.definition,
      position: card.position!
    }));
}
