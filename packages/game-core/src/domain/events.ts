import type { CardInstanceId } from './cards/types.js';
import type { PlayerId } from './players/types.js';
import type { TurnPhase } from './turns/types.js';

export type GameEvent =
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
      readonly instanceId: CardInstanceId;
      readonly playerId: PlayerId;
      readonly attempt: 1 | 2;
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
      readonly phase: TurnPhase;
    }
  | {
      readonly type: 'game-ended';
      readonly winnerId: PlayerId;
      readonly reason: 'hp-reached-zero';
    };
