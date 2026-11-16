import { getBoardPosition } from '../domain/board/rules.js';
import type { BoardPosition } from '../domain/board/types.js';
import type { CardInstance, CardInstanceId } from '../domain/cards/types.js';
import type { GameState } from '../domain/game/types.js';
import type { PlayerId } from '../domain/players/types.js';
import type { GameOperationResult } from './operations.js';
import { GameRuleError } from './errors.js';
import { addSouls, spendSouls, summonCost } from './resources.js';

export interface PlaceCardCommand {
  readonly playerId: PlayerId;
  readonly instanceId: CardInstanceId;
  readonly row: number;
  readonly column: number;
}

interface ValidatedPlacement {
  readonly card: CardInstance;
  readonly position: BoardPosition;
  readonly definition: GameState['cardDefinitions'][string];
  readonly player: GameState['players'][PlayerId];
}

function getCardForState(state: GameState, instanceId: CardInstanceId): CardInstance {
  const card = state.cardInstances[instanceId];

  if (card === undefined) {
    throw new GameRuleError('card-not-found', `Card instance ${instanceId} does not exist in this game.`);
  }

  return card;
}

function assertPositionCanReceiveCard(card: CardInstance, position: BoardPosition, state: GameState): ValidatedPlacement['definition'] {
  if (position.ownerId !== card.ownerId) {
    throw new GameRuleError('position-not-owned', 'A card can only be placed on its owner side of the board.');
  }

  const definition = state.cardDefinitions[card.cardDefinitionId];

  if (definition === undefined) {
    throw new GameRuleError('card-not-found', `Definition ${card.cardDefinitionId} does not exist in this game.`);
  }

  if (position.type === 'defense' && definition.type !== 'melee') {
    throw new GameRuleError('invalid-card-category', 'Only melee cards can occupy defense positions.');
  }

  if (position.type === 'melee' && definition.type !== 'melee') {
    throw new GameRuleError('invalid-card-category', 'Only melee cards can occupy melee positions.');
  }

  if (position.type === 'ranged' && definition.type !== 'ranged') {
    throw new GameRuleError('invalid-card-category', 'Only ranged cards can occupy ranged positions.');
  }

  return definition;
}

function assertPlacementPhase(state: GameState, playerId: PlayerId): void {
  if (state.status !== 'active') {
    throw new GameRuleError('game-finished', 'No actions are accepted after the game has ended.');
  }

  if (!['first-round-positioning', 'positioning'].includes(state.turn.phase)) {
    throw new GameRuleError('invalid-phase', 'Cards can only be placed during a positioning phase.');
  }

  if (state.turn.activePlayerId !== playerId) {
    throw new GameRuleError('wrong-active-player', 'Only the active player can place a card.');
  }
}

function assertPlacementCommand(state: GameState, command: PlaceCardCommand): ValidatedPlacement {
  assertPlacementPhase(state, command.playerId);

  const card = getCardForState(state, command.instanceId);
  const player = state.players[command.playerId];

  if (!player.hand.includes(card.instanceId)) {
    throw new GameRuleError('card-not-in-hand', 'The selected card is not in the active player hand.');
  }

  const position = getBoardPosition(command.row, command.column);

  if (state.board.occupants[position.key] !== null) {
    throw new GameRuleError('position-occupied', 'Cards can only be placed on empty positions.');
  }

  const definition = assertPositionCanReceiveCard(card, position, state);
  const soulsAfterPayment = spendSouls(player.souls, summonCost(definition.level));

  if (soulsAfterPayment === null) {
    throw new GameRuleError('insufficient-souls', 'The player cannot pay the card invocation cost.');
  }

  if (
    (position.type === 'defense' && state.turn.defensivePlacementMade) ||
    (position.type !== 'defense' && state.turn.offensivePlacementMade)
  ) {
    throw new GameRuleError('placement-limit-reached', 'This player has already used this placement type this turn.');
  }

  if (state.turn.placementsMade >= 2) {
    throw new GameRuleError('placement-limit-reached', 'This player has no positioning actions remaining this turn.');
  }

  return { card, position, definition, player };
}

