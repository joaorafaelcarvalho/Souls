# CardInspectionPanel

## Responsabilidade

Apresentar a carta inspecionada na área direita da partida, abaixo da ronda/fase e acima da mão do jogador.

## Seleção

A seleção visual de uma carta da mão atualiza o painel e mantém a intenção de posicionamento existente. Clicar numa carta do tabuleiro atualiza a inspeção usando a mesma definição real, sem executar combate, retirada ou outra ação automaticamente.

O estado da inspeção é mantido no frontend e é separado da definição/instância usada pelo game-core.

## Estados

- sem carta: apresenta uma mensagem discreta de instrução;
- com carta: renderiza Card na variante inspection;
- imagem/definição ausente: mantém o fallback acessível do Card.

## Responsividade

Em desktop o painel ocupa o rail direito entre a ronda e a mão. Até 64rem, o rail é removido da composição visual e a inspeção passa para [CardInspectionDialog](./CardInspectionDialog.md), sem aumentar ou deslocar o tabuleiro.

## Limitações

- não apresenta lore ou facção, porque esses campos ainda não existem no catálogo;
- não altera HP, Souls, posições ou regras;
- não usa modal nem duplo clique.
