# SOULS — Card Expansion v1

## Objetivo

Esta expansão acrescenta 20 definições ao catálogo oficial, passando de 5 para 25 cartas. Não altera o game-core, o regulamento v0.7, o limite de 20 cartas por baralho ou qualquer fórmula de combate.

## Novas definições

| Carta | Tipo | Nível | ATK | DEF | Souls |
| --- | --- | ---: | ---: | ---: | ---: |
| Escudeiro das Cinzas | melee | 0 | 300 | 700 | 0 |
| Batedora do Breu | ranged | 0 | 400 | 0 | 0 |
| Guardião das Ruínas | melee | 0 | 200 | 900 | 0 |
| Lanceiro de Ferro | melee | 1 | 800 | 400 | 1 |
| Vigia da Capela | melee | 1 | 350 | 1250 | 1 |
| Arqueira do Crepúsculo | ranged | 1 | 750 | 0 | 1 |
| Acólito da Névoa | ranged | 1 | 800 | 0 | 1 |
| Carrasco Errante | melee | 1 | 900 | 300 | 1 |
| Espadachim do Eclipse | melee | 2 | 1050 | 700 | 2 |
| Sentinela do Sepulcro | melee | 2 | 300 | 1550 | 2 |
| Caçadora da Lua Pálida | ranged | 2 | 1100 | 0 | 2 |
| Tecelão de Almas | ranged | 2 | 1000 | 0 | 2 |
| Guardião das Correntes | melee | 2 | 800 | 1200 | 2 |
| Duelista do Abismo | melee | 3 | 1500 | 550 | 3 |
| Paladino da Última Vigília | melee | 3 | 1100 | 1650 | 3 |
| Feiticeira da Ruptura | ranged | 3 | 1450 | 0 | 3 |
| Sentinela da Catedral | melee | 3 | 350 | 1950 | 3 |
| Rei Exilado | melee | 4 | 1900 | 1050 | 4 |
| Arcanista do Fim | ranged | 4 | 1750 | 0 | 4 |
| Colosso do Crepúsculo | melee | 4 | 500 | 2350 | 4 |

Os UUIDs permanentes estão guardados nos JSONs em [packages/game-content/cards](../packages/game-content/cards). As novas cartas usam o placeholder comum [card-placeholder.svg](../apps/web/public/images/cards/card-placeholder.svg); nenhuma ilustração definitiva foi gerada.

## Integração

O carregador baseado em `import.meta.glob` descobre automaticamente as novas definições. O [CodexPage](../apps/web/src/features/codex/presentation/CodexPage.tsx) apresenta estas cartas e adições narrativas posteriores sem lista paralela. As regras de custo continuam centralizadas em [game-core](../packages/game-core/src/application/resources.ts).

O baralho técnico do protótipo normal continua a usar apenas as cinco cartas originais para preservar os testes e a experiência existente. As novas definições podem ser referenciadas em qualquer baralho válido de 20 cartas.

## Nota sobre o catálogo original

O ficheiro original de `Cavaleiro Negro` no repositório tem nível 1. Esta expansão não o altera; o valor atual foi preservado como parte da compatibilidade existente.

## Limitações

- As novas cartas ainda não têm ilustrações individuais nem lore canónico.
- Não foram adicionadas habilidades especiais, facções ou raridades.
- O equilíbrio foi validado por integridade de dados e cenários técnicos, não por partidas reais com jogadores.
