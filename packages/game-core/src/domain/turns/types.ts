import type { PlayerId } from '../players/types.js';

export type TurnPhase = 'first-round-positioning' | 'draw' | 'positioning' | 'attack';

export interface TurnState {
  readonly round: number;
  readonly firstPlayerId: PlayerId;
  readonly activePlayerId: PlayerId;
  readonly phase: TurnPhase;
  readonly placementsMade: number;
  readonly defensivePlacementMade: boolean;
  readonly offensivePlacementMade: boolean;
  readonly hasStartedPlacement: boolean;
  readonly hasRetired: boolean;
}