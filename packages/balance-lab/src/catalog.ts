import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCardCatalog, loadLoreCatalog, validateCardDefinition, type CardCatalog, type LoreCatalog } from '@souls/game-content';
import type { CardDefinition } from '@souls/game-core';

function findCardsDirectory(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  const candidates = [resolve(here, '../../game-content/cards'), resolve(here, '../game-content/cards')];
  const selected = candidates.find((candidate) => {
    try {
      return readdirSync(candidate).length > 0;
    } catch {
      return false;
    }
  });

  if (selected === undefined) throw new Error('Não foi possível localizar packages/game-content/cards.');
  return selected;
}

export function loadNodeCardCatalog(): CardCatalog {
  const cardsDirectory = findCardsDirectory();
  const definitions: CardDefinition[] = [];

  for (const category of ['melee', 'ranged']) {
    const directory = join(cardsDirectory, category);
    for (const filename of readdirSync(directory).filter((entry) => entry.endsWith('.json')).sort()) {
      const source = join(directory, filename);
      definitions.push(validateCardDefinition(JSON.parse(readFileSync(source, 'utf8')), source));
    }
  }

  return createCardCatalog(definitions);
}

export function loadNodeLoreCatalog(): LoreCatalog {
  return loadLoreCatalog();
}
