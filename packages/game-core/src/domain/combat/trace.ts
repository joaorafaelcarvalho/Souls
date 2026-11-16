import type { CardInstanceId } from '../cards/types.js';
import type { GameEvent } from '../events.js';
import type { ColumnCombatResult } from './types.js';

export interface CombatColumnTrace {
  readonly column: number;
  readonly attackerIds: readonly CardInstanceId[];
  readonly targetIds: readonly CardInstanceId[];
  readonly result: ColumnCombatResult;
  readonly events: readonly GameEvent[];
}

export interface CombatResolutionTrace {
  readonly columns: readonly CombatColumnTrace[];
  readonly trailingEvents: readonly GameEvent[];
}