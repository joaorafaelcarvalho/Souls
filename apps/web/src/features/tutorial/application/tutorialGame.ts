import { loadBrowserCardCatalog, validateDeckReferences } from '@souls/game-content';
import {
  finishPositioningPhase,
  initializeGame,
  placeCard,
  resolveDrawPhase,
  type CardDefinitionId,
  type GameState,
  type PlayerId,
  type RandomSource
} from '@souls/game-core';
import type { TutorialCardKey } from './tutorialSteps';

const cardNames: Readonly<Record<TutorialCardKey, string>> = {
  cavaleiro: 'Cavaleiro',
  defensor: 'Defensor',
  arqueiro: 'Arqueiro',
  mago: 'Mago',
  'cavaleiro-negro': 'Cavaleiro Negro',
  'cacadora-lua-palida': 'Caçadora da Lua Pálida',
  'matriarca-selos': 'Matriarca dos Selos',
  'rei-exilado': 'Rei Exilado'
};

function tutorialRandom(): RandomSource {
  let call = 0;

  return {
    next: () => {
      if (call === 0) {
        call += 1;
        return 0;
      }

      const shuffleIndex = 19 - ((call - 1) % 19);
      call += 1;
      return shuffleIndex / (shuffleIndex + 1);
    }
  };
}

function tutorialDeck(definitionIds: readonly CardDefinitionId[]): CardDefinitionId[] {
  return Array.from({ length: 20 }, (_, index) => {
    const definitionId = definitionIds[index % definitionIds.length];

    if (definitionId === undefined) {
      throw new Error('O catálogo tutorial não contém cartas.');
    }

    return definitionId;
  });
}

export function createTutorialGame(): GameState {
  const catalog = loadBrowserCardCatalog();
  const orderedDefinitions = (Object.keys(cardNames) as TutorialCardKey[]).map((key) => {
    const definition = catalog.definitions.find((entry) => entry.name === cardNames[key]);

    if (definition === undefined) {
      throw new Error(`A carta tutorial "${cardNames[key]}" não existe no catálogo.`);
    }

    return definition;
  });
  const deck = validateDeckReferences(
    tutorialDeck(orderedDefinitions.map((definition) => definition.id)),
    catalog,
    'souls-tutorial-deck'
  );

  return initializeGame({
    cardDefinitions: catalog.definitions,
    players: [
      { id: 1, deck },
      { id: 2, deck: [...deck] }
    ],
    random: tutorialRandom()
  });
}

export function definitionIdFor(state: GameState, key: TutorialCardKey): CardDefinitionId {
  const expectedName = cardNames[key];
  const definition = Object.values(state.cardDefinitions).find((entry) => entry.name === expectedName);

  if (definition === undefined) {
    throw new Error(`A carta tutorial "${expectedName}" não existe no estado.`);
  }

  return definition.id;
}

export function cardInHandFor(state: GameState, playerId: PlayerId, key: TutorialCardKey): string {
  const definitionId = definitionIdFor(state, key);
  const instanceId = state.players[playerId].hand.find((id) => state.cardInstances[id]?.cardDefinitionId === definitionId);

  if (instanceId === undefined) {
    throw new Error(`A carta tutorial "${cardNames[key]}" não está na mão do jogador ${playerId}.`);
  }

  return instanceId;
}

function ensureCardInHand(state: GameState, playerId: PlayerId, key: TutorialCardKey): GameState {
  const instanceId = state.players[playerId].hand.find((id) => state.cardInstances[id]?.cardDefinitionId === definitionIdFor(state, key));

  if (instanceId !== undefined) {
    return state;
  }

  const definitionId = definitionIdFor(state, key);
  const player = state.players[playerId];
  const movableId = [...player.deck, ...player.discard].find((id) => state.cardInstances[id]?.cardDefinitionId === definitionId);

  if (movableId === undefined) {
    throw new Error(`A carta tutorial "${cardNames[key]}" não está disponível para o cenário.`);
  }

  return {
    ...state,
    players: {
      ...state.players,
      [playerId]: {
        ...player,
        hand: [...player.hand, movableId],
        deck: player.deck.filter((id) => id !== movableId),
        discard: player.discard.filter((id) => id !== movableId)
      }
    }
  };
}

export function createDrawScenario(): GameState {
  const firstPlayerFinished = finishPositioningPhase(createTutorialGame()).state;
  return finishPositioningPhase(firstPlayerFinished).state;
}

function createEmptyDrawScenario(souls: number): GameState {
  const drawState = createDrawScenario();
  return {
    ...drawState,
    players: {
      ...drawState.players,
      1: { ...drawState.players[1], deck: [], souls }
    }
  };
}

export function createFailedDrawScenario(): GameState {
  return createEmptyDrawScenario(0);
}

export function createSoulDrawScenario(): GameState {
  return createEmptyDrawScenario(1);
}

export function createCombatScenario(combined: boolean): GameState {
  let state = createTutorialGame();
  state = ensureCardInHand(state, 1, 'cavaleiro');
  state = ensureCardInHand(state, 2, combined ? 'cavaleiro' : 'mago');
  const attacker = cardInHandFor(state, 1, 'cavaleiro');
  const defender = cardInHandFor(state, 2, combined ? 'cavaleiro' : 'mago');

  state = placeCard(state, {
    playerId: 1,
    instanceId: attacker,
    row: 4,
    column: 0
  }).state;
  state = finishPositioningPhase(state).state;
  state = placeCard(state, {
    playerId: 2,
    instanceId: defender,
    row: combined ? 2 : 0,
    column: 0
  }).state;
  state = finishPositioningPhase(state).state;
  state = resolveDrawPhase(state).state;

  if (combined) {
    state = ensureCardInHand(state, 1, 'arqueiro');
    const ranged = cardInHandFor(state, 1, 'arqueiro');
    state = placeCard(state, {
      playerId: 1,
      instanceId: ranged,
      row: 5,
      column: 0
    }).state;
  }

  return finishPositioningPhase(state).state;
}

export function createSoulInvocationScenario(): GameState {
  let state = resolveDrawPhase(createDrawScenario()).state;
  state = ensureCardInHand(state, 1, 'cacadora-lua-palida');

  return {
    ...state,
    players: {
      ...state.players,
      1: { ...state.players[1], souls: 2 }
    }
  };
}

export function createHighLevelShowcaseScenario(): GameState {
  let state = createTutorialGame();
  state = ensureCardInHand(state, 1, 'matriarca-selos');
  state = ensureCardInHand(state, 1, 'rei-exilado');
  return state;
}

export function createFinalChallengeScenario(): GameState {
  let state = createTutorialGame();
  state = ensureCardInHand(state, 2, 'cavaleiro');
  state = finishPositioningPhase(state).state;

  const opponentCard = cardInHandFor(state, 2, 'cavaleiro');
  state = placeCard(state, {
    playerId: 2,
    instanceId: opponentCard,
    row: 2,
    column: 0
  }).state;
  state = finishPositioningPhase(state).state;
  state = resolveDrawPhase(state).state;
  state = ensureCardInHand(state, 1, 'cavaleiro');
  state = ensureCardInHand(state, 1, 'arqueiro');
  return state;
}

export function createRetirementScenario(): GameState {
  let state = createTutorialGame();
  const card = cardInHandFor(state, 1, 'cavaleiro');

  state = placeCard(state, { playerId: 1, instanceId: card, row: 4, column: 0 }).state;
  state = finishPositioningPhase(state).state;
  state = finishPositioningPhase(state).state;
  state = resolveDrawPhase(state).state;

  return state;
}
