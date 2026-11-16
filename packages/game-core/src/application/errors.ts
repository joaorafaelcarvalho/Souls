export type GameRuleErrorCode =
  | 'invalid-phase'
  | 'wrong-active-player'
  | 'game-finished'
  | 'card-not-in-hand'
  | 'card-not-found'
  | 'position-not-owned'
  | 'position-occupied'
  | 'invalid-card-category'
  | 'insufficient-souls'
  | 'placement-limit-reached'
  | 'retirement-not-allowed'
  | 'card-not-on-board';

export class GameRuleError extends Error {
  public readonly code: GameRuleErrorCode;

  public constructor(code: GameRuleErrorCode, message: string) {
    super(message);
    this.name = 'GameRuleError';
    this.code = code;
  }
}