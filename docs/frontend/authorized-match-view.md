# Visão autorizada e comandos da partida

## Objetivo

O protótipo local mantém o `GameState` completo dentro do adaptador [useLocalGame](../../apps/web/src/features/match/application/useLocalGame.ts), mas a apresentação React não recebe esse estado privado. A projeção pura vive em [game-online](../../packages/game-online/src/index.ts), e o adaptador local reexporta-a para compatibilidade.

## Identidades

A visão expõe duas identidades distintas:

- `activePlayerId`: jogador ao qual as regras atribuem a ação atual;
- `viewerPlayerId`: jogador cuja informação privada pode ser apresentada.

No modo local hot-seat, o `viewerPlayerId` acompanha o jogador ativo para preservar o fluxo existente. Um adaptador futuro pode fornecer `useLocalGame({ viewerPlayerId: 1 })` como identidade fixa ou produzir a mesma visão a partir de uma sessão remota.

## Dados privados

`AuthorizedGameView` inclui:

- estatísticas públicas, contagens de baralho/descarte e estado do turno de ambos os jogadores;
- a mão completa apenas em `view.viewer.hand`;
- `null` para a mão privada de qualquer outro jogador;
- instâncias visíveis no tabuleiro e na mão do visualizador em `visibleCardInstances`;
- catálogo de definições, necessário para apresentar as cartas.

Assim, a árvore React não precisa de consultar `state.players[1].hand` e `state.players[2].hand` para decidir o que mostrar. Identidades privadas do adversário não atravessam o limite de autorização.

## Comandos

As intenções da interface passam por [MatchCommands](../../apps/web/src/features/match/application/MatchCommands.ts): selecionar, posicionar, retirar, avançar de fase, resolver compra/ataque, controlar a reprodução e reiniciar. A implementação local encaminha estes comandos para o game-core. O adaptador [useOnlineGame](../../apps/web/src/features/online/application/useOnlineGame.ts) mantém o mesmo contrato, mas envia intenções pelo WebSocket; o servidor executa game-core e devolve a visão autorizada.

O token online é uma identidade anónima de sala, não uma conta. `TurnHandoffOverlay` continua exclusivo da apresentação e não pertence ao motor; no online o turno e a fase são indicados pelo snapshot oficial.

## Limites

O controlador local continua a possuir o `GameState` completo porque precisa de executar as operações oficiais e reproduzir o combate. Isso não autoriza os componentes de apresentação a acederem a esse estado: o ponto de entrada visual é `view` mais `commands`.
