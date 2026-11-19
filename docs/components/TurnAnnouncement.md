# TurnAnnouncement

## Responsabilidade

Apresentar durante menos de um segundo qual é o jogador ativo depois da confirmação local da passagem de turno quando ainda não existe uma compra obrigatória no modal. O componente só recebe `playerId` e um callback de conclusão visual; não altera fases, compras, Souls, HP ou o jogador ativo.

## Integração

É coordenado por [MatchPresentationSequence](../../apps/web/src/features/match/presentation/MatchPresentationSequence.tsx). No início da partida e durante a passagem entre jogadores da primeira ronda surge depois da moeda e da confirmação local. A partir da segunda ronda, a identificação do jogador e a compra obrigatória são apresentadas no [TurnHandoffOverlay](./TurnHandoffOverlay.md), sem anúncio separado.
