import type { CardCatalog } from '@souls/game-content';
import type { CardDefinitionId } from '@souls/game-core';
import type { PlayerCardOwnership } from './deckTypes';

export interface CardCollectionProvider {
  readonly getOwnership: (catalog: CardCatalog) => readonly PlayerCardOwnership[];
  readonly canUse: (cardDefinitionId: CardDefinitionId, quantity: number, catalog: CardCatalog) => boolean;
}

/**
 * Development provider: every catalogued definition is available while the
 * persistent collection/economy is not part of the prototype yet.
 */
export const prototypeCollectionProvider: CardCollectionProvider = {
  getOwnership: (catalog) => catalog.definitions.map((definition) => ({ cardDefinitionId: definition.id, quantity: Number.MAX_SAFE_INTEGER })),
  canUse: (cardDefinitionId, quantity, catalog) => quantity >= 0 && catalog.byId[cardDefinitionId] !== undefined
};
