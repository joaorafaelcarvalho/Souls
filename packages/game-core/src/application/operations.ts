import type { GameEvent } from '../domain/events.js';
import type { GameState } from '../domain/game/types.js';
import type { CombatResolutionTrace } from '../domain/combat/trace.js';

export interface GameOperationResult {
  readonly state: GameState;
  readonly events: readonly GameEvent[];
  /** Pure combat metadata for presentation layers; it contains no timing or UI dependencies. */
  readonly combatTrace?: CombatResolutionTrace;
}