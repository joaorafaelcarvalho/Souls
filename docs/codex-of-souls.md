# Codex of Souls v1

O [CodexPage](../apps/web/src/features/codex/presentation/CodexPage.tsx) é um ecrã independente aberto pelo botão `CÓDICE DAS ALMAS` do menu principal.

## Fonte de dados

O Códice chama [loadBrowserCardCatalog](../packages/game-content/src/loaders/loadBrowserCatalog.ts) e usa apenas `CardDefinition`. Não lê mãos, instâncias ou estados de partidas. Uma nova definição válida do catálogo aparece automaticamente na galeria.

## Funcionalidades

- galeria com a variante de carta 2:3 existente;
- pesquisa por nome com normalização de acentos;
- filtros `Todas`, `Melee`, `Ranged` e níveis oficiais;
- ordenação por nome, ATK, DEF e nível;
- seleção persistente enquanto a carta permanece nos resultados;
- detalhes oficiais de tipo, nível, ATK, DEF e custo em Souls;
- lore narrativo separado dos atributos de combate;
- navegação entre cartas e cinco facções de Vespera;
- filtro por facção e pesquisa por epíteto/descrição/facção;
- estado vazio e botão para limpar filtros;
- navegação de volta ao menu sem tocar em partidas.

As facções e histórias v1 são conteúdo narrativo sem impacto mecânico. Raridades, coleção, deck builder e progresso de desbloqueio não são criados nesta versão. A Bíblia narrativa está em [docs/lore](./lore/world.md).
