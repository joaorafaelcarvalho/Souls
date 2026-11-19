# Testes e verificações

## Estratégia

Os testes concentram risco onde existe comportamento real:

- game-core: regras, validação de colocação, instâncias, progressão e transformações imutáveis;
- game-content: catálogo e validação;
- API: `/health`;
- frontend: catálogo real, componente Card, tabuleiro, casas válidas e integração mão/tabuleiro.

## Comandos

```powershell
npm run lint
npm run typecheck
npm run test:ci
npm run build
```

## Testes frontend

- [Card.test.tsx](../apps/web/src/features/cards/presentation/Card.test.tsx) verifica imagem, nome, tipo, ATK, DEF, nível e variantes;
- [GameBoard.test.tsx](../apps/web/src/features/game-board/presentation/GameBoard.test.tsx) verifica 6×4, ausência de coordenadas/labels técnicos e informação completa numa casa ocupada;
- [App.test.tsx](../apps/web/src/App.test.tsx) verifica ranged desativada em defesa/corpo a corpo, longo alcance ativo e remoção real da mão;
- [App.test.tsx](../apps/web/src/App.test.tsx) verifica a passagem de turno até à compra integrada e a retirada de uma carta do campo depois de uma seleção da mão;
- [MatchPresentationSequence.test.tsx](../apps/web/src/features/match/presentation/MatchPresentationSequence.test.tsx) verifica a primeira frame do saque, o início da animação após o clique e a transição para posicionamento;
- [tutorialGame.test.ts](../apps/web/src/features/tutorial/application/tutorialGame.test.ts) verifica os cenários oficiais de compra, combate, invocação de nível 2 e Soul Harvest;
- [TutorialScreen.retirement.test.tsx](../apps/web/src/features/tutorial/presentation/TutorialScreen.retirement.test.tsx) verifica que a carta ocupada continua clicável durante a etapa Soul Harvest;
- [catalog.test.ts](../packages/game-content/tests/catalog.test.ts) verifica exatamente as cinco cartas de teste e os seus atributos.

## Testes ainda planeados

- consulta remota do catálogo;
- persistência;
- sincronização frontend/backend;
- acessibilidade visual completa em browsers reais.

## Limitações

- placeholders SVG são temporários;
- os níveis 0 e valores das cinco cartas são fixtures de teste;
- não há direção artística final;
- a validação visual de proporção depende também de browser real.
