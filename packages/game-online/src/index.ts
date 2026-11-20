import type {
  BoardState,
  CardDefinition,
  CardDefinitionId,
  CardInstance,
  CardInstanceId,
  CombatResolutionTrace,
  GameState,
  PlayerId,
  TurnState
} from '@souls/game-core';

export type { CombatResolutionTrace, GameEvent, GameState, PlayerId, TurnState } from '@souls/game-core';

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

function visibleInstancesFor(
  state: GameState,
  viewerPlayerId: PlayerId
): Readonly<Record<CardInstanceId, CardInstance>> {
  const visibleIds = new Set<CardInstanceId>(state.players[viewerPlayerId].hand);

  Object.values(state.board.occupants).forEach((instanceId) => {
    if (instanceId !== null) visibleIds.add(instanceId);
  });

  const visibleCardInstances: Record<CardInstanceId, CardInstance> = {};
  visibleIds.forEach((instanceId) => {
    const instance = state.cardInstances[instanceId];
    if (instance !== undefined) visibleCardInstances[instanceId] = instance;
  });

  return visibleCardInstances;
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

export type OnlineRoomPhase = 'lobby' | 'playing' | 'finished' | 'closed';

export interface OnlineParticipantSnapshot {
  readonly playerId: PlayerId;
  readonly connected: boolean;
  readonly deckSelected: boolean;
  readonly ready: boolean;
  readonly rematchAccepted: boolean;
}

export interface OnlineRoomSnapshot {
  readonly roomId: string;
  readonly roomCode: string;
  readonly phase: OnlineRoomPhase;
  readonly selfPlayerId: PlayerId;
  readonly participants: readonly OnlineParticipantSnapshot[];
  readonly matchId?: string;
  readonly version: number;
}

export interface OnlineMatchSnapshot {
  readonly room: OnlineRoomSnapshot;
  readonly matchId: string;
  readonly version: number;
  readonly view: AuthorizedGameView;
  readonly events: readonly OnlineGameEvent[];
  readonly combatTrace?: CombatResolutionTrace;
}

export type OnlineGameEvent =
  | {
      readonly type: 'card-invoked';
      readonly instanceId: CardInstanceId;
      readonly playerId: PlayerId;
      readonly position: `${number},${number}`;
    }
  | {
      readonly type: 'card-retired';
      readonly instanceId: CardInstanceId;
      readonly playerId: PlayerId;
      readonly reason: 'voluntary';
    }
  | {
      readonly type: 'card-drawn';
      readonly playerId: PlayerId;
      readonly attempt: 1 | 2;
      readonly instanceId?: CardInstanceId;
    }
  | {
      readonly type: 'draw-failed';
      readonly playerId: PlayerId;
      readonly attempt: 1 | 2;
      readonly penalty: 'soul' | 'hp';
    }
  | {
      readonly type: 'card-destroyed';
      readonly instanceId: CardInstanceId;
      readonly ownerId: PlayerId;
      readonly reason: 'combat';
    }
  | {
      readonly type: 'souls-gained';
      readonly playerId: PlayerId;
      readonly amount: number;
      readonly reason: 'combat' | 'retirement';
    }
  | {
      readonly type: 'souls-spent';
      readonly playerId: PlayerId;
      readonly amount: number;
      readonly reason: 'invocation' | 'failed-draw';
    }
  | {
      readonly type: 'damage-dealt';
      readonly targetPlayerId: PlayerId;
      readonly amount: number;
      readonly reason: 'combat' | 'failed-draw';
    }
  | {
      readonly type: 'turn-started';
      readonly round: number;
      readonly playerId: PlayerId;
      readonly phase: TurnState['phase'];
    }
  | {
      readonly type: 'game-ended';
      readonly winnerId: PlayerId;
      readonly reason: 'hp-reached-zero';
    };

export interface CreateRoomResponse {
  readonly room: OnlineRoomSnapshot;
  readonly sessionToken: string;
}

export type JoinRoomResponse = CreateRoomResponse;

export interface OnlineHelloMessage {
  readonly type: 'hello';
  readonly roomId: string;
  readonly sessionToken: string;
}

export type OnlineAction =
  | { readonly type: 'place-card'; readonly instanceId: CardInstanceId; readonly row: number; readonly column: number }
  | { readonly type: 'retire-card'; readonly instanceId: CardInstanceId }
  | { readonly type: 'finish-positioning' }
  | { readonly type: 'resolve-draw' }
  | { readonly type: 'resolve-attack' };

export type OnlineClientMessage =
  | OnlineHelloMessage
  | { readonly type: 'select-deck'; readonly commandId: string; readonly deck: readonly string[] }
  | { readonly type: 'set-ready'; readonly commandId: string; readonly ready: boolean }
  | { readonly type: 'command'; readonly commandId: string; readonly matchId: string; readonly expectedVersion: number; readonly action: OnlineAction }
  | { readonly type: 'accept-rematch'; readonly commandId: string; readonly matchId: string }
  | { readonly type: 'leave-room'; readonly commandId: string };

export type OnlineServerMessage =
  | { readonly type: 'hello-accepted'; readonly room: OnlineRoomSnapshot }
  | { readonly type: 'room-updated'; readonly room: OnlineRoomSnapshot }
  | { readonly type: 'match-updated'; readonly snapshot: OnlineMatchSnapshot }
  | { readonly type: 'command-accepted'; readonly commandId: string; readonly version: number }
  | { readonly type: 'command-rejected'; readonly commandId?: string; readonly code: string; readonly message: string; readonly version?: number }
  | { readonly type: 'online-error'; readonly code: string; readonly message: string }
  | { readonly type: 'room-closed'; readonly reason: 'player-left' | 'expired' };
