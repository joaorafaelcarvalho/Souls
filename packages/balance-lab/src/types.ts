import type {
  CardDefinitionId,
  CardInstanceId,
  CardLevel,
  CardType,
  GameEvent,
  GameState,
  PlayerId
} from '@souls/game-core';
import type {
  AiCardView,
  AiDecisionAgent,
  AiLegalPlacementOption,
  AiLegalRetirementOption,
  AiObservation,
  AiStrategy
} from '@souls/game-ai';

export type AgentStrategy = AiStrategy;
export type DeckProfile = AgentStrategy | 'expensive-negative';
export type LabRunMode = 'smoke' | 'balance' | 'extended';
export type LevelCounter = Record<CardLevel, number>;
export type PlayerCounter = Record<PlayerId, number>;
export type PlayerLevelCounter = Record<PlayerId, LevelCounter>;
export type DefinitionCounter = Record<CardDefinitionId, number>;
export type PlayerDefinitionCounter = Record<PlayerId, DefinitionCounter>;

export type LabCardView = AiCardView;
export type LabObservation = AiObservation;
export type LegalPlacementOption = AiLegalPlacementOption;
export type LegalRetirementOption = AiLegalRetirementOption;

export type PlacementFailureReason = 'insufficient-souls' | 'no-space' | 'placement-limit';

export interface HandPlacementDiagnostic {
  readonly instanceId: CardInstanceId;
  readonly cardDefinitionId: CardDefinitionId;
  readonly level: CardLevel;
  readonly reason?: PlacementFailureReason;
}

export type LabAgent = AiDecisionAgent;

export interface DeckFixture {
  readonly name: string;
  readonly profile: DeckProfile;
  readonly cards: readonly CardDefinitionId[];
}

export interface SimulationConfig {
  readonly games: number;
  readonly seed: number;
  readonly maxRounds: number;
  readonly maxActions: number;
  readonly playerOneStrategy: AgentStrategy;
  readonly playerTwoStrategy: AgentStrategy;
  readonly playerOneDeck: DeckFixture;
  readonly playerTwoDeck: DeckFixture;
  readonly rulesVersion: string;
  readonly catalogVersion: string;
  /** Optional deterministic priority used by paired position-inversion runs. */
  readonly firstPlayerId?: PlayerId;
  readonly includeEvents?: boolean;
  /** One-based game numbers whose complete event streams should be retained. */
  readonly eventGames?: readonly number[];
}

export interface SimulationEventSummary {
  readonly events: readonly GameEvent[];
  readonly actions: number;
}

export interface InvocationDiagnostics {
  readonly insufficientSouls: LevelCounter;
  readonly availableNotChosen: LevelCounter;
  readonly noSpace: LevelCounter;
  readonly placementLimit: LevelCounter;
}

export interface CardLocationMetrics {
  readonly hand: LevelCounter;
  readonly deck: LevelCounter;
  readonly discard: LevelCounter;
}

export interface SimulationMetrics {
  readonly id: string;
  readonly seed: number;
  readonly playerOneStrategy: AgentStrategy;
  readonly playerTwoStrategy: AgentStrategy;
  readonly playerOneDeck: string;
  readonly playerTwoDeck: string;
  readonly status: 'completed' | 'inconclusive';
  readonly reason?: 'game-ended' | 'round-limit' | 'action-limit';
  readonly winnerId?: PlayerId;
  readonly firstPlayerId: PlayerId;
  readonly finalRound: number;
  readonly turns: number;
  readonly actions: number;
  readonly finalHp: Readonly<Record<PlayerId, number>>;
  readonly finalSouls: Readonly<Record<PlayerId, number>>;
  readonly soulsGained: PlayerCounter;
  readonly soulsGainedFromCombat: PlayerCounter;
  readonly soulsGainedFromRetirement: PlayerCounter;
  readonly soulsSpent: PlayerCounter;
  readonly soulsSpentOnInvocations: PlayerCounter;
  readonly soulsSpentOnPenalties: PlayerCounter;
  readonly firstSoulRound: Readonly<Record<PlayerId, number | null>>;
  readonly cardsDrawn: PlayerCounter;
  readonly cardsInvoked: PlayerCounter;
  readonly cardsDestroyed: PlayerCounter;
  readonly cardsRetired: PlayerCounter;
  readonly failedDraws: PlayerCounter;
  readonly cardsDrawnByDefinition: Readonly<Record<PlayerId, Readonly<Record<CardDefinitionId, number>>>>;
  readonly cardsInvokedByDefinition: Readonly<Record<PlayerId, Readonly<Record<CardDefinitionId, number>>>>;
  readonly cardsDestroyedByDefinition: Readonly<Record<PlayerId, Readonly<Record<CardDefinitionId, number>>>>;
  /** Backwards-compatible name; it now means combat damage caused. */
  readonly damageDealt: PlayerCounter;
  readonly damageReceived: PlayerCounter;
  readonly combatDamageDealt: PlayerCounter;
  readonly combatDamageReceived: PlayerCounter;
  readonly hpPenalties: PlayerCounter;
  readonly excessDamage: PlayerCounter;
  readonly invocationsByLevel: PlayerLevelCounter;
  readonly firstInvocationRoundByLevel: Readonly<Record<PlayerId, Readonly<Record<CardLevel, number | null>>>>;
  readonly invocationDiagnostics: Readonly<Record<PlayerId, InvocationDiagnostics>>;
  readonly cardLocationsByLevel: Readonly<Record<PlayerId, CardLocationMetrics>>;
  readonly metricWarnings: readonly string[];
  readonly events?: readonly GameEvent[];
}

