import { validateOfficialDeckComposition, type CardCatalog } from '@souls/game-content';
import { DECK_SIZE, type CardDefinition, type CardDefinitionId, type PlayerId } from '@souls/game-core';
import type { AgentStrategy, DeckDistribution, DeckFixture, DeckProfile, LevelCounter } from './types.js';

type NamedCardCount = readonly [name: string, quantity: number];

const compositions: Readonly<Record<DeckProfile, readonly NamedCardCount[]>> = {
  balanced: [
    ['Cavaleiro', 3], ['Arqueiro', 2], ['Defensor', 2], ['Mago', 1], ['Escudeiro das Cinzas', 1], ['Batedora do Breu', 1],
    ['Cavaleiro Negro', 1], ['Acólito da Névoa', 1], ['Vigia da Capela', 1], ['Lanceiro de Ferro', 1],
    ['Guardião das Correntes', 1], ['Caçadora da Lua Pálida', 1], ['Tecelão de Almas', 1],
    ['Paladino da Última Vigília', 1], ['Matriarca dos Selos', 1], ['Rei Exilado', 1]
  ],
  aggressive: [
    ['Cavaleiro', 4], ['Arqueiro', 3], ['Batedora do Breu', 1], ['Mago', 1], ['Escudeiro das Cinzas', 1],
    ['Carrasco Errante', 2], ['Lanceiro de Ferro', 1], ['Cavaleiro Negro', 1],
    ['Espadachim do Eclipse', 1], ['Caçadora da Lua Pálida', 1], ['Guardião das Correntes', 1],
    ['Duelista do Abismo', 1], ['Feiticeira da Ruptura', 1], ['Rei Exilado', 1]
  ],
  defensive: [
    ['Defensor', 4], ['Guardião das Ruínas', 3], ['Cavaleiro', 2], ['Escudeiro das Cinzas', 1],
    ['Vigia da Capela', 2], ['Lanceiro de Ferro', 1], ['Cavaleiro Negro', 1],
    ['Sentinela do Sepulcro', 2], ['Guardião das Correntes', 1],
    ['Paladino da Última Vigília', 1], ['Sentinela da Catedral', 1], ['Colosso do Crepúsculo', 1]
  ],
  'low-cost': [
    ['Cavaleiro', 3], ['Arqueiro', 2], ['Mago', 2], ['Batedora do Breu', 2], ['Defensor', 1],
    ['Arqueira do Crepúsculo', 2], ['Cavaleiro Negro', 1], ['Lanceiro de Ferro', 1],
    ['Caçadora da Lua Pálida', 2], ['Espadachim do Eclipse', 1],
    ['Matriarca dos Selos', 1], ['Feiticeira da Ruptura', 1], ['Arcanista do Fim', 1]
  ],
  'high-cost': [
    ['Cavaleiro', 2], ['Arqueiro', 2], ['Defensor', 2], ['Escudeiro das Cinzas', 2], ['Batedora do Breu', 1], ['Mago', 1],
    ['Carrasco Errante', 1], ['Vigia da Capela', 1], ['Lanceiro de Ferro', 1], ['Cavaleiro Negro', 1],
    ['Guardião das Correntes', 1], ['Tecelão de Almas', 1], ['Sentinela do Sepulcro', 1],
    ['Duelista do Abismo', 1], ['Paladino da Última Vigília', 1], ['Rei Exilado', 1]
  ],
  'combined-attack': [
    ['Cavaleiro', 2], ['Arqueiro', 3], ['Defensor', 1], ['Mago', 1], ['Escudeiro das Cinzas', 1], ['Batedora do Breu', 2],
    ['Carrasco Errante', 1], ['Arqueira do Crepúsculo', 1], ['Cavaleiro Negro', 1], ['Lanceiro de Ferro', 1],
    ['Espadachim do Eclipse', 1], ['Caçadora da Lua Pálida', 1], ['Tecelão de Almas', 1],
    ['Feiticeira da Ruptura', 1], ['Sentinela da Catedral', 1], ['Arcanista do Fim', 1]
  ],
  'random-legal': [
    ['Cavaleiro', 3], ['Arqueiro', 2], ['Defensor', 2], ['Mago', 1], ['Escudeiro das Cinzas', 1], ['Batedora do Breu', 1],
    ['Cavaleiro Negro', 1], ['Arqueira do Crepúsculo', 1], ['Vigia da Capela', 1], ['Lanceiro de Ferro', 1],
    ['Guardião das Correntes', 1], ['Caçadora da Lua Pálida', 1], ['Tecelão de Almas', 1],
    ['Paladino da Última Vigília', 1], ['Matriarca dos Selos', 1], ['Rei Exilado', 1]
  ],
  'expensive-negative': []
};

