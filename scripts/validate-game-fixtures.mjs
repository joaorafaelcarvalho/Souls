import { deepStrictEqual } from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveColumnAttack } from '@souls/game-core';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const fixturesDirectory = resolve(scriptDirectory, '../tests/game-fixtures');

function fixtureFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return fixtureFiles(path);
    return entry.name.endsWith('.json') ? [path] : [];
  });
}

function serializable(value) {
  return JSON.parse(JSON.stringify(value));
}

const files = fixtureFiles(fixturesDirectory).sort();
let validated = 0;

for (const file of files) {
  const fixture = JSON.parse(readFileSync(file, 'utf8'));
  if (fixture.schemaVersion !== 1 || fixture.kind !== 'combat-column') continue;

  const actual = serializable(resolveColumnAttack(fixture.input));
  deepStrictEqual(actual, fixture.expected, fixture.id);
  validated += 1;
}

if (validated === 0) {
  throw new Error('No supported game fixtures were found.');
}

globalThis.console.log(`Validated ${validated} portable game fixture(s).`);
