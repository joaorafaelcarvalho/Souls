# TurnHandoffOverlay

## Responsabilidade

Camada exclusiva do PvP Local para ocultar visualmente a partida durante a troca de jogador. Na primeira ronda pede confirmação ao jogador seguinte; nas rondas posteriores identifica o jogador ativo e inicia as duas compras obrigatórias no mesmo modal.

Na fase de compra, o WebP [souls_saque_topo_transparente.webp](../../apps/web/public/images/effects/souls_saque_topo_transparente.webp) é pré-carregado e congelado na primeira frame através de um canvas. Só depois de o jogador carregar em `Efetuar duas compras` é montada a animação WebP. A apresentação permanece bloqueada até a animação terminar e o game-core publicar a fase de posicionamento.

O componente não pertence ao motor nem ao [GameBoard](./GameBoard.md), não conhece mãos privadas e não decide o próximo jogador. A sessão online poderá substituir esta confirmação local por uma autorização recebida do servidor. O callback de compra continua a ser fornecido pelo controlador através do contrato de comandos.
