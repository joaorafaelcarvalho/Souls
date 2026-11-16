# ReturnToMenuDialog

## Responsabilidade

Apresentar uma confirmação interna, tematizada com o Design System SOULS, antes de abandonar a partida e voltar ao menu. Não utiliza `window.confirm` nem um pop-up nativo do browser.

## Ações

- `Continuar partida`: fecha o diálogo e mantém o estado atual;
- `Voltar ao menu`: cancela a reprodução, reinicia a demonstração local através do controlador existente e regressa ao menu;
- `Escape`: equivale a continuar a partida.

O botão que abre o diálogo chama-se `Voltar` e ocupa no cabeçalho o lugar anteriormente usado por `Reiniciar`.