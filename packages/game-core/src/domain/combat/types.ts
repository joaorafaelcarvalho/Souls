import type { CardInstanceId, CardCategory } from '../cards/types.js';
import type { PlayerId } from '../players/types.js';

export interface CombatCard {
  readonly id: CardInstanceId;
  readonly ownerId: PlayerId;
  readonly category: CardCategory;
  readonly attack: number;
  readonly defense: number;
}

export type ColumnTarget =
  | { readonly kind: 'defense'; readonly card: CombatCard }
  | { readonly kind: 'offense'; readonly card: CombatCard };

export interface SoulAward {
  readonly playerId: PlayerId;
  readonly amount: number;
}

export interface DefenseCombatResult {
  readonly kind: 'defense';
  readonly outcome: 'destroyed' | 'blocked' | 'tie';
  readonly attackPower: number;
  readonly defense: number;
  readonly remainingAttack: number;
  readonly destroyedCardId?: CardInstanceId;
  readonly soulAwards: readonly SoulAward[];
  readonly hpDamage: 0;
}

export interface OffensiveCombatResult {
  readonly kind: 'offense';
  readonly outcome: 'attacker-wins' | 'attacker-loses' | 'tie';
  readonly attackPower: number;
  readonly defenderAttack: number;
  readonly destroyedCardIds: readonly CardInstanceId[];
  readonly hpDamage: number;
  readonly hpDamageTarget: PlayerId | undefined;
  readonly soulAwards: readonly SoulAward[];
}

/**
 * A deterministic exchange trace for presentation layers. It intentionally
 * contains no timing, DOM, or animation concerns.
 */
export interface CombatExchange {
  readonly kind: 'defense' | 'offense' | 'direct';
  readonly targetId?: CardInstanceId;
  readonly outcome: DefenseCombatResult['outcome'] | OffensiveCombatResult['outcome'] | 'direct-damage';
  readonly attackPower: number;
  readonly remainingAttack: number;
  readonly destroyedCardIds: readonly CardInstanceId[];
  readonly hpDamage: number;
  readonly hpDamageTarget?: PlayerId;
  readonly soulAwards: readonly SoulAward[];
}

export interface ColumnCombatResult {
  readonly kind: 'column';
  readonly outcome:
    | 'direct-damage'
    | 'defense-blocked'
    | 'defense-tie'
    | 'offense-attacker-wins'
    | 'offense-attacker-loses'
    | 'offense-tie';
  readonly initialAttackPower: number;
  readonly remainingAttack: number;
  readonly destroyedCardIds: readonly CardInstanceId[];
  readonly hpDamage: number;
  readonly hpDamageTarget: PlayerId | undefined;
  readonly soulAwards: readonly SoulAward[];
  readonly exchanges: readonly CombatExchange[];
}
