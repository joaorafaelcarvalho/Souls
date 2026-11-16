import type { PlayerId, RandomSource, UuidGenerator } from '@souls/game-core';

export function createSeededRandom(seed: number): RandomSource {
  let value = seed >>> 0;
  return {
    next: () => {
      value = (value + 0x6D2B79F5) >>> 0;
      let t = value;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
  };
}

/**
 * Uses the first random draw only for the official first-player coin toss,
 * then continues with the same seeded stream for shuffling. This keeps paired
 * runs reproducible while allowing the priority to be inverted deliberately.
 */
export function createSimulationRandom(seed: number, firstPlayerId?: PlayerId): RandomSource {
  const seeded = createSeededRandom(seed);
  let firstDraw = true;
  return {
    next: () => {
      if (firstDraw && firstPlayerId !== undefined) {
        firstDraw = false;
        return firstPlayerId === 1 ? 0 : 0.999999999;
      }
      firstDraw = false;
      return seeded.next();
    }
  };
}

export function createDeterministicUuidGenerator(): UuidGenerator {
  let counter = 1;
  return {
    next: () => {
      const tail = counter.toString(16).padStart(12, '0');
      counter += 1;
      return `00000000-0000-4000-8000-${tail}`;
    }
  };
}
