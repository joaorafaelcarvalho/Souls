import type { CardDefinition } from '@souls/game-core';
import { CatalogValidationError } from './errors.js';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const IMAGE_REFERENCE_PATTERN = /^\/images\/cards\/[a-z0-9/_-]+\.(?:png|jpe?g|webp|svg)$/i;
const CARD_TYPES = new Set<CardDefinition['type']>(['melee', 'ranged']);

function fail(source: string, message: string): never {
  throw new CatalogValidationError(`${source}: ${message}`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function requiredString(record: Record<string, unknown>, field: string, source: string): string {
  const value = record[field];

  if (typeof value !== 'string' || value.trim() === '') {
    fail(source, `field "${field}" must be a non-empty string`);
  }

  return value;
}

function requiredNumber(record: Record<string, unknown>, field: string, source: string): number {
  const value = record[field];

  if (typeof value !== 'number' || !Number.isFinite(value)) {
    fail(source, `field "${field}" must be a finite number`);
  }

  return value;
}

export function validateCardDefinition(input: unknown, source = 'card definition'): CardDefinition {
  if (!isRecord(input)) {
    fail(source, 'must be a JSON object');
  }

  const id = requiredString(input, 'id', source);
  const name = requiredString(input, 'name', source);
  const image = requiredString(input, 'image', source);
  const level = requiredNumber(input, 'level', source);
  const attack = requiredNumber(input, 'attack', source);
  const defense = requiredNumber(input, 'defense', source);
  const type = requiredString(input, 'type', source);

  if (!UUID_PATTERN.test(id)) {
    fail(source, `field "id" must be a valid UUID: "${id}"`);
  }

  if (!CARD_TYPES.has(type as CardDefinition['type'])) {
    fail(source, `field "type" must be "melee" or "ranged"`);
  }

  if (!Number.isInteger(level) || level < 0 || level > 4) {
    fail(source, 'field "level" must be an integer between 0 and 4');
  }

  if (attack < 0 || defense < 0) {
    fail(source, 'fields "attack" and "defense" cannot be negative');
  }

  if (!IMAGE_REFERENCE_PATTERN.test(image)) {
    fail(source, 'field "image" must reference /images/cards with a supported image extension');
  }

  return {
    id,
    name,
    level: level as CardDefinition['level'],
    type: type as CardDefinition['type'],
    attack,
    defense,
    image
  };
}