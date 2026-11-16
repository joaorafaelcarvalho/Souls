# GameResultOverlay

## Responsabilidade

Apresentar o encerramento visual da partida quando o estado oficial passa a `status: 'finished'` e possui `winnerId`. O componente não decide o vencedor, não calcula estatísticas e não altera o game-core.

## Dados apresentados

O painel lê a [AuthorizedGameView](../frontend/authorized-match-view.md) fornecida pelo controlador:

- jogador vencedor e derrotado;
- HP final do vencedor;
- ronda final;
- Souls finais de ambos os jogadores.

O componente não recebe as mãos privadas nem o `GameState` completo. Não decide o vencedor, não calcula estatísticas e não altera o game-core.

A distinção visual Vitória/Derrota usa `viewerPlayerId`, sem assumir que o jogador local é sempre o Jogador 1.

## Revanche

O botão `Revanche` chama o callback de reinício já fornecido pelo [useLocalGame](../../apps/web/src/features/match/application/useLocalGame.ts). Isso cancela temporizadores, limpa a reprodução visual, cria um novo estado inicial e remove o overlay.

## Acessibilidade e responsividade

O overlay usa `role="dialog"`, `aria-modal`, foco inicial no botão principal, foco visível, contraste elevado e uma composição de uma coluna em mobile. `prefers-reduced-motion` remove as entradas animadas.

## Limitações

O protótipo local ainda não tem identidade de utilizador, conta ou sessão remota. O overlay apresenta o vencedor/derrotado por jogador, sem afirmar que correspondem a uma conta online.
## Assets decorativos

O painel usa camadas transparentes reais em [apps/web/public/images/result](../../apps/web/public/images/result):

- `result-frame-top.png`: arco gótico superior e estátuas da moldura;
- `result-sword-crest.png`: espada/crest espiritual central;
- `result-statue-left.png` e `result-statue-right.png`: figuras encapuzadas laterais;
- `result-banner-left.png` e `result-banner-right.png`: estandartes vermelhos;
- `result-architecture-left.png` e `result-architecture-right.png`: arquitetura gótica lateral;
- `result-frame-bottom.png`: base inferior com velas, caveiras e moldura;
- `result-spirit-base.png`: energia violeta e altar inferior.

Os textos, estatísticas, estados Vitória/Derrota, botões e animações continuam a ser componentes React/CSS. A imagem de referência não é carregada pela aplicação.
