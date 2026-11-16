# Deck Builder

## Validação oficial

Um baralho pronto para uma partida tem exatamente 20 cartas com a distribuição fixa:

~~~text
N0 = 10 · N1 = 4 · N2 = 3 · N3 = 2 · N4 = 1
~~~

O contrato partilhado em packages/game-content/src/validators/officialDeck.ts é a fonte usada pelo Deck Builder e pelo Balance Lab. Rascunhos incompletos podem ser guardados, mas a preparação do PvP Local não permite iniciar uma partida enquanto a distribuição não for válida.

O Deck Builder vive em [apps/web/src/features/decks](../apps/web/src/features/decks) e separa três responsabilidades:

- o catálogo oficial, carregado por `loadBrowserCardCatalog`;
- a disponibilidade de protótipo, fornecida por `prototypeCollectionProvider`;
- baralhos guardados, persistidos localmente em `souls.saved-decks.v1`.

Um `SavedDeck` guarda apenas o seu ID, nome, datas e entradas `{ cardDefinitionId, quantity }`. Não guarda atributos, imagens ou `CardInstanceId`. A validação central está em `deckValidation.ts` e exige exatamente 20 cartas para um baralho utilizável; não inventa um limite de cópias.

O ecrã [DeckBuilderPage](../apps/web/src/features/decks/presentation/DeckBuilderPage.tsx) permite pesquisar, filtrar, ordenar, adicionar/remover quantidades, guardar, duplicar e eliminar baralhos. As estatísticas são calculadas com as quantidades reais: níveis, tipos, facções, ATK/DEF médios e custo teórico em Souls.

O ecrã [DeckPreparationScreen](../apps/web/src/features/decks/presentation/DeckPreparationScreen.tsx) permite aos dois jogadores locais escolherem baralhos válidos. A partida recebe uma cópia dos 20 `CardDefinitionId` e o `game-core` cria novas instâncias normalmente. Alterar um baralho guardado não altera uma partida já iniciada.

## Evolução para coleção

`CardCollectionProvider` é a fronteira de disponibilidade. O provider atual disponibiliza todas as definições apenas para o protótipo. Uma futura coleção poderá substituir esse provider sem alterar a galeria ou a validação de baralhos.

Não existe ainda loja, carteira económica, preços ou recompensas. Souls continuam a ser exclusivamente o recurso de combate definido no regulamento v0.7.
