import type { CardLevel } from '../domain/cards/types.js';

export const INITIAL_HP = 10_000;
export const INITIAL_HAND_SIZE = 5;
export const DECK_SIZE = 20;
export const MAX_SOULS = 5;
export const FAILED_DRAWS_PER_TURN = 2;
export const FAILED_DRAW_HP_PENALTY = 500;

export function summonCost(level: CardLevel): number {
  return level;
}

export function addSouls(current: number, amount: number): number {
  return Math.min(MAX_SOULS, Math.max(0, current + amount));
}

export function spendSouls(current: number, amount: number): number | null {
  if (amount < 0 || current < amount) {
    return null;
  }

  return current - amount;
}

export interface FailedDrawPenalty {
  readonly soulsAfter: number;
  readonly hpDamage: number;
  readonly consumedSoul: boolean;
}

export function resolveFailedDrawPenalty(souls: number): FailedDrawPenalty {
  if (souls > 0) {
    return { soulsAfter: souls - 1, hpDamage: 0, consumedSoul: true };
  }

  return { soulsAfter: 0, hpDamage: FAILED_DRAW_HP_PENALTY, consumedSoul: false };
}

