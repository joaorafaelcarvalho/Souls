import { initializeGame } from '@souls/game-core';
import { describe, expect, it } from 'vitest';
import { createAiObservation } from './observation.js';

const definitions = [
  { id: '00000000-0000-4000-8000-000000000001', name: 'Melee', level: 0 as const, type: 'melee' as const, attack: 500, defense: 500, image: '' },
  { id: '00000000-0000-4000-8000-000000000002', name: 'Ranged', level: 0 as const, type: 'ranged' as const, attack: 500, defense: 0, image: '' }
];

function fixtureState() {
  let uuid = 10;
  return initializeGame({
    cardDefinitions: definitions,
    players: [
      { id: 1, deck: Array.from({ length: 20 }, () => definitions[0]!.id) },
      { id: 2, deck: Array.from({ length: 20 }, () => definitions[1]!.id) }
    ],
    random: { next: () => 0 },
    uuidGenerator: { next: () => '00000000-0000-4000-8000-' + String(uuid++).padStart(12, '0') }
  });
}

describe('game-ai sanitized observation', () => {
  it('exposes own hand and public board without exposing the opponent hand', () => {
    const observation = createAiObservation(fixtureState(), 2);

    expect(observation.ownHand.every((card) => card.ownerId === 2)).toBe(true);
    expect(observation.boardCards).toHaveLength(0);
    expect(JSON.stringify(observation)).not.toContain('cardInstances');
    expect(JSON.stringify(observation)).not.toContain('deck');
  });
});