export function canPlaceCard(state: GameState, command: PlaceCardCommand): boolean {
  try {
    assertPlacementCommand(state, command);
    return true;
  } catch (error) {
    if (error instanceof GameRuleError) {
      return false;
    }

    throw error;
  }
}

export function placeCard(state: GameState, command: PlaceCardCommand): GameOperationResult {
  const { card, position, definition, player } = assertPlacementCommand(state, command);
  const soulsAfterPayment = spendSouls(player.souls, summonCost(definition.level));

  if (soulsAfterPayment === null) {
    throw new GameRuleError('insufficient-souls', 'The player cannot pay the card invocation cost.');
  }

  const nextPlayer = {
    ...player,
    souls: soulsAfterPayment,
    hand: player.hand.filter((handInstanceId) => handInstanceId !== card.instanceId)
  };
  const nextTurn = {
    ...state.turn,
    placementsMade: state.turn.placementsMade + 1,
    defensivePlacementMade: state.turn.defensivePlacementMade || position.type === 'defense',
    offensivePlacementMade: state.turn.offensivePlacementMade || position.type !== 'defense',
    hasStartedPlacement: true
  };
  const events = [];

  if (definition.level > 0) {
    events.push({
      type: 'souls-spent' as const,
      playerId: command.playerId,
      amount: definition.level,
      reason: 'invocation' as const
    });
  }

  events.push({
    type: 'card-invoked' as const,
    instanceId: card.instanceId,
    playerId: command.playerId,
    position: position.key
  });

  return {
    state: {
      ...state,
      players: { ...state.players, [command.playerId]: nextPlayer },
      board: {
        occupants: { ...state.board.occupants, [position.key]: card.instanceId }
      },
      turn: nextTurn
    },
    events
  };
}

export interface RetireCardCommand {
  readonly playerId: PlayerId;
  readonly instanceId: CardInstanceId;
}

export function retireCard(state: GameState, command: RetireCardCommand): GameOperationResult {
  assertPlacementPhase(state, command.playerId);

  if (state.turn.hasRetired || state.turn.hasStartedPlacement || state.turn.placementsMade > 0) {
    throw new GameRuleError('retirement-not-allowed', 'A voluntary retirement must happen before any placement and only once.');
  }

  const card = getCardForState(state, command.instanceId);

  if (card.ownerId !== command.playerId) {
    throw new GameRuleError('wrong-active-player', 'A player can only retire one of their own cards.');
  }

  const positionEntry = Object.entries(state.board.occupants).find(([, occupantId]) => occupantId === card.instanceId);

  if (positionEntry === undefined) {
    throw new GameRuleError('card-not-on-board', 'Only a card currently on the board can be retired.');
  }

  const [positionKey] = positionEntry;
  const player = state.players[command.playerId];
  const soulsAfter = addSouls(player.souls, 1);
  const soulGained = soulsAfter - player.souls;

  return {
    state: {
      ...state,
      players: {
        ...state.players,
        [command.playerId]: {
          ...player,
          souls: soulsAfter,
          discard: [...player.discard, card.instanceId]
        }
      },
      board: {
        occupants: { ...state.board.occupants, [positionKey]: null }
      },
      turn: {
        ...state.turn,
        placementsMade: state.turn.placementsMade + 1,
        hasRetired: true,
        hasStartedPlacement: true
      }
    },
    events: [
      { type: 'card-retired', instanceId: card.instanceId, playerId: command.playerId, reason: 'voluntary' },
      ...(soulGained > 0
        ? [{ type: 'souls-gained' as const, playerId: command.playerId, amount: soulGained, reason: 'retirement' as const }]
        : [])
    ]
  };
}
