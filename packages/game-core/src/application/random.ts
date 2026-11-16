export interface RandomSource {
  next(): number;
}

export interface UuidGenerator {
  next(): string;
}

interface RuntimeCrypto {
  randomUUID?: () => string;
}

export const systemRandomSource: RandomSource = {
  next: () => Math.random()
};

export const systemUuidGenerator: UuidGenerator = {
  next: () => {
    const runtimeCrypto = (globalThis as typeof globalThis & { readonly crypto?: RuntimeCrypto }).crypto;

    if (runtimeCrypto?.randomUUID === undefined) {
      throw new Error('The current runtime does not provide crypto.randomUUID().');
    }

    return runtimeCrypto.randomUUID();
  }
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

function assertRandomValue(value: number): void {
  if (!Number.isFinite(value) || value < 0 || value >= 1) {
    throw new RangeError('RandomSource.next() must return a number in the interval [0, 1).');
  }
}

export function shuffle<T>(items: readonly T[], random: RandomSource): T[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomValue = random.next();
    assertRandomValue(randomValue);
    const swapIndex = Math.floor(randomValue * (index + 1));
    const current = shuffled[index];
    const replacement = shuffled[swapIndex];

    if (current === undefined || replacement === undefined) {
      throw new RangeError('Cannot shuffle an invalid collection.');
    }

    shuffled[index] = replacement;
    shuffled[swapIndex] = current;
  }

  return shuffled;
}