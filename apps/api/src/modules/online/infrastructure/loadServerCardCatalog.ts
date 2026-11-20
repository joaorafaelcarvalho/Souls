import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { loadCatalogFromEntries, type CardCatalog, type CatalogModule } from '@souls/game-content';

const cardsDirectory = new URL('../../../../../../packages/game-content/cards/', import.meta.url);

function collectJsonEntries(directory: string, entries: Record<string, CatalogModule>): void {
  for (const item of readdirSync(directory, { withFileTypes: true })) {
    const path = `${directory}/${item.name}`;
    if (item.isDirectory()) {
      collectJsonEntries(path, entries);
      continue;
    }

    if (item.isFile() && item.name.endsWith('.json')) {
      entries[path] = JSON.parse(readFileSync(path, 'utf8')) as CatalogModule;
    }
  }
}

export function loadServerCardCatalog(): CardCatalog {
  const entries: Record<string, CatalogModule> = {};
  collectJsonEntries(fileURLToPath(cardsDirectory), entries);
  return loadCatalogFromEntries(entries);
}
