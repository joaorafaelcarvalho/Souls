import type { CardInstanceId } from '../domain/cards/types.js';
import type {
  ColumnCombatResult,
  ColumnTarget,
  CombatCard,
  CombatExchange,
  DefenseCombatResult,
  OffensiveCombatResult,
  SoulAward
} from '../domain/combat/types.js';

export function calculateCombinedAttack(cards: readonly Pick<CombatCard, 'category' | 'attack'>[]): number {
  return cards.reduce((total, card) => total + card.attack, 0);
}

export function resolveAttackAgainstDefense(
  attackPower: number,
  defender: Pick<CombatCard, 'id' | 'ownerId' | 'defense'>
): DefenseCombatResult {
  if (attackPower < 0 || defender.defense < 0) {
    throw new RangeError('Combat values cannot be negative.');
  }

  if (attackPower > defender.defense) {
    return {
      kind: 'defense',
      outcome: 'destroyed',
      attackPower,
      defense: defender.defense,
      remainingAttack: attackPower - defender.defense,
      destroyedCardId: defender.id,
      soulAwards: [{ playerId: defender.ownerId, amount: 1 }],
      hpDamage: 0
    };
  }

  if (attackPower < defender.defense) {
    return {
      kind: 'defense',
      outcome: 'blocked',
      attackPower,
      defense: defender.defense,
      remainingAttack: 0,
      soulAwards: [],
      hpDamage: 0
    };
  }

  return {
    kind: 'defense',
    outcome: 'tie',
    attackPower,
    defense: defender.defense,
    remainingAttack: 0,
    soulAwards: [],
    hpDamage: 0
  };
}

function cardToDestroyWhenCombinedAttackLoses(attackingCards: readonly CombatCard[]): CombatCard | undefined {
  if (attackingCards.length > 1) {
    return attackingCards.find((card) => card.category === 'melee');
  }

  return attackingCards[0];
}

export function resolveAttackAgainstOffense(
  attackingCards: readonly CombatCard[],
  defender: Pick<CombatCard, 'id' | 'ownerId' | 'attack'>,
  availableAttackPower = calculateCombinedAttack(attackingCards)
): OffensiveCombatResult {
  if (attackingCards.length === 0 || attackingCards.length > 2) {
    throw new RangeError('An offensive attack must contain one or two cards.');
  }

  const firstAttacker = attackingCards[0];

  if (firstAttacker === undefined) {
    throw new RangeError('An offensive attack must contain an attacker.');
  }

  if (availableAttackPower < 0) {
    throw new RangeError('Combat values cannot be negative.');
  }

  if (availableAttackPower > defender.attack) {
    return {
      kind: 'offense',
      outcome: 'attacker-wins',
      attackPower: availableAttackPower,
      defenderAttack: defender.attack,
      destroyedCardIds: [defender.id],
      hpDamage: availableAttackPower - defender.attack,
      hpDamageTarget: defender.ownerId,
      soulAwards: [{ playerId: defender.ownerId, amount: 1 }]
    };
  }

  if (availableAttackPower < defender.attack) {
    const destroyedAttacker = cardToDestroyWhenCombinedAttackLoses(attackingCards);

    if (destroyedAttacker === undefined) {
      throw new RangeError('A losing attack must have a card to destroy.');
    }

    return {
      kind: 'offense',
      outcome: 'attacker-loses',
      attackPower: availableAttackPower,
      defenderAttack: defender.attack,
      destroyedCardIds: [destroyedAttacker.id],
      hpDamage: defender.attack - availableAttackPower,
      hpDamageTarget: firstAttacker.ownerId,
      soulAwards: [{ playerId: destroyedAttacker.ownerId, amount: 1 }]
    };
  }

  return {
    kind: 'offense',
    outcome: 'tie',
    attackPower: availableAttackPower,
    defenderAttack: defender.attack,
    destroyedCardIds: [],
    hpDamage: 0,
    hpDamageTarget: undefined,
    soulAwards: []
  };
}

function targetPriority(target: ColumnTarget): number {
  if (target.kind === 'defense') {
    return 0;
  }

  return target.card.category === 'melee' ? 1 : 2;
}

