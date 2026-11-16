# Regulamento oficial SOULS v0.7

Este documento é a fonte normativa das regras do jogo nesta fase. As implementações e os restantes documentos devem referenciá-lo e não devem alterar, completar ou equilibrar estas regras por iniciativa própria.

## 1. Conceito do jogo

SOULS é um jogo estratégico de cartas por turnos para dois jogadores.

Cada jogador começa com:

- 10 000 HP;
- um baralho de 20 cartas;
- cinco cartas na mão inicial;
- zero Souls.

O objetivo é reduzir os HP do adversário a zero. A partida termina imediatamente quando um jogador atingir zero ou menos HP.

### Construção oficial de baralhos

Os baralhos utilizados em partidas normais têm exatamente 20 cartas e seguem esta distribuição obrigatória:

| Nível | Cartas |
|---:|---:|
| 0 | 10 |
| 1 | 4 |
| 2 | 3 |
| 3 | 2 |
| 4 | 1 |

As cartas devem existir no catálogo oficial. A validação desta composição pertence ao contrato partilhado do catálogo e é aplicada pelo Deck Builder, pela preparação do PvP Local e pelo Balance Lab.

## 2. Tabuleiro

O tabuleiro tem seis linhas e quatro colunas. As coordenadas usam o formato `[linha,coluna]`.

```text
[0,0] [0,1] [0,2] [0,3]
[1,0] [1,1] [1,2] [1,3]
[2,0] [2,1] [2,2] [2,3]
[3,0] [3,1] [3,2] [3,3]
[4,0] [4,1] [4,2] [4,3]
[5,0] [5,1] [5,2] [5,3]
```

### Lado do jogador 2

- linha 0: ataque de longo alcance;
- linha 1: ataque corpo a corpo;
- linha 2: defesa.

### Lado do jogador 1

- linha 3: defesa;
- linha 4: ataque corpo a corpo;
- linha 5: ataque de longo alcance.

Cada jogador controla 12 casas. As quatro colunas são independentes. Um ataque apenas pode atingir a coluna adversária correspondente.

## 3. Categorias de cartas

Existem duas categorias:

- cartas corpo a corpo: podem ocupar casas de defesa ou casas de ataque corpo a corpo;
- cartas de longo alcance: apenas podem ocupar casas de ataque de longo alcance.

Cada carta possui:

- `level`: nível entre 0 e 4;
- `attack`: valor de ATK;
- `defense`: valor de DEF.

O ATK é usado nas posições ofensivas. O DEF é usado quando uma carta corpo a corpo está numa casa de defesa. Cartas posicionadas em defesa não atacam.

## 4. Invocação

O custo em Souls corresponde ao nível da carta:

```text
Nível 0 = 0 Souls
Nível 1 = 1 Soul
Nível 2 = 2 Souls
Nível 3 = 3 Souls
Nível 4 = 4 Souls
```

O jogador apenas pode invocar cartas cujo custo consiga pagar. A invocação consome as Souls correspondentes. Uma carta invocada pode atacar no mesmo turno em que é colocada.

## 5. Preparação da partida

Cada jogador recebe cinco cartas do seu baralho.

O primeiro jogador é escolhido através de cara ou coroa. O vencedor do cara ou coroa joga primeiro em todas as rondas da partida.

Uma ronda corresponde a um turno de cada jogador.

A primeira ronda é exclusivamente de posicionamento:

- não existe compra de cartas;
- não existe ataque;
- os jogadores podem posicionar cartas;
- se um jogador não conseguir invocar nenhuma carta, pode terminar o turno sem colocar cartas.

Não existe troca obrigatória da mão inicial.

## 6. Estrutura dos turnos

A partir da segunda ronda, cada turno segue obrigatoriamente estas fases, pela ordem:

1. compra;
2. posicionamento;
3. ataque.

## 7. Fase de compra

O jogador realiza obrigatoriamente duas tentativas de compra por turno.

Não existe limite máximo de cartas na mão.

Se o baralho estiver vazio, cada tentativa de compra falhada provoca uma penalização. As duas tentativas são tratadas individualmente.

### Com Souls disponíveis

O jogador perde automaticamente uma Soul por cada tentativa falhada.

### Sem Souls disponíveis

O jogador perde 500 HP por cada tentativa falhada.

Se o jogador atingir zero HP durante a compra, a partida termina imediatamente.

## 8. Fase de posicionamento

A fase de posicionamento tem duas etapas.

### 8.1. Etapa A — retirada estratégica (Soul Harvest)

O jogador pode retirar voluntariamente uma carta sua do campo.

Regras:

- máximo de uma retirada por turno;
- apenas antes de efetuar qualquer colocação;
- consome uma das duas ações de posicionamento;
- concede imediatamente 1 Soul, respeitando o máximo de cinco;
- a carta vai definitivamente para o descarte;
- a casa fica disponível para novas invocações;
- depois da retirada resta no máximo uma colocação nesse turno;
- se o jogador já tiver cinco Souls, a retirada continua permitida mas não concede uma Soul adicional;
- depois de começarem as colocações, já não pode efetuar uma retirada nesse turno.

### 8.2. Etapa B — colocação

O jogador pode realizar até duas colocações:

- uma carta numa casa de defesa;
- uma carta numa casa ofensiva, corpo a corpo ou longo alcance.

A ordem destas duas colocações é livre.

As cartas só podem ser posicionadas em casas vazias. Não existem substituições diretas de cartas nem movimentos entre casas.

Devem ser respeitados:

