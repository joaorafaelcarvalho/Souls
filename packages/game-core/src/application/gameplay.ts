import { getBoardPosition } from '../domain/board/rules.js';
import type { BoardPositionKey } from '../domain/board/types.js';
import type { CardInstance, CardInstanceId } from '../domain/cards/types.js';
import type { ColumnTarget, CombatCard } from '../domain/combat/types.js';
import type { CombatColumnTrace } from '../domain/combat/trace.js';
import type { GameEvent } from '../domain/events.js';
import type { GameState } from '../domain/game/types.js';
import type { PlayerId, PlayerState } from '../domain/players/types.js';
import type { TurnPhase, TurnState } from '../domain/turns/types.js';
import { resolveColumnAttack } from './combat.js';
import { GameRuleError } from './errors.js';
import type { GameOperationResult } from './operations.js';
import {
  addSouls,
  FAILED_DRAWS_PER_TURN,
  resolveFailedDrawPenalty
} from './resources.js';

function otherPlayer(playerId: PlayerId): PlayerId {
  return playerId === 1 ? 2 : 1;
}

function resetTurn(round: number, firstPlayerId: PlayerId, activePlayerId: PlayerId, phase: TurnPhase): TurnState {
  return {
    round,
    firstPlayerId,
    activePlayerId,
    phase,
    placementsMade: 0,
    defensivePlacementMade: false,
    offensivePlacementMade: false,
    hasStartedPlacement: false,
    hasRetired: false
  };
}

function assertPhase(state: GameState, phase: TurnPhase): void {
  if (state.status !== 'active') {
    throw new GameRuleError('game-finished', 'No actions are accepted after the game has ended.');
  }

  if (state.turn.phase !== phase) {
    throw new GameRuleError('invalid-phase', `This operation requires the ${phase} phase.`);
  }
}

function withPlayer(state: GameState, player: PlayerState): GameState {
  return {
    ...state,
    players: { ...state.players, [player.id]: player }
  };
}

function finishGame(state: GameState, loserId: PlayerId, events: GameEvent[]): GameState {
  const winnerId = otherPlayer(loserId);
  const nextState: GameState = {
    ...state,
    status: 'finished',
    winnerId
  };

  events.push({ type: 'game-ended', winnerId, reason: 'hp-reached-zero' });
  return nextState;
}

function applyDamage(
  state: GameState,
  targetPlayerId: PlayerId,
  amount: number,
  reason: 'combat' | 'failed-draw',
  events: GameEvent[]
): GameState {
  if (amount <= 0) {
    return state;
  }

  const player = state.players[targetPlayerId];
  const hpAfter = Math.max(0, player.hp - amount);
  let nextState = withPlayer(state, { ...player, hp: hpAfter });

  events.push({ type: 'damage-dealt', targetPlayerId, amount, reason });

  if (hpAfter <= 0) {
    nextState = finishGame(nextState, targetPlayerId, events);
  }

  return nextState;
}

function applySoulAwards(
  state: GameState,
  awards: readonly { readonly playerId: PlayerId; readonly amount: number }[],
  events: GameEvent[]
): GameState {
  let nextState = state;

  for (const award of awards) {
    const player = nextState.players[award.playerId];
    const soulsAfter = addSouls(player.souls, award.amount);
    const gained = soulsAfter - player.souls;

    nextState = withPlayer(nextState, { ...player, souls: soulsAfter });

    if (gained > 0) {
      events.push({
        type: 'souls-gained',
        playerId: award.playerId,
        amount: gained,
        reason: 'combat'
      });
    }
  }

  return nextState;
}

function removeCardFromBoard(state: GameState, instanceId: CardInstanceId): GameState {
  const occupants = { ...state.board.occupants };

  for (const [key, occupantId] of Object.entries(occupants)) {
    if (occupantId === instanceId) {
      occupants[key as BoardPositionKey] = null;
    }
  }

  return { ...state, board: { occupants } };
}

