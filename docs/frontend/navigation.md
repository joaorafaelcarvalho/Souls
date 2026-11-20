# Navegação frontend

## Entrada da aplicação

A aplicação não utiliza React Router neste protótipo. [App.tsx](../../apps/web/src/App.tsx) mantém uma máquina de estados de apresentação:

```text
loading → menu → mode-menu → online-lobby → game
```

- `loading`: [LoadingScreen](../components/LoadingScreen.md) dura aproximadamente dois segundos em movimento normal;
- `menu`: [MainMenu](../components/MainMenu.md) apresenta as ações disponíveis;
- `mode-menu`: [GameModeMenu](../components/GameModeMenu.md) apresenta `PVP LOCAL`, `JOGADOR VS IA`, `PVP ONLINE` e `TUTORIAL`;
- `online-lobby`: [OnlineRoomScreen](../../apps/web/src/features/online/presentation/OnlineRoomScreen.tsx) cria/entra em salas, seleciona o baralho guardado e confirma preparação;
- `game`: renderiza a partida existente, incluindo tabuleiro, mão, histórico, combate e resultado final.
- `tutorial`: [TutorialScreen](../tutorial.md) renderiza uma sessão guiada independente e regressa ao menu ao sair ou concluir.

Ao entrar em `game`, [MatchPresentationSequence](../../apps/web/src/features/match/presentation/MatchPresentationSequence.tsx) apresenta uma única vez o resultado oficial de `turn.firstPlayerId`, tanto no modo local como no online. A confirmação/passagem e o anúncio do jogador ativo bloqueiam cliques no tabuleiro durante a sua duração. Nas rondas posteriores, a animação do baralho é iniciada pelo comando de compra e só termina depois do snapshot oficial chegar. Uma revanche cria um novo estado oficial e uma nova chave visual, pelo que a moeda volta a ser apresentada com o novo resultado.

A ação `JOGAR` apresenta uma transição curta de saída do menu e entrada do jogo antes de mudar o estado de apresentação para `game`. Não reinicia silenciosamente a partida nem cria um segundo motor. O loading não é repetido durante essa transição. Durante o jogo, `Voltar` ocupa o lugar do antigo Reiniciar no cabeçalho. Abre um diálogo interno temático (não usa o pop-up nativo do browser); quando confirmado, cancela timers visuais, reinicia a demonstração local através do controlador existente e regressa a `menu`.

O modo online mantém a sessão e reconecta o WebSocket durante falhas temporárias. `Voltar`/`SAIR DA SALA` envia uma saída explícita e limpa listeners, timers e a sessão visual.
