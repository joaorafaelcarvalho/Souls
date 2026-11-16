# PlayerHand

## Responsabilidade

Apresentar as cartas disponíveis na mão real do jogador ativo, usando [Card](./Card.md). A mão fica na faixa inferior da composição desktop e usa uma fila horizontal com scroll.

## Props

A interface recebe cardIds, cardInstances, cardDefinitions, selectedCardId e onSelect. Os tipos completos estão no próprio [PlayerHand.tsx](../../apps/web/src/features/match/presentation/PlayerHand.tsx).

## Integração

Quando placeCard tem sucesso, a instância é removida do array hand; o tabuleiro recebe a mesma instância através de BoardState.occupants. A interface não cria cópias visuais falsas.

## Apresentação

A mão fica abaixo do tabuleiro, em fila horizontal. A altura das cartas é limitada ao espaço inferior disponível e o contentor permite scroll horizontal quando existirem mais cartas do que a largura disponível. Em ecrãs largos, a mão ocupa a coluna direita inferior, imediatamente abaixo do status do jogador 1.

## Limitações

- não calcula custos;
- não altera o estado;
- usa cartas de teste do catálogo;
- não representa uma mão remota.

## Testes

[App.test.tsx](../../apps/web/src/App.test.tsx) confirma a integração do estado inicial com o protótipo local e a remoção da carta da mão depois da colocação.