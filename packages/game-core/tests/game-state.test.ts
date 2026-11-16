import { describe, expect, it } from 'vitest';
import {
  canPlaceCard,
  GameRuleError,
  initializeGame,
  placeCard,
  retireCard,
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
  type: 'melee' | 'ranged',
  prefix: number,
  level: 0 | 1 | 2 | 3 | 4 = 0
): CardDefinition[] {
  return Array.from({ length: 20 }, (_, index) => ({
    id: definitionId(prefix, index + 1),
    name: `${type} example ${index + 1}`,
    level,
    type,
    attack: 100,
    defense: 100,
    image: `/images/cards/${type}/example.svg`
  }));
}

function createState(
  playerOneDefinitions = deck('melee', 1),
  playerTwoDefinitions = deck('ranged', 2)
) {
  return initializeGame({
    cardDefinitions: [...playerOneDefinitions, ...playerTwoDefinitions],
    players: [
      { id: 1, deck: playerOneDefinitions.map((definition) => definition.id) },
      { id: 2, deck: playerTwoDefinitions.map((definition) => definition.id) }
    ],
    random: new FixedRandom()
  });
}

describe('initial state and placement operations', () => {
  it('deals five cards, keeps fifteen in each deck, and starts positioning', () => {
    const state = createState();

    expect(state.turn.firstPlayerId).toBe(1);
    expect(state.turn.phase).toBe('first-round-positioning');
    expect(state.players[1].hand).toHaveLength(5);
    expect(state.players[1].deck).toHaveLength(15);
    expect(state.players[2].hand).toHaveLength(5);
    expect(state.players[2].deck).toHaveLength(15);
    expect(state.players[1].hp).toBe(10_000);
    expect(state.players[1].souls).toBe(0);
    expect(state.cardInstances[state.players[1].hand[0] ?? '']?.instanceId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  });

  it('creates a different UUID for every copy of a repeated definition', () => {
    const definition = deck('melee', 3)[0];

    if (definition === undefined) {
      throw new Error('The definition fixture is incomplete.');
    }

    const repeatedDeck = Array.from({ length: 20 }, () => definition.id);
    const state = initializeGame({
      cardDefinitions: [definition],
      players: [
        { id: 1, deck: repeatedDeck },
        { id: 2, deck: repeatedDeck }
      ],
      random: new FixedRandom()
    });
    const instances = Object.values(state.cardInstances);

    expect(new Set(instances.map((instance) => instance.instanceId)).size).toBe(40);
    expect(instances.every((instance) => instance.cardDefinitionId === definition.id)).toBe(true);
  });

  it('allows melee in defense/melee zones and rejects ranged outside ranged zones', () => {
    const meleeState = createState();
    const meleeInstanceId = meleeState.players[1].hand[0];

    if (meleeInstanceId === undefined) {
      throw new Error('The melee hand fixture is incomplete.');
    }

    expect(canPlaceCard(meleeState, { playerId: 1, instanceId: meleeInstanceId, row: 3, column: 0 })).toBe(true);
    expect(canPlaceCard(meleeState, { playerId: 1, instanceId: meleeInstanceId, row: 4, column: 0 })).toBe(true);

    const rangedState = createState(deck('ranged', 3), deck('melee', 4));
    const rangedInstanceId = rangedState.players[1].hand[0];

    if (rangedInstanceId === undefined) {
      throw new Error('The ranged hand fixture is incomplete.');
    }

    expect(canPlaceCard(rangedState, { playerId: 1, instanceId: rangedInstanceId, row: 3, column: 0 })).toBe(false);
    expect(canPlaceCard(rangedState, { playerId: 1, instanceId: rangedInstanceId, row: 4, column: 0 })).toBe(false);
    expect(canPlaceCard(rangedState, { playerId: 1, instanceId: rangedInstanceId, row: 5, column: 0 })).toBe(true);
    expect(() => placeCard(rangedState, { playerId: 1, instanceId: rangedInstanceId, row: 3, column: 0 })).toThrowError(
      expect.objectContaining({ code: 'invalid-card-category' })
    );
  });

  it('places one defense and one offense immutably and emits invocation events', () => {
    const state = createState();
    const firstInstanceId = state.players[1].hand[0];
    const secondInstanceId = state.players[1].hand[1];

    if (firstInstanceId === undefined || secondInstanceId === undefined) {
      throw new Error('The initial hand fixture is incomplete.');
    }

    const afterDefense = placeCard(state, {
      playerId: 1,
      instanceId: firstInstanceId,
      row: 3,
      column: 0
    });
    const afterOffense = placeCard(afterDefense.state, {
      playerId: 1,
      instanceId: secondInstanceId,
      row: 4,
      column: 0
    });

    expect(state.board.occupants['3,0']).toBeNull();
    expect(afterOffense.state.board.occupants['3,0']).toBe(firstInstanceId);
    expect(afterOffense.state.board.occupants['4,0']).toBe(secondInstanceId);
    expect(afterOffense.state.players[1].souls).toBe(0);
    expect(afterOffense.state.players[1].hand).not.toContain(firstInstanceId);
    expect(afterOffense.state.players[1].hand).not.toContain(secondInstanceId);
    expect(afterOffense.events[0]?.type).toBe('card-invoked');
  });

  it('rejects a third placement of the same type during the turn', () => {
    const state = createState();
    const firstInstanceId = state.players[1].hand[0];
    const secondInstanceId = state.players[1].hand[1];
    const thirdInstanceId = state.players[1].hand[2];

    if (firstInstanceId === undefined || secondInstanceId === undefined || thirdInstanceId === undefined) {
      throw new Error('The initial hand fixture is incomplete.');
    }

    const afterFirst = placeCard(state, { playerId: 1, instanceId: firstInstanceId, row: 3, column: 0 });
    const afterSecond = placeCard(afterFirst.state, { playerId: 1, instanceId: secondInstanceId, row: 4, column: 0 });

    expect(() => placeCard(afterSecond.state, { playerId: 1, instanceId: thirdInstanceId, row: 4, column: 1 })).toThrowError(
      expect.objectContaining({ code: 'placement-limit-reached' })
    );
  });

  it('retires a board card as one action and grants a Soul', () => {
    const initial = createState();
    const instanceId = initial.players[1].hand[0];

    if (instanceId === undefined) {
      throw new Error('The initial hand fixture is incomplete.');
    }

    const placed = placeCard(initial, { playerId: 1, instanceId, row: 3, column: 0 });
    const nextTurn = {
      ...placed.state.turn,
      placementsMade: 0,
      defensivePlacementMade: false,
      offensivePlacementMade: false,
      hasStartedPlacement: false,
      hasRetired: false
    };
    const readyToRetire = { ...placed.state, turn: nextTurn };
    const retired = retireCard(readyToRetire, { playerId: 1, instanceId });

    expect(retired.state.board.occupants['3,0']).toBeNull();
    expect(retired.state.players[1].discard).toEqual([instanceId]);
    expect(retired.state.players[1].souls).toBe(1);
    expect(retired.state.turn.placementsMade).toBe(1);
    expect(retired.state.turn.hasStartedPlacement).toBe(true);
    expect(retired.events[0]?.type).toBe('card-retired');
    expect(retired.events[1]).toEqual({
      type: 'souls-gained',
      playerId: 1,
      amount: 1,
      reason: 'retirement'
    });
  });

  it('allows only one placement after a retirement and keeps the Soul cap', () => {
    const initial = createState();
    const boardCard = initial.players[1].hand[0];
    const firstReplacement = initial.players[1].hand[1];
    const secondReplacement = initial.players[1].hand[2];

    if (boardCard === undefined || firstReplacement === undefined || secondReplacement === undefined) {
      throw new Error('The initial hand fixture is incomplete.');
    }

    const placed = placeCard(initial, { playerId: 1, instanceId: boardCard, row: 3, column: 0 });
    const ready = {
      ...placed.state,
      players: { ...placed.state.players, 1: { ...placed.state.players[1], souls: 5 } },
      turn: {
        ...placed.state.turn,
        placementsMade: 0,
        defensivePlacementMade: false,
        offensivePlacementMade: false,
        hasStartedPlacement: false,
        hasRetired: false
      }
    };
    const retired = retireCard(ready, { playerId: 1, instanceId: boardCard });
    const placedAfterRetirement = placeCard(retired.state, { playerId: 1, instanceId: firstReplacement, row: 4, column: 0 });

    expect(retired.state.players[1].souls).toBe(5);
    expect(retired.events.some((event) => event.type === 'souls-gained')).toBe(false);
    expect(placedAfterRetirement.state.turn.placementsMade).toBe(2);
    expect(() => placeCard(placedAfterRetirement.state, { playerId: 1, instanceId: secondReplacement, row: 4, column: 1 })).toThrowError(
      expect.objectContaining({ code: 'placement-limit-reached' })
    );
  });

  it('can spend the Soul harvested by retirement on an immediate level-one invocation', () => {
    const initial = createState();
    const boardCard = initial.players[1].hand[0];
    const levelOneCard = initial.players[1].hand[1];
    const levelOneDefinition = deck('melee', 99, 1)[0];

    if (boardCard === undefined || levelOneCard === undefined || levelOneDefinition === undefined) {
      throw new Error('The retirement fixture is incomplete.');
    }

    const withLevelOneDefinition: GameState = {
      ...initial,
      cardDefinitions: { ...initial.cardDefinitions, [levelOneDefinition.id]: levelOneDefinition },
      cardInstances: {
        ...initial.cardInstances,
        [levelOneCard]: { ...initial.cardInstances[levelOneCard]!, cardDefinitionId: levelOneDefinition.id }
      }
    };
    const placed = placeCard(withLevelOneDefinition, { playerId: 1, instanceId: boardCard, row: 3, column: 0 });
    const ready = {
      ...placed.state,
      turn: {
        ...placed.state.turn,
        placementsMade: 0,
        defensivePlacementMade: false,
        offensivePlacementMade: false,
        hasStartedPlacement: false,
        hasRetired: false
      }
    };
    const retired = retireCard(ready, { playerId: 1, instanceId: boardCard });
    const invoked = placeCard(retired.state, { playerId: 1, instanceId: levelOneCard, row: 4, column: 0 });

    expect(retired.state.players[1].souls).toBe(1);
    expect(invoked.state.players[1].souls).toBe(0);
    expect(invoked.events).toContainEqual({ type: 'souls-spent', playerId: 1, amount: 1, reason: 'invocation' });
  });

  it('rejects retirement from the hand, outside positioning and after a previous retirement', () => {
    const initial = createState();
    const instanceId = initial.players[1].hand[0];

    if (instanceId === undefined) throw new Error('The initial hand fixture is incomplete.');

    expect(() => retireCard(initial, { playerId: 1, instanceId })).toThrowError(
      expect.objectContaining({ code: 'card-not-on-board' })
    );

    const placed = placeCard(initial, { playerId: 1, instanceId, row: 3, column: 0 });
    const ready = {
      ...placed.state,
      turn: { ...placed.state.turn, placementsMade: 0, defensivePlacementMade: false, offensivePlacementMade: false, hasStartedPlacement: false, hasRetired: false }
    };
    const retired = retireCard(ready, { playerId: 1, instanceId });

    expect(() => retireCard(retired.state, { playerId: 1, instanceId })).toThrowError(
      expect.objectContaining({ code: 'retirement-not-allowed' })
    );
    expect(() => retireCard({ ...ready, turn: { ...ready.turn, phase: 'draw' } }, { playerId: 1, instanceId })).toThrowError(
      expect.objectContaining({ code: 'invalid-phase' })
    );
  });

  it('rejects a level-two card when the player has no souls', () => {
    const levelTwoDeck = deck('melee', 1, 2);
    const state = createState(levelTwoDeck);
    const instanceId = state.players[1].hand[0];

    if (instanceId === undefined) {
      throw new Error('The initial hand fixture is incomplete.');
    }

    expect(() => placeCard(state, { playerId: 1, instanceId, row: 3, column: 0 })).toThrowError(
      expect.objectContaining({ code: 'insufficient-souls' })
    );
  });

  it('rejects placing a card in a position owned by the other player', () => {
    const state = createState();
    const instanceId = state.players[1].hand[0];

    if (instanceId === undefined) {
      throw new Error('The initial hand fixture is incomplete.');
    }

    expect(() => placeCard(state, { playerId: 1, instanceId, row: 2, column: 0 })).toThrowError(
      expect.objectContaining({ code: 'position-not-owned' })
    );
  });

  it('keeps the placement errors typed as rule errors', () => {
    const state = createState();
    const instanceId = state.players[1].hand[0];

    if (instanceId === undefined) {
      throw new Error('The initial hand fixture is incomplete.');
    }

    try {
      placeCard(state, { playerId: 1, instanceId, row: 0, column: 0 });
    } catch (error) {
      expect(error).toBeInstanceOf(GameRuleError);
      return;
    }

    throw new Error('Expected a placement rule error.');
  });
});
