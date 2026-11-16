import type { BoardState } from '../board/types.js';
import type { CardDefinition, CardDefinitionId, CardInstance, CardInstanceId } from '../cards/types.js';
import type { PlayerId, PlayerState } from '../players/types.js';
import type { TurnState } from '../turns/types.js';

export interface GameState {
  readonly status: 'active' | 'finished';
  readonly players: Readonly<Record<PlayerId, PlayerState>>;
  readonly board: BoardState;
  readonly cardDefinitions: Readonly<Record<CardDefinitionId, CardDefinition>>;
  readonly cardInstances: Readonly<Record<CardInstanceId, CardInstance>>;
  readonly turn: TurnState;
  readonly winnerId?: PlayerId;
}