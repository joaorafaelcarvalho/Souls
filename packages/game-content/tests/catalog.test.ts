import { describe, expect, it } from 'vitest';
import {
  CatalogValidationError,
  loadBrowserCardCatalog,
  loadCatalogFromEntries,
  validateCardCatalog,
  validateCardDefinition,
  validateDeckReferences
} from '../src/index.js';

const validDefinition = {
  id: '6b5a3a87-3e1c-4d4f-9a25-0b2c1d4e5f60',
  name: 'Exemplo técnico',
  level: 0,
  type: 'melee',
  attack: 100,
  defense: 100,
  image: '/images/cards/melee/example.svg'
};

const validDeck = Array.from({ length: 20 }, () => validDefinition.id);

describe('card content catalog', () => {
  it('contains the five original cards, the expansion cards and the Matriarch addition', () => {
    const catalog = loadBrowserCardCatalog();
    const cardsByName = Object.fromEntries(
      catalog.definitions.map((definition) => [definition.name, definition])
    );

    expect(catalog.definitions).toHaveLength(26);
    expect(Object.keys(cardsByName).sort()).toEqual([
      'Acólito da Névoa',
      'Arqueiro',
      'Arqueira do Crepúsculo',
      'Arcanista do Fim',
      'Batedora do Breu',
      'Cavaleiro',
      'Cavaleiro Negro',
      'Caçadora da Lua Pálida',
      'Carrasco Errante',
      'Colosso do Crepúsculo',
      'Duelista do Abismo',
      'Defensor',
      'Escudeiro das Cinzas',
      'Espadachim do Eclipse',
      'Feiticeira da Ruptura',
      'Guardião das Correntes',
      'Guardião das Ruínas',
      'Lanceiro de Ferro',
      'Mago',
      'Matriarca dos Selos',
      'Paladino da Última Vigília',
      'Rei Exilado',
      'Sentinela da Catedral',
      'Sentinela do Sepulcro',
      'Tecelão de Almas',
      'Vigia da Capela'
    ].sort());
    expect(cardsByName.Cavaleiro).toMatchObject({ level: 0, type: 'melee', attack: 500, defense: 500 });
    expect(cardsByName.Arqueiro).toMatchObject({ level: 0, type: 'ranged', attack: 500, defense: 0 });
    expect(cardsByName.Defensor).toMatchObject({ level: 0, type: 'melee', attack: 0, defense: 1000 });
    expect(cardsByName.Mago).toMatchObject({ level: 0, type: 'ranged', attack: 500, defense: 0 });
    expect(cardsByName['Cavaleiro Negro']).toMatchObject({ level: 1, type: 'melee', attack: 700, defense: 500 });
    expect(cardsByName.Cavaleiro.image).toBe('/images/cards/melee/cavaleiro.png');
    expect(cardsByName.Arqueiro.image).toBe('/images/cards/ranged/arqueiro.png');
    expect(cardsByName.Defensor.image).toBe('/images/cards/melee/defensor.png');
    expect(cardsByName.Mago.image).toBe('/images/cards/ranged/mago.png');
    expect(cardsByName['Cavaleiro Negro'].image).toBe('/images/cards/melee/cavaleiro-negro.png');
    expect(cardsByName['Escudeiro das Cinzas']).toMatchObject({ level: 0, type: 'melee', attack: 300, defense: 700 });
    expect(cardsByName['Batedora do Breu']).toMatchObject({ level: 0, type: 'ranged', attack: 400, defense: 0 });
    expect(cardsByName['Guardião das Ruínas']).toMatchObject({ level: 0, type: 'melee', attack: 200, defense: 900 });
    expect(cardsByName['Lanceiro de Ferro']).toMatchObject({ level: 1, type: 'melee', attack: 800, defense: 400 });
    expect(cardsByName['Vigia da Capela']).toMatchObject({ level: 1, type: 'melee', attack: 350, defense: 1250 });
    expect(cardsByName['Arqueira do Crepúsculo']).toMatchObject({ level: 1, type: 'ranged', attack: 750, defense: 0 });
    expect(cardsByName['Acólito da Névoa']).toMatchObject({ level: 1, type: 'ranged', attack: 800, defense: 0 });
    expect(cardsByName['Carrasco Errante']).toMatchObject({ level: 1, type: 'melee', attack: 900, defense: 300 });
    expect(cardsByName['Espadachim do Eclipse']).toMatchObject({ level: 2, type: 'melee', attack: 1150, defense: 750 });
    expect(cardsByName['Sentinela do Sepulcro']).toMatchObject({ level: 2, type: 'melee', attack: 300, defense: 1550 });
    expect(cardsByName['Caçadora da Lua Pálida']).toMatchObject({ level: 2, type: 'ranged', attack: 1100, defense: 0 });
    expect(cardsByName['Tecelão de Almas']).toMatchObject({ level: 2, type: 'ranged', attack: 1000, defense: 0 });
    expect(cardsByName['Guardião das Correntes']).toMatchObject({ level: 2, type: 'melee', attack: 800, defense: 1200 });
    expect(cardsByName['Duelista do Abismo']).toMatchObject({ level: 3, type: 'melee', attack: 1700, defense: 600 });
    expect(cardsByName['Paladino da Última Vigília']).toMatchObject({ level: 3, type: 'melee', attack: 1100, defense: 1650 });
    expect(cardsByName['Feiticeira da Ruptura']).toMatchObject({ level: 3, type: 'ranged', attack: 1450, defense: 0 });
    expect(cardsByName['Sentinela da Catedral']).toMatchObject({ level: 3, type: 'melee', attack: 350, defense: 1950 });
    expect(cardsByName['Rei Exilado']).toMatchObject({ level: 4, type: 'melee', attack: 2200, defense: 1150 });
    expect(cardsByName['Arcanista do Fim']).toMatchObject({ level: 4, type: 'ranged', attack: 2050, defense: 0 });
    expect(cardsByName['Colosso do Crepúsculo']).toMatchObject({ level: 4, type: 'melee', attack: 500, defense: 2350 });
    expect(cardsByName['Matriarca dos Selos']).toMatchObject({ level: 3, type: 'ranged', attack: 1600, defense: 0, image: '/images/cards/ranged/matriarca-dos-selos.png' });
    expect(new Set(catalog.definitions.map((definition) => definition.id)).size).toBe(26);
  });

  it('validates and indexes definitions by UUID', () => {
    const catalog = validateCardCatalog([validDefinition]);

    expect(catalog.definitions).toHaveLength(1);
    expect(catalog.byId[validDefinition.id]?.name).toBe('Exemplo técnico');
  });

  it('discovers entry modules without a manual import list', () => {
    const catalog = loadCatalogFromEntries({
      'cards/melee/example.json': { default: validDefinition }
    });

    expect(catalog.byId[validDefinition.id]?.type).toBe('melee');
  });

  it('rejects invalid UUIDs, fields and image references', () => {
    expect(() => validateCardDefinition({ ...validDefinition, id: 'melee-card' })).toThrowError(CatalogValidationError);
    expect(() => validateCardDefinition({ ...validDefinition, level: 5 })).toThrowError(/level/);
    expect(() => validateCardDefinition({ ...validDefinition, image: 'card.png' })).toThrowError(/image/);
  });

  it('rejects duplicate UUIDs', () => {
    expect(() => validateCardCatalog([validDefinition, validDefinition])).toThrowError(/Duplicate card definition UUID/);
  });

  it('validates deck length and references against the catalog', () => {
    const catalog = validateCardCatalog([validDefinition]);

    expect(validateDeckReferences(validDeck, catalog)).toHaveLength(20);
    expect(() => validateDeckReferences([], catalog)).toThrowError(/exactly 20/);
    expect(() => validateDeckReferences([...validDeck.slice(0, 19), 'missing-id'], catalog)).toThrowError(/not found/);
  });
});