function expensiveComposition(catalog: CardCatalog): CardDefinitionId[] {
  const selected = [...catalog.definitions]
    .sort((left, right) => right.level - left.level || right.attack - left.attack)
    .slice(0, 5);
  return Array.from({ length: DECK_SIZE }, (_, index) => selected[index % selected.length]!.id);
}

function resolveComposition(catalog: CardCatalog, profile: DeckProfile): CardDefinitionId[] {
  if (profile === 'expensive-negative') return expensiveComposition(catalog);

  const byName = new Map(catalog.definitions.map((definition) => [definition.name, definition.id] as const));
  const cards = compositions[profile].flatMap(([name, quantity]) => {
    const id = byName.get(name);
    if (id === undefined) throw new Error(`A carta "${name}" não existe no catálogo.`);
    return Array.from({ length: quantity }, () => id);
  });

  if (cards.length !== DECK_SIZE) {
    throw new Error(`O baralho ${profile} deve ter exatamente ${DECK_SIZE} cartas, mas tem ${cards.length}.`);
  }

  return cards;
}

export function createDeckFixture(catalog: CardCatalog, strategy: AgentStrategy, profile: DeckProfile = strategy): DeckFixture {
  return {
    name: `Laboratório · ${profile}`,
    profile,
    cards: resolveComposition(catalog, profile)
  };
}

export function createNegativeDeckFixture(catalog: CardCatalog): DeckFixture {
  return createDeckFixture(catalog, 'aggressive', 'expensive-negative');
}

function emptyLevels(): LevelCounter {
  return { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
}

export function analyzeDeckFixture(
  playerId: PlayerId,
  fixture: DeckFixture,
  catalogDefinitions: Readonly<Record<CardDefinitionId, CardDefinition>>
): DeckDistribution {
  const byLevel = emptyLevels();
  const byType = { melee: 0, ranged: 0 } as Record<'melee' | 'ranged', number>;
  const validationErrors: string[] = [];
  const knownDefinitionIds = new Set<string>();

  if (fixture.cards.length !== DECK_SIZE) {
    validationErrors.push(`${fixture.name} tem ${fixture.cards.length} cartas; o regulamento exige ${DECK_SIZE}.`);
  }

  for (const cardDefinitionId of fixture.cards) {
    const definition = catalogDefinitions[cardDefinitionId];
    if (definition === undefined) {
      validationErrors.push(`A definição ${cardDefinitionId} não existe no catálogo.`);
      continue;
    }
    knownDefinitionIds.add(definition.id);
    byLevel[definition.level] += 1;
    byType[definition.type] += 1;
  }

  const official = validateOfficialDeckComposition(fixture.cards, catalogDefinitions, fixture.name);
  validationErrors.push(...official.errors);

  const freeCards = byLevel[0];
  const missingDefinitionNames = Object.values(catalogDefinitions)
    .filter((definition) => !knownDefinitionIds.has(definition.id))
    .map((definition) => definition.name)
    .sort((left, right) => left.localeCompare(right, 'pt-PT'));
  return {
    playerId,
    name: fixture.name,
    profile: fixture.profile,
    totalCards: fixture.cards.length,
    valid: validationErrors.length === 0,
    practicalToStart: freeCards > 0,
    validationErrors,
    byLevel,
    byType,
    definitionsPresent: knownDefinitionIds.size,
    definitionsMissing: Object.keys(catalogDefinitions).length - knownDefinitionIds.size,
    freeCards,
    missingDefinitionNames
  };
}

export function assertOfficialDeckFixtures(
  fixtures: readonly DeckFixture[],
  catalogDefinitions: Readonly<Record<CardDefinitionId, CardDefinition>>
): void {
  const invalid = fixtures.map((fixture, index) => ({
    fixture,
    playerId: index + 1,
    validation: analyzeDeckFixture(index + 1 as PlayerId, fixture, catalogDefinitions)
  })).filter((entry) => !entry.validation.valid);

  if (invalid.length === 0) return;

  const details = invalid.map((entry) => {
    const distribution = entry.validation.byLevel;
    return 'J' + entry.playerId + ' (' + entry.fixture.name + '): encontrado N0=' + distribution[0] + ', N1=' + distribution[1] + ', N2=' + distribution[2] + ', N3=' + distribution[3] + ', N4=' + distribution[4] + '; esperado N0=10, N1=4, N2=3, N3=2, N4=1; regras: ' + entry.validation.validationErrors.join(' ');
  }).join(' | ');
  throw new Error('A partida do Balance Lab foi rejeitada antes de começar porque existem baralhos inválidos. ' + details);
}