export interface AggregateStrategyResult {
  readonly playerId: PlayerId;
  readonly strategy: AgentStrategy;
  readonly deck: string;
  readonly games: number;
  readonly wins: number;
  readonly losses: number;
  readonly inconclusive: number;
  readonly firstPlayerGames: number;
  readonly firstPlayerWins: number;
  readonly winRate: number;
  readonly averageRounds: number;
  readonly averageFinalHp: number;
  readonly averageSoulsGained: number;
  readonly averageSoulsGainedFromCombat: number;
  readonly averageSoulsGainedFromRetirement: number;
  readonly averageSoulsSpent: number;
  readonly averageDamageDealt: number;
  readonly averageDamageReceived: number;
}

export interface DeckDistribution {
  readonly playerId: PlayerId;
  readonly name: string;
  readonly profile: DeckProfile;
  readonly totalCards: number;
  readonly valid: boolean;
  readonly practicalToStart: boolean;
  readonly validationErrors: readonly string[];
  readonly byLevel: LevelCounter;
  readonly byType: Readonly<Record<CardType, number>>;
  readonly definitionsPresent: number;
  readonly definitionsMissing: number;
  readonly freeCards: number;
  readonly missingDefinitionNames: readonly string[];
}

export interface InvocationCoverageScenario {
  readonly level: CardLevel;
  readonly cardDefinitionId: CardDefinitionId;
  readonly cardName: string;
  readonly type: CardType;
  readonly soulsBefore: number;
  readonly legal: boolean;
  readonly invoked: boolean;
  readonly reason?: 'insufficient-souls' | 'invoked';
}

export interface InvocationCoverageReport {
  readonly scenarios: readonly InvocationCoverageScenario[];
  readonly invocationsByLevel: LevelCounter;
  readonly allLevelsCovered: boolean;
  readonly warnings: readonly string[];
}

export interface AggregateReport {
  readonly generatedAt: string;
  readonly config: SimulationConfig;
  readonly games: number;
  readonly completedGames: number;
  readonly inconclusiveGames: number;
  readonly winsByPlayer: Readonly<Record<PlayerId, number>>;
  readonly strategyResults: readonly AggregateStrategyResult[];
  readonly averageRounds: number;
  readonly averageTurns: number;
  readonly averageFinalHp: Readonly<Record<PlayerId, number>>;
  readonly averageSoulsGained: PlayerCounter;
  readonly averageSoulsGainedFromCombat: PlayerCounter;
  readonly averageSoulsGainedFromRetirement: PlayerCounter;
  readonly averageSoulsSpent: PlayerCounter;
  readonly averageDamageDealt: PlayerCounter;
  readonly averageDamageReceived: PlayerCounter;
  readonly averageCombatDamageDealt: PlayerCounter;
  readonly averageCombatDamageReceived: PlayerCounter;
  readonly averageHpPenalties: PlayerCounter;
  readonly averageExcessDamage: PlayerCounter;
  /** Total invocations across both players, retained for existing consumers. */
  readonly invocationsByLevel: LevelCounter;
  readonly invocationsByPlayerAndLevel: PlayerLevelCounter;
  readonly firstInvocationRoundByPlayerAndLevel: Readonly<Record<PlayerId, Readonly<Record<CardLevel, number | null>>>>;
  readonly invocationDiagnostics: Readonly<Record<PlayerId, InvocationDiagnostics>>;
  readonly averageCardsRemainingInHand: PlayerLevelCounter;
  readonly averageCardsRemainingInDeck: PlayerLevelCounter;
  readonly deckDistributions: readonly DeckDistribution[];
  readonly invocationCoverage: InvocationCoverageReport;
  readonly warnings: readonly string[];
}

export interface SimulationOutput {
  readonly games: readonly SimulationMetrics[];
  readonly aggregate: AggregateReport;
  readonly invocationCoverage: InvocationCoverageReport;
}

export interface GameStateSnapshot {
  readonly state: GameState;
  readonly eventSummary: SimulationEventSummary;
}

export interface PairedGameComparison {
  readonly pairIndex: number;
  readonly seed: number;
  readonly baselineSimulationId: string;
  readonly swappedSimulationId: string;
  readonly baselineFirstPlayerId: PlayerId;
  readonly swappedFirstPlayerId: PlayerId;
  readonly baselineWinnerId?: PlayerId;
  readonly swappedWinnerId?: PlayerId;
}

export interface PairedSimulationOutput {
  readonly baseline: SimulationOutput;
  readonly swapped: SimulationOutput;
  readonly comparisons: readonly PairedGameComparison[];
  readonly warnings: readonly string[];
}

export type { CardLevel, CardType };
