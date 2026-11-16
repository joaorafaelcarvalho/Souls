import type {
  BoardState,
  CardDefinition,
  CardDefinitionId,
  CardInstance,
  CardInstanceId,
  GameState,
  PlayerId,
  TurnState
} from '@souls/game-core';

/**
 * Public player data exposed to the presentation layer.
 *
 * A non-viewer player's hand is represented by `null` on purpose: the
 * presentation can show its size without receiving the private card ids.
 */
export interface AuthorizedPlayerView {
  readonly id: PlayerId;
  readonly hp: number;
  readonly souls: number;
  readonly hand: readonly CardInstanceId[] | null;
  readonly handCount: number;
  readonly deckCount: number;
  readonly discardCount: number;
}

export interface AuthorizedViewerView extends Omit<AuthorizedPlayerView, 'hand'> {
  readonly hand: readonly CardInstanceId[];
}

/**
 * The only match snapshot that presentation components need to render a game.
 *
 * `visibleCardInstances` contains board cards and the viewer's hand only. It
 * intentionally excludes instances that belong to another player's private
 * hand, deck, or discard pile.
 */
export interface AuthorizedGameView {
  readonly activePlayerId: PlayerId;
  readonly viewerPlayerId: PlayerId;
  readonly status: GameState['status'];
  readonly winnerId?: PlayerId;
  readonly players: Readonly<Record<PlayerId, AuthorizedPlayerView>>;
  readonly viewer: AuthorizedViewerView;
  readonly board: BoardState;
  readonly turn: TurnState;
  readonly cardDefinitions: Readonly<Record<CardDefinitionId, CardDefinition>>;
  readonly visibleCardInstances: Readonly<Record<CardInstanceId, CardInstance>>;
}

function playerView(
  state: GameState,
  playerId: PlayerId,
  viewerPlayerId: PlayerId
): AuthorizedPlayerView {
  const player = state.players[playerId];
  const isViewer = playerId === viewerPlayerId;

  return {
    id: player.id,
    hp: player.hp,
    souls: player.souls,
    hand: isViewer ? [...player.hand] : null,
    handCount: player.hand.length,
    deckCount: player.deck.length,
    discardCount: player.discard.length
  };
}

function visibleInstancesFor(state: GameState, viewerPlayerId: PlayerId): Readonly<Record<CardInstanceId, CardInstance>> {
  const visibleIds = new Set<CardInstanceId>(state.players[viewerPlayerId].hand);

  Object.values(state.board.occupants).forEach((instanceId) => {
    if (instanceId !== null) {
      visibleIds.add(instanceId);
    }
  });

  const visibleInstances: Record<CardInstanceId, CardInstance> = {};

  visibleIds.forEach((instanceId) => {
    const instance = state.cardInstances[instanceId];

    if (instance !== undefined) {
      visibleInstances[instanceId] = instance;
    }
  });

  return visibleInstances;
}

export function createAuthorizedGameView(state: GameState, viewerPlayerId: PlayerId): AuthorizedGameView {
  const players: Readonly<Record<PlayerId, AuthorizedPlayerView>> = {
    1: playerView(state, 1, viewerPlayerId),
    2: playerView(state, 2, viewerPlayerId)
  };
  const viewer = state.players[viewerPlayerId];

  return {
    activePlayerId: state.turn.activePlayerId,
    viewerPlayerId,
    status: state.status,
    ...(state.winnerId === undefined ? {} : { winnerId: state.winnerId }),
    players,
    viewer: {
      ...players[viewerPlayerId],
      hand: [...viewer.hand]
    },
    board: state.board,
    turn: state.turn,
    cardDefinitions: state.cardDefinitions,
    visibleCardInstances: visibleInstancesFor(state, viewerPlayerId)
  };
}
