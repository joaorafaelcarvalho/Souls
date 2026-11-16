import { describe, expect, it } from 'vitest';
import {
  finishPositioningPhase,
  getBoardPosition,
  initializeGame,
  resolveAttackPhase,
  resolveDrawPhase,
  type CardDefinition,
  type GameState,
  type RandomSource
} from '../src/index.js';

class FixedRandom implements RandomSource {
  public next(): number {
    return 0;
  }
}

function definitionId(prefix: number, index: number): string {
  return `${prefix.toString(16).padStart(8, '0')}-0000-4000-8000-${index.toString().padStart(12, '0')}`;
}

function deck(
  prefix: number,
  type: 'melee' | 'ranged',
  attack: number,
  defense: number
): CardDefinition[] {
  return Array.from({ length: 20 }, (_, index) => ({
    id: definitionId(prefix, index + 1),
    name: `${prefix}-fixture-${index + 1}`,
    level: 0 as const,
    type,
    attack,
    defense,
    image: `/images/cards/${type}/example.svg`
  }));
}

function createGame(p1Attack = 700, p2Defense = 300, p2Attack = 300): GameState {
  const playerOneDefinitions = deck(1, 'melee', p1Attack, 100);
  const playerTwoDefinitions = deck(2, 'melee', p2Attack, p2Defense);

  return initializeGame({
    cardDefinitions: [...playerOneDefinitions, ...playerTwoDefinitions],
    players: [
      { id: 1, deck: playerOneDefinitions.map((definition) => definition.id) },
      { id: 2, deck: playerTwoDefinitions.map((definition) => definition.id) }
    ],
    random: new FixedRandom()
  });
}

function reachRoundTwoDraw(state: GameState): GameState {
  const afterFirstPlayer = finishPositioningPhase(state);
  const afterSecondPlayer = finishPositioningPhase(afterFirstPlayer.state);

  return afterSecondPlayer.state;
}

function cardFromHand(state: GameState, playerId: 1 | 2, index = 0): string {
  const instanceId = state.players[playerId].hand[index];

  if (instanceId === undefined) {
    throw new Error('The fixture hand is incomplete.');
  }

  return instanceId;
}

function putCardOnBoard(state: GameState, playerId: 1 | 2, instanceId: string, row: number, column: number): GameState {
  const position = getBoardPosition(row, column);
  const player = state.players[playerId];

  return {
    ...state,
    players: {
      ...state.players,
      [playerId]: {
        ...player,
        hand: player.hand.filter((id) => id !== instanceId)
      }
    },
    board: {
      occupants: {
        ...state.board.occupants,
        [position.key]: instanceId
      }
    }
  };
}

function setAttackPhase(state: GameState): GameState {
  return {
    ...state,
    turn: { ...state.turn, phase: 'attack' }
  };
}

