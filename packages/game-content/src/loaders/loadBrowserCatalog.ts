import type { CatalogModule } from './loadCatalog.js';
import { loadCatalogFromEntries } from './loadCatalog.js';
import type { CardCatalog } from '../catalog/types.js';

export function loadBrowserCardCatalog(): CardCatalog {
  const entries = import.meta.glob<CatalogModule>('../../cards/**/*.json', {
    eager: true
  });

  return loadCatalogFromEntries(entries);
}