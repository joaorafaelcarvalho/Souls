import type { CardInstanceId } from '@souls/game-core';
import type { CombatAnimationSpeed } from '../../combat/application/CombatAnimationSequencer';

/**
 * Intent-level commands exposed by a match session.
 *
 * The local adapter executes these against game-core today. An online adapter
 * can keep this surface and replace only the command transport later.
 */
export interface MatchCommands {
  readonly selectCard: (instanceId: CardInstanceId) => void;
  readonly selectBoardCard: (instanceId: CardInstanceId) => void;
  readonly placeSelectedCard: (row: number, column: number) => void;
  readonly retireSelectedCard: () => void;
  readonly advancePositioning: () => void;
  readonly resolveDraw: () => void;
  readonly resolveAttack: () => void;
  readonly setCombatSpeed: (speed: CombatAnimationSpeed) => void;
  readonly skipCombat: () => void;
  readonly reset: () => void;
}
