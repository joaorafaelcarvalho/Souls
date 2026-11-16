# BoardCell

## Responsabilidade

Representar uma casa individual vertical do tabuleiro. Uma casa vazia não mostra coordenadas nem texto técnico; uma casa ocupada mostra [Card](./Card.md).

## Props

```ts
interface BoardCellProps {
  position: BoardPosition;
  occupantId: string | null;
  cardDefinition?: CardDefinition;
  cellState?: 'valid' | 'invalid' | 'inactive';
  combatEffect?: 'column' | 'attacker' | 'target' | 'destroyed';
  combatStage?: CombatAnimationStage;
  destructionOverlayActive?: boolean;
  onClick?: (position: BoardPosition, occupantId: string | null) => void;
}
```

## Estados visuais

- `valid`: casa vazia válida para a carta selecionada e clicável;
- `invalid`: casa rejeitada pelo game-core, desativada e visualmente atenuada;
- `inactive`: sem uma ação de colocação disponível, não interativa.

A classificação é calculada no frontend através de [canPlaceCard](../../packages/game-core/src/application/placement.ts), sem duplicar regras de categoria, lado, fase ou custo.

## Visual

A casa usa as cores semânticas da zona e `aspect-ratio: 2 / 3`. O ID técnico continua disponível para interação interna, mas nunca é renderizado como conteúdo principal.

## Testes

[GameBoard.test.tsx](../../apps/web/src/features/game-board/presentation/GameBoard.test.tsx) verifica casas vazias sem coordenadas/labels técnicos e cartas ocupadas com dados completos. [App.test.tsx](../../apps/web/src/App.test.tsx) verifica que casas inválidas ficam desativadas para uma carta ranged.
Durante uma animação, a casa pode receber `combatEffect` (`column`, `attacker`, `target` ou `destroyed`), `combatStage` e `destructionOverlayActive`. Quando `combatEffect` é `destroyed`, a carta deixa de ser montada visualmente; o overlay só é montado na casa cuja desintegração está ativa. Estes dados são apenas apresentação; a casa continua desativada enquanto o combate decorre.