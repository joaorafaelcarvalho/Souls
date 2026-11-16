export type { BoardCellType, BoardColumn, BoardPosition, BoardPositionKey, BoardRow, BoardState } from './domain/board/types.js';
export { BOARD_COLUMNS, BOARD_ROWS, boardPositionKey, createEmptyBoard, getBoardCellType, getBoardOwner, getBoardPosition } from './domain/board/rules.js';
export type { CardCategory, CardDefinition, CardDefinitionId, CardInstance, CardInstanceId, CardLevel, CardType } from './domain/cards/types.js';
export type {
  ColumnCombatResult,
  CombatExchange,
  ColumnTarget,
  CombatCard,
  DefenseCombatResult,
  OffensiveCombatResult,
  SoulAward
} from './domain/combat/types.js';
export type { GameEvent } from './domain/events.js';
export type { CombatColumnTrace, CombatResolutionTrace } from './domain/combat/trace.js';
export type { GameState } from './domain/game/types.js';
export type { PlayerId, PlayerState } from './domain/players/types.js';
export type { TurnPhase, TurnState } from './domain/turns/types.js';
export { GameRuleError } from './application/errors.js';
export { calculateCombinedAttack, resolveAttackAgainstDefense, resolveAttackAgainstOffense, resolveColumnAttack } from './application/combat.js';
export type { InitializeGameInput, PlayerSetup } from './application/initializeGame.js';
export { initializeGame } from './application/initializeGame.js';
export type { RandomSource, UuidGenerator } from './application/random.js';
export { isUuid, shuffle, systemRandomSource, systemUuidGenerator } from './application/random.js';
export {
  DECK_SIZE,
  FAILED_DRAWS_PER_TURN,
  FAILED_DRAW_HP_PENALTY,
  INITIAL_HAND_SIZE,
  INITIAL_HP,
  MAX_SOULS,
  addSouls,
  resolveFailedDrawPenalty,
  spendSouls,
  summonCost
} from './application/resources.js';
export type { GameOperationResult } from './application/operations.js';
export type { PlaceCardCommand, RetireCardCommand } from './application/placement.js';
export { canPlaceCard, placeCard, retireCard } from './application/placement.js';
export { finishPositioningPhase, resolveAttackPhase, resolveDrawPhase } from './application/gameplay.js';
