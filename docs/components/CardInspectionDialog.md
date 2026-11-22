# CardInspectionDialog

## Responsabilidade

Apresentar a inspeção compacta de uma carta em mobile e tablet, acima do tabuleiro, reutilizando a definição autorizada. O componente é exclusivamente de apresentação: não calcula combate, não escolhe casas e não executa uma retirada por conta própria.

## Integração

O [App.tsx](../../apps/web/src/App.tsx) resolve a `CardDefinition`, a `CardInstance` visível e a origem (`hand` ou `board`) através da [AuthorizedGameView](../frontend/authorized-match-view.md). O diálogo mostra apenas imagem, nome, categoria, nível, ATK, DEF e custo; não apresenta descrição narrativa nem história.

Quando a origem é a mão, `canPlace` vem de chamadas a `canPlaceSelectedCard` para as 24 casas. O botão **Colocar carta** apenas fecha o diálogo e mantém a seleção oficial; a colocação continua a exigir o toque numa casa válida do `GameBoard`.

Quando a origem é o campo, o botão de Soul Harvest só aparece para uma instância própria. O estado habilitado e o texto de limite de Souls são derivados da visão autorizada, e a ação chama `commands.retireSelectedCard`, que continua a ser validada pelo adaptador e pelo `game-core`.

## Comportamento responsivo

- o diálogo só é montado quando `matchMedia('(max-width: 64rem)')` corresponde;
- possui backdrop, foco inicial no botão de voltar, Escape, fecho pelo backdrop e scroll interno;
- usa áreas de toque mínimas de 44 px;
- é `position: fixed`, portanto não desloca nem redimensiona o tabuleiro;
- no desktop o painel `CardInspectionPanel` atual permanece inalterado.

## Testes

[CardInspectionDialog.test.tsx](../../apps/web/src/features/cards/presentation/CardInspectionDialog.test.tsx) confirma atributos catalogados, estado disabled da colocação e a ação de Soul Harvest para cartas próprias.