function defenseExchange(target: ColumnTarget & { readonly kind: 'defense' }, result: DefenseCombatResult): CombatExchange {
  return {
    kind: 'defense',
    targetId: target.card.id,
    outcome: result.outcome,
    attackPower: result.attackPower,
    remainingAttack: result.remainingAttack,
    destroyedCardIds: result.destroyedCardId === undefined ? [] : [result.destroyedCardId],
    hpDamage: result.hpDamage,
    soulAwards: result.soulAwards
  };
}

function offenseExchange(target: ColumnTarget & { readonly kind: 'offense' }, result: OffensiveCombatResult): CombatExchange {
  return {
    kind: 'offense',
    targetId: target.card.id,
    outcome: result.outcome,
    attackPower: result.attackPower,
    remainingAttack: 0,
    destroyedCardIds: result.destroyedCardIds,
    hpDamage: result.hpDamage,
    ...(result.hpDamageTarget === undefined ? {} : { hpDamageTarget: result.hpDamageTarget }),
    soulAwards: result.soulAwards
  };
}

export function resolveColumnAttack(input: {
  readonly attackingCards: readonly CombatCard[];
  readonly defenderPlayerId: 1 | 2;
  readonly targets: readonly ColumnTarget[];
}): ColumnCombatResult {
  if (input.attackingCards.length === 0 || input.attackingCards.length > 2) {
    throw new RangeError('A column attack must contain one or two offensive cards.');
  }

  const firstAttacker = input.attackingCards[0];

  if (firstAttacker === undefined) {
    throw new RangeError('A column attack must contain an attacker.');
  }

  const initialAttackPower = calculateCombinedAttack(input.attackingCards);
  let remainingAttack = initialAttackPower;
  const destroyedCardIds: CardInstanceId[] = [];
  const soulAwards: SoulAward[] = [];
  const exchanges: CombatExchange[] = [];

  for (const target of [...input.targets].sort((left, right) => targetPriority(left) - targetPriority(right))) {
    if (target.kind === 'defense') {
      const defenseResult = resolveAttackAgainstDefense(remainingAttack, target.card);
      exchanges.push(defenseExchange(target, defenseResult));

      if (defenseResult.destroyedCardId !== undefined) {
        destroyedCardIds.push(defenseResult.destroyedCardId);
        soulAwards.push(...defenseResult.soulAwards);
        remainingAttack = defenseResult.remainingAttack;
        continue;
      }

      return {
        kind: 'column',
        outcome: defenseResult.outcome === 'tie' ? 'defense-tie' : 'defense-blocked',
        initialAttackPower,
        remainingAttack: 0,
        destroyedCardIds,
        hpDamage: 0,
        hpDamageTarget: undefined,
        soulAwards,
        exchanges
      };
    }

    const offenseResult = resolveAttackAgainstOffense(input.attackingCards, target.card, remainingAttack);
    exchanges.push(offenseExchange(target, offenseResult));

    return {
      kind: 'column',
      outcome:
        offenseResult.outcome === 'attacker-wins'
          ? 'offense-attacker-wins'
          : offenseResult.outcome === 'attacker-loses'
            ? 'offense-attacker-loses'
            : 'offense-tie',
      initialAttackPower,
      remainingAttack: 0,
      destroyedCardIds: [...destroyedCardIds, ...offenseResult.destroyedCardIds],
      hpDamage: offenseResult.hpDamage,
      hpDamageTarget: offenseResult.hpDamageTarget,
      soulAwards: [...soulAwards, ...offenseResult.soulAwards],
      exchanges
    };
  }

  exchanges.push({
    kind: 'direct',
    outcome: 'direct-damage',
    attackPower: remainingAttack,
    remainingAttack,
    destroyedCardIds: [],
    hpDamage: remainingAttack,
    hpDamageTarget: input.defenderPlayerId,
    soulAwards: []
  });

  return {
    kind: 'column',
    outcome: 'direct-damage',
    initialAttackPower,
    remainingAttack,
    destroyedCardIds,
    hpDamage: remainingAttack,
    hpDamageTarget: input.defenderPlayerId,
    soulAwards,
    exchanges
  };
}
