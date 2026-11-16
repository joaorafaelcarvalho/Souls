# TurnAnnouncement

## Responsabilidade

Apresentar durante menos de um segundo qual é o jogador ativo depois da confirmação local da passagem de turno. O componente só recebe `playerId` e um callback de conclusão visual; não altera fases, compras, Souls, HP ou o jogador ativo.

## Integração

É coordenado por [MatchPresentationSequence](../../apps/web/src/features/match/presentation/MatchPresentationSequence.tsx). No início da partida surge depois da moeda e da confirmação do primeiro jogador. Nas rondas seguintes surge depois de uma alteração oficial de `activePlayerId`, que só é publicada pelo controlador após o combate terminar.