function destroyCards(
  state: GameState,
  instanceIds: readonly CardInstanceId[],
  events: GameEvent[]
): GameState {
  let nextState = state;

  for (const instanceId of instanceIds) {
    const instance = nextState.cardInstances[instanceId];

    if (instance === undefined) {
      throw new GameRuleError('card-not-found', `Card instance ${instanceId} does not exist in this game.`);
    }

    const player = nextState.players[instance.ownerId];

    if (player.discard.includes(instanceId)) {
      continue;
    }

    nextState = removeCardFromBoard(nextState, instanceId);
    nextState = withPlayer(nextState, {
      ...player,
      discard: [...player.discard, instanceId]
    });
    events.push({
      type: 'card-destroyed',
      instanceId,
      ownerId: instance.ownerId,
      reason: 'combat'
    });
  }

  return nextState;
}

function cardAt(state: GameState, row: number, column: number): CardInstance | undefined {
  const key = getBoardPosition(row, column).key;
  const instanceId = state.board.occupants[key];

  return instanceId === null ? undefined : state.cardInstances[instanceId];
}

function toCombatCard(state: GameState, card: CardInstance): CombatCard {
  const definition = state.cardDefinitions[card.cardDefinitionId];

  if (definition === undefined) {
    throw new GameRuleError('card-not-found', `Definition ${card.cardDefinitionId} does not exist in this game.`);
  }

  return {
    id: card.instanceId,
    ownerId: card.ownerId,
    category: definition.type,
    attack: definition.attack,
    defense: definition.defense
  };
}

function buildColumnAttack(
  state: GameState,
  playerId: PlayerId,
  column: number
): { readonly attackers: readonly CombatCard[]; readonly targets: readonly ColumnTarget[] } {
  const attackerRows = playerId === 1 ? { melee: 4, ranged: 5 } : { melee: 1, ranged: 0 };
  const targetRows = playerId === 1 ? { defense: 2, melee: 1, ranged: 0 } : { defense: 3, melee: 4, ranged: 5 };
  const attackerCards = [cardAt(state, attackerRows.melee, column), cardAt(state, attackerRows.ranged, column)]
    .filter((card): card is CardInstance => card !== undefined)
    .map((card) => toCombatCard(state, card));
  const targets: ColumnTarget[] = [];

  const defense = cardAt(state, targetRows.defense, column);
  const melee = cardAt(state, targetRows.melee, column);
  const ranged = cardAt(state, targetRows.ranged, column);

  if (defense !== undefined) {
    targets.push({ kind: 'defense', card: toCombatCard(state, defense) });
  }

  if (melee !== undefined) {
    targets.push({ kind: 'offense', card: toCombatCard(state, melee) });
  }

  if (ranged !== undefined) {
    targets.push({ kind: 'offense', card: toCombatCard(state, ranged) });
  }

  return { attackers: attackerCards, targets };
}

function applyColumnResult(
  state: GameState,
  result: ReturnType<typeof resolveColumnAttack>,
  events: GameEvent[]
): GameState {
  let nextState = destroyCards(state, result.destroyedCardIds, events);
  nextState = applySoulAwards(nextState, result.soulAwards, events);

  if (nextState.status === 'active' && result.hpDamageTarget !== undefined) {
    nextState = applyDamage(nextState, result.hpDamageTarget, result.hpDamage, 'combat', events);
  }

  return nextState;
}

function nextTurnAfterCompletedTurn(state: GameState): GameState {
  const { round, firstPlayerId, activePlayerId } = state.turn;
  const nextPlayerId = activePlayerId === firstPlayerId ? otherPlayer(activePlayerId) : firstPlayerId;
  const nextRound = activePlayerId === firstPlayerId ? round : round + 1;

  return {
    ...state,
    turn: resetTurn(nextRound, firstPlayerId, nextPlayerId, 'draw')
  };
}

function turnStartedEvent(state: GameState): GameEvent {
  return {
    type: 'turn-started',
    round: state.turn.round,
    playerId: state.turn.activePlayerId,
    phase: state.turn.phase
  };
}

