import { loadBrowserCardCatalog, validateOfficialDeckReferences } from '@souls/game-content';
import {
  initializeGame,
  type GameState,
  type RandomSource
} from '@souls/game-core';
import type { PlayerDeckPair } from '../features/decks/application/deckTypes';

const fixedRandom: RandomSource = {
  next: () => 0
};

const technicalDemoNames = new Set([
  'Cavaleiro', 'Arqueiro', 'Defensor', 'Mago', 'Escudeiro das Cinzas', 'Batedora do Breu',
  'Cavaleiro Negro', 'Arqueira do Crepúsculo', 'Vigia da Capela', 'Lanceiro de Ferro',
  'Guardião das Correntes', 'Caçadora da Lua Pálida', 'Tecelão de Almas',
  'Paladino da Última Vigília', 'Matriarca dos Selos', 'Rei Exilado'
]);

/**
 * Valores e cartas exclusivos do protótipo local. Não representam balanceamento aprovado.
 */
export function createDemoGame(random: RandomSource = fixedRandom, playerDecks?: PlayerDeckPair): GameState {
  const catalog = loadBrowserCardCatalog();
  const originalTechnicalDefinitions = new Map(catalog.definitions.filter((definition) => technicalDemoNames.has(definition.name)).map((definition) => [definition.name, definition.id] as const));
  const demoNames = [
    'Cavaleiro', 'Cavaleiro', 'Cavaleiro', 'Arqueiro', 'Arqueiro', 'Defensor', 'Defensor', 'Mago', 'Escudeiro das Cinzas', 'Batedora do Breu',
    'Cavaleiro Negro', 'Arqueira do Crepúsculo', 'Vigia da Capela', 'Lanceiro de Ferro',
    'Guardião das Correntes', 'Caçadora da Lua Pálida', 'Tecelão de Almas',
    'Paladino da Última Vigília', 'Matriarca dos Selos', 'Rei Exilado'
  ];
  const demoDeck = validateOfficialDeckReferences(
    demoNames.map((name) => originalTechnicalDefinitions.get(name)),
    catalog,
    'technical-demo-deck'
  );
  const decks: PlayerDeckPair = playerDecks === undefined
    ? [demoDeck, [...demoDeck]]
    : [
        validateOfficialDeckReferences(playerDecks[0], catalog, 'player-one-saved-deck'),
        validateOfficialDeckReferences(playerDecks[1], catalog, 'player-two-saved-deck')
      ];

  return initializeGame({
    cardDefinitions: catalog.definitions,
    players: [
      { id: 1, deck: decks[0] },
      { id: 2, deck: decks[1] }
    ],
    random
  });
}
