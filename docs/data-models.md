# Modelos de dados

Os contratos abaixo são implementados em [packages/game-core/src](../packages/game-core/src) e o catálogo em [packages/game-content/src](../packages/game-content/src).

## CardDefinition

A definição é fornecida pelo catálogo e não é criada pelo motor:

```ts
interface CardDefinition {
  id: string;
  name: string;
  level: 0 | 1 | 2 | 3 | 4;
  type: 'melee' | 'ranged';
  attack: number;
  defense: number;
  image: string;
}
```

O game-core usa `id`, `level`, `type`, `attack` e `defense` para regras. `image` é preservado como dado de conteúdo, mas não é lido pelo combate.

O catálogo valida a estrutura, UUID, valores e referência de imagem em [docs/cards.md](./cards.md).

## CardInstance

A instância representa uma cópia concreta numa partida:

```ts
interface CardInstance {
  instanceId: string;
  cardDefinitionId: string;
  ownerId: 1 | 2;
}
```

- `instanceId` identifica a cópia em mão, baralho, tabuleiro ou descarte;
- `cardDefinitionId` aponta para a definição catalogada;
- `ownerId` identifica o jogador da partida.

O motor gera `instanceId` com `crypto.randomUUID()` através de uma fonte injetável para testes. O UUID não depende do nome da carta.

## Baralhos e jogadores

```ts
interface PlayerSetup {
  id: 1 | 2;
  deck: readonly CardDefinitionId[];
}

interface PlayerState {
  id: 1 | 2;
  hp: number;
  souls: number;
  hand: readonly CardInstanceId[];
  deck: readonly CardInstanceId[];
  discard: readonly CardInstanceId[];
}
```

O baralho de configuração possui exatamente 20 UUIDs de definições. Durante a inicialização, cada referência transforma-se numa instância nova.

## BoardPosition e BoardState

```ts
interface BoardPosition {
  row: 0 | 1 | 2 | 3 | 4 | 5;
  column: 0 | 1 | 2 | 3;
  key: BoardPositionKey;
  type: 'defense' | 'melee' | 'ranged';
  ownerId: 1 | 2;
}

interface BoardState {
  occupants: Readonly<Record<BoardPositionKey, CardInstanceId | null>>;
}
```

As funções de [board/rules.ts](../packages/game-core/src/domain/board/rules.ts) classificam posições. O tabuleiro guarda apenas IDs de instâncias, nunca definições completas.

## TurnState

```ts
interface TurnState {
  round: number;
  firstPlayerId: 1 | 2;
  activePlayerId: 1 | 2;
  phase: 'first-round-positioning' | 'draw' | 'positioning' | 'attack';
  placementsMade: number;
  defensivePlacementMade: boolean;
  offensivePlacementMade: boolean;
  hasStartedPlacement: boolean;
  hasRetired: boolean; // a retirada consome uma das duas ações de posicionamento
}
```

## GameState

```ts
interface GameState {
  status: 'active' | 'finished';
  players: Readonly<Record<1 | 2, PlayerState>>;
  board: BoardState;
  cardDefinitions: Readonly<Record<string, CardDefinition>>;
  cardInstances: Readonly<Record<string, CardInstance>>;
  turn: TurnState;
  winnerId?: 1 | 2;
}
```

O game-core recebe as definições já validadas pelo catálogo ou por outro adaptador compatível. Não carrega JSON nem imagens.

## Separação

- [game-content](../packages/game-content): JSONs, catálogo, descoberta e validação;
- [game-core](../packages/game-core): estado, instâncias, regras, combate e UUIDs de instâncias;
- [apps/web](../apps/web): apresentação e imagens públicas;
- [apps/api](../apps/api): futuro ponto de consulta, sem duplicar regras.
