import { createEmptyBoard } from '../domain/board/rules.js';
import type { CardDefinition, CardDefinitionId, CardInstance } from '../domain/cards/types.js';
import type { GameState } from '../domain/game/types.js';
import type { PlayerId, PlayerState } from '../domain/players/types.js';
import type { RandomSource, UuidGenerator } from './random.js';
import { isUuid, shuffle, systemRandomSource, systemUuidGenerator } from './random.js';
import { DECK_SIZE, INITIAL_HAND_SIZE, INITIAL_HP } from './resources.js';

export interface PlayerSetup {
  readonly id: PlayerId;
  readonly deck: readonly CardDefinitionId[];
}

export interface InitializeGameInput {
  readonly players: readonly [PlayerSetup, PlayerSetup];
  readonly cardDefinitions: readonly CardDefinition[];
  readonly random?: RandomSource;
  readonly uuidGenerator?: UuidGenerator;
}

function createPlayerState(id: PlayerId, instances: readonly CardInstance[], random: RandomSource): PlayerState {
  const shuffled = shuffle(instances, random);

  return {
    id,
    hp: INITIAL_HP,
    souls: 0,
    hand: shuffled.slice(0, INITIAL_HAND_SIZE).map((instance) => instance.instanceId),
    deck: shuffled.slice(INITIAL_HAND_SIZE).map((instance) => instance.instanceId),
    discard: []
  };
}

export function initializeGame({
  players,
  cardDefinitions,
  random = systemRandomSource,
  uuidGenerator = systemUuidGenerator
}: InitializeGameInput): GameState {
  const [firstSetup, secondSetup] = players;

  if (firstSetup.id === secondSetup.id) {
    throw new Error('A game requires two distinct players.');
  }

  for (const setup of players) {
    if (setup.deck.length !== DECK_SIZE) {
      throw new Error(`Player ${setup.id} must provide exactly ${DECK_SIZE} card definition UUIDs.`);
    }
  }

  const definitionsById: Record<CardDefinitionId, CardDefinition> = {};

  for (const definition of cardDefinitions) {
    if (definitionsById[definition.id] !== undefined) {
      throw new Error(`Duplicate card definition UUID "${definition.id}".`);
    }

    definitionsById[definition.id] = definition;
  }

  const firstPlayerId: PlayerId = random.next() < 0.5 ? firstSetup.id : secondSetup.id;
  const cardInstances: Record<string, CardInstance> = {};
  const playerStates: Partial<Record<PlayerId, PlayerState>> = {};
  const usedInstanceIds = new Set<string>();

  for (const setup of players) {
    const instances = setup.deck.map((cardDefinitionId) => {
      const definition = definitionsById[cardDefinitionId];

      if (definition === undefined) {
        throw new Error(`Card definition UUID "${cardDefinitionId}" was not found in the catalog.`);
      }

      const instanceId = uuidGenerator.next();

      if (!isUuid(instanceId)) {
        throw new Error(`Generated card instance ID "${instanceId}" is not a valid UUID.`);
      }

      if (usedInstanceIds.has(instanceId)) {
        throw new Error(`Generated duplicate card instance UUID "${instanceId}".`);
      }

      usedInstanceIds.add(instanceId);

      const instance: CardInstance = {
        instanceId,
        cardDefinitionId: definition.id,
        ownerId: setup.id
      };

      cardInstances[instance.instanceId] = instance;
      return instance;
    });

    playerStates[setup.id] = createPlayerState(setup.id, instances, random);
  }

  const playerOne = playerStates[1];
  const playerTwo = playerStates[2];

  if (playerOne === undefined || playerTwo === undefined) {
    throw new Error('Player identifiers must be 1 and 2.');
  }

  return {
    status: 'active',
    players: { 1: playerOne, 2: playerTwo },
    board: createEmptyBoard(),
    cardDefinitions: definitionsById,
    cardInstances,
    turn: {
      round: 1,
      firstPlayerId,
      activePlayerId: firstPlayerId,
      phase: 'first-round-positioning',
      placementsMade: 0,
      defensivePlacementMade: false,
      offensivePlacementMade: false,
      hasStartedPlacement: false,
      hasRetired: false
    }
  };
}