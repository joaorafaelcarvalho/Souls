import type { RandomSource } from '@souls/game-core';

export function createAiRandom(seed: number): RandomSource {
  let state = (seed >>> 0) || 1;
  return {
    next: () => {
      state = (state * 1_664_525 + 1_013_904_223) >>> 0;
      return state / 4_294_967_296;
    }
  };
}