export function finishPositioningPhase(state: GameState): GameOperationResult {
  assertPhase(state, state.turn.phase === 'first-round-positioning' ? 'first-round-positioning' : 'positioning');

  if (state.turn.phase === 'positioning') {
    return {
      state: {
        ...state,
        turn: { ...state.turn, phase: 'attack' }
      },
      events: []
    };
  }

  const { round, firstPlayerId, activePlayerId } = state.turn;

  if (activePlayerId === firstPlayerId) {
    const nextState = {
      ...state,
      turn: resetTurn(round, firstPlayerId, otherPlayer(activePlayerId), 'first-round-positioning')
    };

    return { state: nextState, events: [turnStartedEvent(nextState)] };
  }

  const nextState = {
    ...state,
    turn: resetTurn(round + 1, firstPlayerId, firstPlayerId, 'draw')
  };

  return { state: nextState, events: [turnStartedEvent(nextState)] };
}

export function resolveDrawPhase(state: GameState): GameOperationResult {
  assertPhase(state, 'draw');

  let nextState = state;
  const events: GameEvent[] = [];
  const playerId = state.turn.activePlayerId;

  for (let attempt = 1; attempt <= FAILED_DRAWS_PER_TURN; attempt += 1) {
    if (nextState.status !== 'active') {
      break;
    }

    const player = nextState.players[playerId];
    const instanceId = player.deck[0];

    if (instanceId !== undefined) {
      nextState = withPlayer(nextState, {
        ...player,
        deck: player.deck.slice(1),
        hand: [...player.hand, instanceId]
      });
      events.push({ type: 'card-drawn', instanceId, playerId, attempt: attempt as 1 | 2 });
      continue;
    }

    const penalty = resolveFailedDrawPenalty(player.souls);
    nextState = withPlayer(nextState, {
      ...player,
      souls: penalty.soulsAfter
    });

    events.push({
      type: 'draw-failed',
      playerId,
      attempt: attempt as 1 | 2,
      penalty: penalty.consumedSoul ? 'soul' : 'hp'
    });

    if (penalty.consumedSoul) {
      events.push({
        type: 'souls-spent',
        playerId,
        amount: 1,
        reason: 'failed-draw'
      });
    } else {
      nextState = applyDamage(nextState, playerId, penalty.hpDamage, 'failed-draw', events);
    }
  }

  if (nextState.status === 'active') {
    nextState = {
      ...nextState,
      turn: { ...nextState.turn, phase: 'positioning' }
    };
  }

  return { state: nextState, events };
}

export function resolveAttackPhase(state: GameState): GameOperationResult {
  assertPhase(state, 'attack');

  let nextState = state;
  const events: GameEvent[] = [];
  const columns: CombatColumnTrace[] = [];
  const activePlayerId = state.turn.activePlayerId;
  const defenderPlayerId = otherPlayer(activePlayerId);

  for (let column = 0; column < 4; column += 1) {
    if (nextState.status !== 'active') {
      break;
    }

    const columnAttack = buildColumnAttack(nextState, activePlayerId, column);

    if (columnAttack.attackers.length === 0) {
      continue;
    }

    const eventStart = events.length;
    const result = resolveColumnAttack({
      attackingCards: columnAttack.attackers,
      defenderPlayerId,
      targets: columnAttack.targets
    });

    nextState = applyColumnResult(nextState, result, events);
    columns.push({
      column,
      attackerIds: columnAttack.attackers.map((attacker) => attacker.id),
      targetIds: result.exchanges
        .map((exchange) => exchange.targetId)
        .filter((targetId): targetId is CardInstanceId => targetId !== undefined),
      result,
      events: events.slice(eventStart)
    });
  }

  const trailingEventStart = events.length;

  if (nextState.status === 'active') {
    nextState = nextTurnAfterCompletedTurn(nextState);
    events.push(turnStartedEvent(nextState));
  }

  return {
    state: nextState,
    events,
    combatTrace: {
      columns,
      trailingEvents: events.slice(trailingEventStart)
    }
  };
}
