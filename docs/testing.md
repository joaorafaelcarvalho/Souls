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