- o custo de invocação;
- a categoria da carta;
- o lado do tabuleiro pertencente ao jogador;
- o limite total de duas ações de posicionamento por turno;
- sem retirada, no máximo uma colocação defensiva e uma ofensiva;
- com retirada, no máximo uma colocação adicional, defensiva ou ofensiva.

## 9. Fase de ataque

Todas as colunas que possuam cartas ofensivas atacam obrigatoriamente. O jogador não pode escolher ignorar uma coluna ocupada.

Os ataques são resolvidos automaticamente pela ordem:

```text
Coluna 0
Coluna 1
Coluna 2
Coluna 3
```

Cada coluna realiza um único ataque por fase.

Se uma coluna possuir uma carta corpo a corpo e uma carta de longo alcance, os ataques são somados. Por exemplo:

```text
Corpo a corpo: 700 ATK
Longo alcance: 300 ATK

Ataque combinado: 1000 ATK
```

Se existir apenas uma carta ofensiva, essa carta ataca com o seu ATK individual.

As duas cartas ofensivas colaboram no ataque, mas permanecem cartas individuais quando recebem ataques adversários.

## 10. Ordem de verificação da coluna adversária

O ataque começa pela casa defensiva adversária. A ordem é:

1. defesa;
2. ataque corpo a corpo;
3. ataque longo alcance.

Quando uma casa está vazia, a verificação continua para a posição seguinte.

## 11. Combate ATK contra DEF

Quando o ataque encontra uma carta defensiva, compara-se o ATK disponível com o DEF do defensor.

### ATK superior a DEF

- a carta defensiva é destruída;
- o proprietário recebe uma Soul;
- não perde HP pela destruição da carta defensiva;
- o ataque prossegue com o poder restante.

Fórmula:

```text
ATK restante = ATK disponível - DEF
```

### DEF superior a ATK

- nenhuma carta é destruída;
- o ataque é bloqueado e termina;
- o atacante não perde Souls;
- o atacante não perde HP por este bloqueio.

### ATK igual a DEF

- existe empate;
- nenhuma carta é destruída;
- não há penalizações;
- o ataque termina.

## 12. Combate ATK contra ATK

Quando o ataque encontra uma carta ofensiva adversária, comparam-se os valores de ATK.

O atacante usa o ATK combinado disponível, se possuir duas cartas, ou o ATK individual, se possuir uma. O defensor usa apenas o ATK individual da carta que está a ser atacada.

### Atacante vence

- a carta ofensiva defensora é destruída;
- o proprietário perde em HP a diferença entre os ataques;
- o proprietário recebe uma Soul;
- o ataque da coluna termina.

### Atacante perde

- o atacante perde em HP a diferença entre os ataques;
- se possuir duas cartas ofensivas, apenas a carta corpo a corpo é destruída;
- a carta de longo alcance sobrevive;
- se possuir apenas uma carta ofensiva, essa carta é destruída;
- o proprietário da carta destruída recebe uma Soul;
- o ataque da coluna termina.

### Empate

- nenhuma carta é destruída;
- não existem penalizações;
- o ataque termina.

As Souls não substituem o dano de HP nas disputas ATK contra ATK.

## 13. Limite de progressão dos ataques

Uma carta defensiva destruída permite que o ataque continue com o poder restante.

Quando o ataque encontra uma carta ofensiva, a disputa termina o ataque dessa coluna, independentemente de quem vencer.

Um ataque nunca elimina sucessivamente várias cartas ofensivas na mesma fase.

## 14. Ataque direto

Se não existirem cartas adversárias na coluna, o ataque disponível causa dano diretamente aos HP adversários.

Se uma carta defensiva for destruída e não existirem outras cartas adversárias, o poder restante também causa dano direto.

## 15. Exemplo oficial de combate

Uma coluna atacante possui:

```text
Carta corpo a corpo: 700 ATK
Carta longo alcance: 300 ATK

ATK acumulado: 1000
```

A coluna adversária possui:

```text
Defesa: 300 DEF
Corpo a corpo: 300 ATK
Longo alcance: 100 ATK
```

Resolução:

1. o ataque de 1000 enfrenta a defesa de 300;
2. a defesa é destruída;
3. o ataque restante passa a 700;
4. o ataque enfrenta a carta corpo a corpo adversária com 300 ATK;
5. o atacante vence;
6. a carta corpo a corpo adversária é destruída;
7. o adversário perde 400 HP;
8. o adversário recebe duas Souls pelas duas cartas destruídas, respeitando o limite de cinco;
9. o ataque termina;
10. a carta de longo alcance adversária permanece no campo.

Resultado:

```text
HP adversário: 10000 → 9600
Cartas adversárias destruídas: 2
Souls recebidas: 2
```

## 16. Souls

O máximo de Souls acumuladas é cinco.

Cada carta destruída em combate concede uma Soul ao seu proprietário, respeitando esse limite.

As Souls têm duas utilizações principais e uma proteção de compra:

1. invocar cartas;
2. absorver a penalização por uma compra falhada.

O consumo de Souls na penalização de compras falhadas é automático quando existem Souls disponíveis.

Uma retirada estratégica concede uma Soul imediatamente, salvo quando o jogador já está no limite de cinco.

## 17. Descarte

Cartas destruídas em combate ou retiradas voluntariamente são enviadas para o descarte.

Não regressam ao baralho ou à mão durante a partida.

- destruição em combate: concede uma Soul;
- retirada estratégica: concede uma Soul, respeitando o máximo de cinco.

## 18. Vitória

A partida termina imediatamente quando um jogador atinge zero ou menos HP.

Todas as ações e ataques pendentes são cancelados.
