# GameBoard

## Responsabilidade

Compor a grelha visual de 24 casas, com seis linhas e quatro colunas, dando destaque ao tabuleiro. Recebe o estado real do tabuleiro e resolve instâncias para definições antes de renderizar [Card](./Card.md).

## Props

A interface recebe board, cardInstances, cardDefinitions, getCellState e onCellClick. Os tipos completos estão no próprio [GameBoard.tsx](../../apps/web/src/features/game-board/presentation/GameBoard.tsx).

## Estados

As casas recebem valid, invalid ou inactive do controlador local. A decisão usa a validação do game-core; o componente apenas apresenta o resultado.

## Apresentação

As coordenadas e nomes técnicos das zonas não são mostrados. Casas vazias usam apenas cor e espaço vertical. Casas ocupadas mostram a carta completa em proporção 2 / 3.

A área [App.tsx](../../apps/web/src/App.tsx) coloca o GameBoard na coluna central da composição desktop. A moldura aproveita a largura disponível, enquanto o cálculo interno usa o menor limite entre largura e altura para manter as seis linhas e quatro colunas integralmente visíveis. Em ecrãs pequenos, a área passa para uma coluna sem alterar a grelha.

## Limitações

- não calcula combate;
- não permite movimento direto;
- não é um layout artístico final.

## Testes

[GameBoard.test.tsx](../../apps/web/src/features/game-board/presentation/GameBoard.test.tsx) verifica a grelha, a ocultação de texto técnico e a carta completa numa casa ocupada.
## Combate em reprodução

A prop opcional `combatPlayback` recebe o estado visual do [CombatAnimationSequencer](../combat-animations.md). O GameBoard usa-a apenas para marcar a coluna e as casas envolvidas; cartas destruídas deixam de ser montadas enquanto a reprodução continua e o overlay é aplicado apenas à troca atual. Não altera `board`, não calcula dano e não muda a dimensão da grelha.