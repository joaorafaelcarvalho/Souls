# GameModeMenu

## Responsabilidade

Apresentar o segundo ecrã de navegação aberto por `JOGAR`. Mantém os modos de jogo separados e oferece `PVP LOCAL`, `TUTORIAL` e `VOLTAR` ao menu principal.

O componente não cria partidas nem conhece regras do motor; apenas chama os callbacks de navegação fornecidos por [App.tsx](../../apps/web/src/App.tsx).
