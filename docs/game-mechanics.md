# Mecânicas · SOULS v0.7

Este documento explica o funcionamento operacional da implementação. O texto normativo completo está em [docs/game-rules.md](./game-rules.md).

## Ciclo implementado

```text
preparação
    ↓
ronda 1: posicionamento do primeiro jogador → posicionamento do segundo jogador
    ↓
ronda 2+: compra → posicionamento → ataque
    ↓
próximo jogador / próxima ronda
```

O primeiro jogador permanece fixo durante todas as rondas. Dentro de uma ronda, o segundo jogador é sempre o outro jogador.

## Preparação

[initializeGame](../packages/game-core/src/application/initializeGame.ts) recebe dois baralhos de 20 definições e uma [RandomSource](../packages/game-core/src/application/random.ts) opcional.

A operação:

- escolhe o primeiro jogador através da fonte injetada;
- cria uma instância única para cada carta;
- baralha cada conjunto de instâncias;
- distribui cinco cartas para a mão;
- deixa 15 cartas no baralho;
- começa com 10 000 HP, zero Souls, tabuleiro vazio e fase `first-round-positioning`.

A fonte de aleatoriedade é separada dos cálculos de combate para permitir testes repetíveis.

## Progressão de fases

[finishPositioningPhase](../packages/game-core/src/application/gameplay.ts):

- na primeira ronda passa o controlo para o segundo jogador;
- depois do posicionamento do segundo jogador inicia a ronda 2 em `draw`;
- nas rondas seguintes muda `positioning` para `attack`.

[resolveDrawPhase](../packages/game-core/src/application/gameplay.ts):

- só aceita a fase `draw`;
- tenta comprar exatamente duas vezes enquanto a partida estiver ativa;
- adiciona cartas ao fim da mão e remove-as do topo do baralho;
- para imediatamente se uma penalização levar o jogador a zero HP;
- passa para `positioning` quando as duas tentativas terminam.

[resolveAttackPhase](../packages/game-core/src/application/gameplay.ts):

- só aceita a fase `attack`;
- avalia as colunas 0, 1, 2 e 3;
- ignora colunas sem ofensiva;
- termina imediatamente quando a partida acaba;
- inicia o turno seguinte em `draw` quando a partida continua.

A primeira ronda nunca passa por compra ou ataque.

## Posicionamento

[placeCard](../packages/game-core/src/application/placement.ts):

- exige que seja a fase de posicionamento do jogador ativo;
- exige que a instância esteja na mão;
- valida lado, casa vazia e categoria;
- aplica o custo igual ao nível;
- permite no máximo uma casa de defesa e uma casa ofensiva por turno;
- remove a instância da mão;
- ocupa a posição sem alterar o estado anterior;
- emite `souls-spent` quando o custo é maior que zero e `card-invoked`.

[retireCard](../packages/game-core/src/application/placement.ts):

- exige o início da etapa de posicionamento;
- permite uma retirada por turno;
- consome uma das duas ações de posicionamento;
- concede 1 Soul, respeitando o máximo de cinco;
- deixa no máximo uma colocação disponível nesse turno;
- remove a carta do tabuleiro;
- adiciona-a ao descarte;
- emite `card-retired` com razão voluntária;
- emite `souls-gained` com razão de retirada quando a Soul foi efetivamente obtida.

## Compra e penalizações

Cada tentativa é processada isoladamente:

- com carta no baralho, emite `card-drawn`;
- sem carta e com Souls, consome uma Soul e emite `draw-failed` e `souls-spent`;
- sem carta e sem Souls, aplica 500 HP e emite `draw-failed` e `damage-dealt`;
- HP zero termina a partida e impede a tentativa seguinte.

## Combate aplicado ao estado

Os resolvers puros em [combat.ts](../packages/game-core/src/application/combat.ts) calculam o resultado. [gameplay.ts](../packages/game-core/src/application/gameplay.ts) transforma esse resultado em novo estado:

1. encontra ofensivas nas linhas próprias da coluna;
2. encontra defesa, melee e ranged adversários na ordem normativa;
3. resolve a coluna com o ATK combinado ou restante;
4. envia cartas destruídas para o descarte;
5. concede Souls individualmente, respeitando o máximo de cinco;
6. termina a coluna sem penalização quando DEF supera ATK;
7. aplica dano de combate quando existir;
8. termina imediatamente se algum HP chegar a zero.

O cenário oficial 1000 → defesa 300 → ataque melee 300 produz 400 de dano, duas cartas no descarte adversário e duas Souls, limitado pelo máximo normativo.

## Eventos

As operações devolvem o novo estado e uma sequência de [GameEvent](../packages/game-core/src/domain/events.ts). Os eventos atuais cobrem:

- invocação, retirada e compra;
- falha de compra;
- Souls ganhas e gastas;
- cartas destruídas;
- dano;
- início de turno;
- conclusão da partida.

## Limites ainda pendentes

Não foram implementados:

- transporte destas operações através da API;
- sincronização frontend/backend;
- persistência;
- cartas definitivas ou balanceamento;
- funcionalidades proibidas pelo escopo, como autenticação, matchmaking e chat.
