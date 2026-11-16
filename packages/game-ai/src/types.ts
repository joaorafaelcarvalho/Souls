import type {
  BoardPosition,
  BoardState,
  CardDefinition,
  CardDefinitionId,
  CardInstanceId,
  GameState,
  PlayerId,
  RandomSource,
  TurnPhase
} from '@souls/game-core';

export type AiDifficulty = 'easy' | 'normal' | 'hard';
export type AiStrategy = 'balanced' | 'aggressive' | 'defensive' | 'low-cost' | 'high-cost' | 'combined-attack' | 'random-legal';

export interface AiCardView {
  readonly instanceId: CardInstanceId;
  readonly cardDefinitionId: CardDefinitionId;
  readonly ownerId: PlayerId;
  readonly definition: CardDefinition;
  readonly position?: BoardPosition;
}

export interface AiObservation {
  readonly playerId: PlayerId;
  readonly activePlayerId: PlayerId;
  readonly round: number;
  readonly phase: TurnPhase;
  readonly board: BoardState;
  readonly ownHp: number;
  readonly ownSouls: number;
  readonly opponentHp: number;
  readonly opponentSouls: number;
  readonly ownHand: readonly AiCardView[];
  readonly boardCards: readonly AiCardView[];
}

export interface AiLegalPlacementOption {
  readonly instanceId: CardInstanceId;
  readonly cardDefinitionId: CardDefinitionId;
  readonly definition: CardDefinition;
  readonly position: BoardPosition;
}

export interface AiLegalRetirementOption {
  readonly instanceId: CardInstanceId;
  readonly cardDefinitionId: CardDefinitionId;
  readonly definition: CardDefinition;
  readonly position: BoardPosition;
}

export interface AiDecisionAgent {
  readonly strategy: AiStrategy;
  readonly difficulty: AiDifficulty;
  chooseRetirement(
    observation: AiObservation,
    options: readonly AiLegalRetirementOption[],
    random: RandomSource
  ): AiLegalRetirementOption | null;
  choosePlacement(
    observation: AiObservation,
    options: readonly AiLegalPlacementOption[],
    random: RandomSource
  ): AiLegalPlacementOption | null;
}

export type { GameState, PlayerId };