describe('turn progression and stateful game operations', () => {
  it('keeps the first round positioning-only and starts round two with the first player', () => {
    const initial = createGame();
    const afterFirstPlayer = finishPositioningPhase(initial);
    const afterFirstRound = finishPositioningPhase(afterFirstPlayer.state);

    expect(afterFirstPlayer.state.turn.round).toBe(1);
    expect(afterFirstPlayer.state.turn.activePlayerId).toBe(2);
    expect(afterFirstPlayer.state.turn.phase).toBe('first-round-positioning');
    expect(afterFirstRound.state.turn.round).toBe(2);
    expect(afterFirstRound.state.turn.activePlayerId).toBe(1);
    expect(afterFirstRound.state.turn.phase).toBe('draw');
    expect(afterFirstRound.events).toEqual([
      { type: 'turn-started', round: 2, playerId: 1, phase: 'draw' }
    ]);
  });

  it('performs two individual draws and then opens positioning', () => {
    const roundTwo = reachRoundTwoDraw(createGame());
    const result = resolveDrawPhase(roundTwo);

    expect(result.state.turn.phase).toBe('positioning');
    expect(result.state.players[1].hand).toHaveLength(7);
    expect(result.state.players[1].deck).toHaveLength(13);
    expect(result.events.filter((event) => event.type === 'card-drawn')).toHaveLength(2);
  });

  it('consumes a soul for one failed draw and applies HP damage to the next failed draw', () => {
    const roundTwo = reachRoundTwoDraw(createGame());
    const player = roundTwo.players[1];
    const emptyDeckState: GameState = {
      ...roundTwo,
      players: {
        ...roundTwo.players,
        1: { ...player, deck: [], souls: 1 }
      }
    };

    const result = resolveDrawPhase(emptyDeckState);

    expect(result.state.status).toBe('active');
    expect(result.state.turn.phase).toBe('positioning');
    expect(result.state.players[1].souls).toBe(0);
    expect(result.state.players[1].hp).toBe(9_500);
    expect(result.events.filter((event) => event.type === 'draw-failed')).toHaveLength(2);
    expect(result.events.filter((event) => event.type === 'souls-spent')).toHaveLength(1);
    expect(result.events.filter((event) => event.type === 'damage-dealt')).toHaveLength(1);
  });

  it('ends the game when the failed-draw penalties reach zero HP', () => {
    const roundTwo = reachRoundTwoDraw(createGame());
    const player = roundTwo.players[1];
    const emptyDeckState: GameState = {
      ...roundTwo,
      players: {
        ...roundTwo.players,
        1: { ...player, deck: [], hp: 1_000, souls: 0 }
      }
    };

    const result = resolveDrawPhase(emptyDeckState);

    expect(result.state.status).toBe('finished');
    expect(result.state.winnerId).toBe(2);
    expect(result.state.players[1].hp).toBe(0);
    expect(result.events.filter((event) => event.type === 'draw-failed')).toHaveLength(2);
    expect(result.events.filter((event) => event.type === 'game-ended')).toHaveLength(1);
  });

  it('moves a normal positioning phase to attack without changing the player', () => {
    const positioning = resolveDrawPhase(reachRoundTwoDraw(createGame()));
    const result = finishPositioningPhase(positioning.state);

    expect(result.state.turn.phase).toBe('attack');
    expect(result.state.turn.activePlayerId).toBe(1);
    expect(result.state.players[1].hand).toHaveLength(7);
  });

  it('applies a destroyed defense, remaining direct damage, discard and souls', () => {
    const positioning = resolveDrawPhase(reachRoundTwoDraw(createGame()));
    const attackerId = cardFromHand(positioning.state, 1);
    const defenderId = cardFromHand(positioning.state, 2);
    const attackState = setAttackPhase(
      putCardOnBoard(
        putCardOnBoard(positioning.state, 1, attackerId, 4, 0),
        2,
        defenderId,
        2,
        0
      )
    );

    const result = resolveAttackPhase(attackState);

    expect(result.state.status).toBe('active');
    expect(result.state.players[2].hp).toBe(9_600);
    expect(result.state.players[2].souls).toBe(1);
    expect(result.state.players[2].discard).toEqual([defenderId]);
    expect(result.state.board.occupants['2,0']).toBeNull();
    expect(result.state.board.occupants['4,0']).toBe(attackerId);
    expect(result.state.turn.activePlayerId).toBe(2);
    expect(result.state.turn.phase).toBe('draw');
    expect(result.events.map((event) => event.type)).toContain('card-destroyed');
    expect(result.events.map((event) => event.type)).toContain('souls-gained');
    expect(result.combatTrace?.columns.map((column) => column.column)).toEqual([0]);
    expect(result.combatTrace?.columns[0]?.attackerIds).toEqual([attackerId]);
    expect(result.combatTrace?.columns[0]?.result.exchanges[0]?.outcome).toBe('destroyed');
    expect(result.combatTrace?.trailingEvents).toEqual([
      { type: 'turn-started', round: 2, playerId: 2, phase: 'draw' }
    ]);
  });

  it('blocks an attack when a defense is stronger without HP or Soul penalties', () => {
    const positioning = resolveDrawPhase(reachRoundTwoDraw(createGame(100, 300)));
    const attackerId = cardFromHand(positioning.state, 1);
    const defenderId = cardFromHand(positioning.state, 2);
    const attackState = setAttackPhase(
      putCardOnBoard(
        putCardOnBoard(positioning.state, 1, attackerId, 4, 0),
        2,
        defenderId,
        2,
        0
      )
    );

    const result = resolveAttackPhase(attackState);

    expect(result.state.players[1].hp).toBe(10_000);
    expect(result.state.players[2].hp).toBe(10_000);
    expect(result.state.players[1].souls).toBe(0);
    expect(result.state.players[2].discard).toEqual([]);
    expect(result.state.board.occupants['2,0']).toBe(defenderId);
    expect(result.events.some((event) => event.type === 'damage-dealt')).toBe(false);
    expect(result.events.some((event) => event.type === 'souls-spent')).toBe(false);
  });

  it('resolves columns from zero and stops pending attacks after victory', () => {
    const positioning = resolveDrawPhase(reachRoundTwoDraw(createGame())).state;
    const firstAttackerId = cardFromHand(positioning, 1);
    const secondAttackerId = cardFromHand(positioning, 1, 1);
    const firstColumn = putCardOnBoard(positioning, 1, firstAttackerId, 4, 0);
    const twoColumns = putCardOnBoard(firstColumn, 1, secondAttackerId, 4, 1);
    const attackState: GameState = {
      ...twoColumns,
      players: {
        ...twoColumns.players,
        2: { ...twoColumns.players[2], hp: 300 }
      },
      turn: { ...twoColumns.turn, phase: 'attack' }
    };

    const result = resolveAttackPhase(attackState);

    expect(result.state.status).toBe('finished');
    expect(result.state.winnerId).toBe(1);
    expect(result.events.filter((event) => event.type === 'damage-dealt')).toHaveLength(1);
    expect(result.state.board.occupants['4,1']).toBe(secondAttackerId);
  });

  it('ends immediately when attack damage reaches zero HP', () => {
    const positioning = resolveDrawPhase(reachRoundTwoDraw(createGame()));
    const attackerId = cardFromHand(positioning.state, 1);
    const lowHpState: GameState = {
      ...positioning.state,
      board: {
        occupants: {
          ...positioning.state.board.occupants,
          [getBoardPosition(4, 0).key]: attackerId
        }
      },
      players: {
        ...positioning.state.players,
        1: {
          ...positioning.state.players[1],
          hand: positioning.state.players[1].hand.filter((id) => id !== attackerId)
        },
        2: { ...positioning.state.players[2], hp: 300 }
      },
      turn: { ...positioning.state.turn, phase: 'attack' }
    };

    const result = resolveAttackPhase(lowHpState);

    expect(result.state.status).toBe('finished');
    expect(result.state.winnerId).toBe(1);
    expect(result.state.players[2].hp).toBe(0);
    expect(result.events.map((event) => event.type)).toContain('game-ended');
    expect(result.events.filter((event) => event.type === 'turn-started')).toHaveLength(0);
  });
});
