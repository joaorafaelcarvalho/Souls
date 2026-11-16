import { describe, expect, it } from 'vitest';
import {
  calculateCombinedAttack,
  resolveAttackAgainstDefense,
  resolveAttackAgainstOffense,
  resolveColumnAttack,
  type CombatCard
} from '../src/index.js';

function card(
  id: string,
  ownerId: 1 | 2,
  category: 'melee' | 'ranged',
  attack: number,
  defense = 0
): CombatCard {
  return { id, ownerId, category, attack, defense };
}

describe('deterministic combat resolution', () => {
  it('destroys a defense and returns the remaining attack without HP damage', () => {
    const result = resolveAttackAgainstDefense(1_000, card('defender', 2, 'melee', 300, 300));

    expect(result.outcome).toBe('destroyed');
    expect(result.remainingAttack).toBe(700);
    expect(result.hpDamage).toBe(0);
    expect(result.destroyedCardId).toBe('defender');
    expect(result.soulAwards).toEqual([{ playerId: 2, amount: 1 }]);
  });

  it('blocks an attack when defense is higher and applies no direct damage in the resolver', () => {
    const result = resolveAttackAgainstDefense(300, card('defender', 2, 'melee', 0, 700));

    expect(result.outcome).toBe('blocked');
    expect(result.remainingAttack).toBe(0);
    expect(result.hpDamage).toBe(0);
    expect(result.soulAwards).toEqual([]);
  });

  it('ends a defense encounter without penalties on an equal value', () => {
    const result = resolveAttackAgainstDefense(300, card('defender', 2, 'melee', 0, 300));

    expect(result.outcome).toBe('tie');
    expect(result.remainingAttack).toBe(0);
    expect(result.destroyedCardId).toBeUndefined();
  });

  it('resolves an attacker victory with difference damage and one soul award', () => {
    const result = resolveAttackAgainstOffense(
      [card('attacker', 1, 'melee', 700)],
      card('defender', 2, 'melee', 300)
    );

    expect(result.outcome).toBe('attacker-wins');
    expect(result.destroyedCardIds).toEqual(['defender']);
    expect(result.hpDamage).toBe(400);
    expect(result.hpDamageTarget).toBe(2);
    expect(result.soulAwards).toEqual([{ playerId: 2, amount: 1 }]);
  });

  it('destroys only the melee attacker when a combined attack loses', () => {
    const result = resolveAttackAgainstOffense(
      [card('melee-attacker', 1, 'melee', 300), card('ranged-attacker', 1, 'ranged', 100)],
      card('defender', 2, 'melee', 500)
    );

    expect(result.outcome).toBe('attacker-loses');
    expect(result.destroyedCardIds).toEqual(['melee-attacker']);
    expect(result.hpDamage).toBe(100);
    expect(result.hpDamageTarget).toBe(1);
    expect(result.soulAwards).toEqual([{ playerId: 1, amount: 1 }]);
  });

  it('leaves all cards intact on an offensive tie', () => {
    const result = resolveAttackAgainstOffense(
      [card('attacker', 1, 'melee', 300)],
      card('defender', 2, 'ranged', 300)
    );

    expect(result.outcome).toBe('tie');
    expect(result.destroyedCardIds).toEqual([]);
    expect(result.hpDamage).toBe(0);
    expect(result.soulAwards).toEqual([]);
  });

  it('sums the two offensive positions', () => {
    expect(
      calculateCombinedAttack([
        card('melee', 1, 'melee', 700),
        card('ranged', 1, 'ranged', 300)
      ])
    ).toBe(1_000);
  });

  it('resolves the official 1000 attack example in the prescribed target order', () => {
    const result = resolveColumnAttack({
      attackingCards: [
        card('attacker-melee', 1, 'melee', 700),
        card('attacker-ranged', 1, 'ranged', 300)
      ],
      defenderPlayerId: 2,
      targets: [
        { kind: 'offense', card: card('defender-ranged', 2, 'ranged', 100) },
        { kind: 'defense', card: card('defender-defense', 2, 'melee', 0, 300) },
        { kind: 'offense', card: card('defender-melee', 2, 'melee', 300) }
      ]
    });

    expect(result.outcome).toBe('offense-attacker-wins');
    expect(result.initialAttackPower).toBe(1_000);
    expect(result.destroyedCardIds).toEqual(['defender-defense', 'defender-melee']);
    expect(result.hpDamage).toBe(400);
    expect(result.hpDamageTarget).toBe(2);
    expect(result.soulAwards).toEqual([
      { playerId: 2, amount: 1 },
      { playerId: 2, amount: 1 }
    ]);
    expect(result.exchanges.map((exchange) => [exchange.kind, exchange.outcome])).toEqual([
      ['defense', 'destroyed'],
      ['offense', 'attacker-wins']
    ]);
  });

  it('applies remaining attack directly when defense is destroyed and no offense remains', () => {
    const result = resolveColumnAttack({
      attackingCards: [card('attacker', 1, 'melee', 700)],
      defenderPlayerId: 2,
      targets: [{ kind: 'defense', card: card('defender', 2, 'melee', 0, 300) }]
    });

    expect(result.outcome).toBe('direct-damage');
    expect(result.remainingAttack).toBe(400);
    expect(result.hpDamage).toBe(400);
    expect(result.hpDamageTarget).toBe(2);
  });
});