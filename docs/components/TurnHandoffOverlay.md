# TurnHandoffOverlay

## Responsabilidade

Camada exclusiva do PvP Local para ocultar visualmente a partida durante a troca de jogador e pedir confirmação ao jogador seguinte. O botão apenas continua a sequência de apresentação; não chama operações do game-core.

O componente não pertence ao motor nem ao [GameBoard](./GameBoard.md), não conhece mãos privadas e não decide o próximo jogador. A sessão online poderá substituir esta confirmação local por uma autorização recebida do servidor.
