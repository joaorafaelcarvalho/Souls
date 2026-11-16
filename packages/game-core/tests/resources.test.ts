import { describe, expect, it } from 'vitest';
import {
  addSouls,
  resolveFailedDrawPenalty,
  spendSouls,
  summonCost
} from '../src/index.js';

describe('resource rules', () => {
  it('uses the card level as its summon cost', () => {
    expect(summonCost(0)).toBe(0);
    expect(summonCost(4)).toBe(4);
  });

  it('caps souls at five', () => {
    expect(addSouls(4, 3)).toBe(5);
    expect(addSouls(0, 1)).toBe(1);
  });

  it('spends souls only when the player can afford the cost', () => {
    expect(spendSouls(3, 2)).toBe(1);
    expect(spendSouls(1, 2)).toBeNull();
  });

  it('consumes one soul for a failed draw when available', () => {
    expect(resolveFailedDrawPenalty(2)).toEqual({
      soulsAfter: 1,
      hpDamage: 0,
      consumedSoul: true
    });
  });

  it('deals the failed-draw HP penalty when no soul is available', () => {
    expect(resolveFailedDrawPenalty(0)).toEqual({
      soulsAfter: 0,
      hpDamage: 500,
      consumedSoul: false
    });
  });

});
