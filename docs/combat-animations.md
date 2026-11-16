# Animações de combate

## Objetivo

A apresentação do combate é sequencial e pertence exclusivamente ao frontend. O [game-core](../packages/game-core) continua a resolver o ataque de forma síncrona, determinística e sem `setTimeout`, `requestAnimationFrame`, DOM ou CSS.

A resolução de `resolveAttackPhase` devolve o mesmo `state` final e a mesma lista normativa de [GameEvent](../packages/game-core/src/domain/events.ts). Quando existem ataques, o resultado inclui também `combatTrace`: metadados puros sobre as colunas processadas, as trocas dentro de cada coluna e os eventos produzidos por cada coluna.

## Contrato de resolução

`combatTrace.columns` contém apenas colunas com atacantes. A ordem é sempre a ordem do motor, da coluna 0 à coluna 3; colunas vazias não criam esperas artificiais. Cada coluna contém:

- `column`: índice interno da coluna;
- `attackerIds`: instâncias que iniciaram o ataque;
- `targetIds`: alvos visitados pelo motor;
- `result`: o `ColumnCombatResult`, incluindo `exchanges` na ordem real da resolução;
- `events`: eventos normativos gerados ao aplicar aquela coluna.

`trailingEvents` contém eventos posteriores à última coluna, como a mudança para o próximo turno. Nenhum destes contratos contém durações ou decisões visuais.

## Sequenciador frontend

O [CombatAnimationSequencer](../apps/web/src/features/combat/application/CombatAnimationSequencer.ts) transforma o traço numa fila de apresentação. A sequência inicial usa estes tempos, configuráveis por opção:

| Etapa | Duração base |
| --- | ---: |
| destaque/carga da coluna | 600 ms |
| viagem do ataque | 850 ms |
| impacto | 350 ms |
| consequências/desintegração | 1500 ms |
| transição | 150 ms |

Quando uma coluna tem defesa e depois um alvo ofensivo, `impact` e `consequences` são repetidos para cada `exchange`, mantendo a defesa antes do alvo seguinte. Ataques combinados continuam a ser uma única resolução do motor; a apresentação identifica os dois atacantes sem calcular dano novamente.

A velocidade normal é 1×. O controlo `Acelerar 2×` usa 2× e pode ser alterado durante a reprodução. `Saltar animação` cancela os temporizadores restantes, apresenta as consequências pendentes e aplica o resultado oficial uma única vez.

## Estado oficial e projeção visual

O [useLocalGame](../apps/web/src/features/match/application/useLocalGame.ts) calcula o resultado oficial imediatamente, mas mantém o estado renderizado anterior enquanto o traço é reproduzido. O tabuleiro recebe apenas `CombatPlaybackState` para destacar a coluna, atacantes, alvos, impacto e cartas destruídas. No fim de `onComplete`, o `state` final é publicado.

Assim, HP, Souls, descarte e mudança de turno continuam a aguardar a publicação do estado final, enquanto a carta destruída desaparece apenas na projeção visual. O campo `destroyedCardIds` acumula as cartas já ocultas; `activeDestroyedCardIds` identifica apenas a troca cujo overlay está a tocar. O frontend não reproduz regras nem tenta recalcular o resultado. Se a partida terminar numa coluna, o traço termina nessa coluna e não cria etapas para colunas posteriores.

Durante a reprodução ficam bloqueadas as casas, a mão e ações de posicionamento/compra/ataque. O botão Voltar confirma o abandono, cancela a reprodução e regressa ao menu; uma animação cancelada não deixa callbacks ou temporizadores ativos.

## Efeitos visuais

- a coluna corrente recebe destaque sem alterar dimensões da grelha;
- atacantes recebem pulso dourado;
- o alvo da troca recebe realce de impacto;
- cartas destruídas deixam de ser renderizadas quando o impacto as identifica; o marcador X permanece nas casas já destruídas e é substituído pelo overlay de desintegração durante as consequências;
- a faixa do tabuleiro e o painel da ronda mostram coluna, etapa e, quando aplicável, troca atual;
- o `MatchLog` recebe o resumo da coluna e os `GameEvent` correspondentes quando as consequências são apresentadas; eventos posteriores só entram no fim.

Os efeitos usam [BoardCell.module.css](../apps/web/src/features/game-board/presentation/BoardCell.module.css) e não podem provocar crescimento, reflow ou alteração da proporção 2:3 das casas.

## Movimento reduzido e testes

Quando `prefers-reduced-motion: reduce` está ativo, o sequenciador não agenda a animação temporal: emite apenas a consequência final de cada coluna e conclui imediatamente. A lógica continua a produzir o mesmo estado oficial.

A cobertura está em [CombatAnimationSequencer.test.ts](../apps/web/src/features/combat/application/CombatAnimationSequencer.test.ts), [combat.test.ts](../packages/game-core/tests/combat.test.ts) e [turn-flow.test.ts](../packages/game-core/tests/turn-flow.test.ts). Os testes verificam ordem de colunas, múltiplas trocas, ataque combinado, salto, velocidade, reduced motion e cancelamento sem callbacks obsoletos.

## Evolução futura

Para acrescentar novas apresentações não é necessário alterar regras de combate. Deve-se estender o traço puro apenas quando faltar informação real produzida pelo motor; durações, sons, partículas e componentes continuam na camada web. O regulamento em [game-rules.md](./game-rules.md) permanece inalterado.
## Combat VFX

A apresentação visual é composta por [LightningAttackEffect](../apps/web/src/features/combat/presentation/LightningAttackEffect.tsx), estilos dos `BoardCell` e feedback de recursos no [PlayerStatus](../apps/web/src/features/match/presentation/PlayerStatus.tsx). A documentação detalhada está em [components/CombatVfx.md](./components/CombatVfx.md).

O SVG mede as âncoras DOM das cartas e não guarda coordenadas de uma partida específica. O X é um estado visual da casa e nunca toca no estado oficial. A configuração reutilizável está em [combatVfxTiming.ts](../apps/web/src/features/combat/combatVfxTiming.ts).
### Assets melee/ranged

O `LightningAttackEffect` alterna uma única variante por coluna/troca: usa `souls_ranged_golden_lightning.webp` ou `souls_ranged_impact.webp` para ranged, e `souls_melee_attack_alt.webp` ou `souls_melee_impact.webp` para melee. Não combina as duas variantes no mesmo ataque; o melee também não recebe a trajetória elétrica ranged.

## Encerramento após o golpe final

Quando a resolução oficial termina com `game-ended`, o trace não cria colunas posteriores. O [useLocalGame](../apps/web/src/features/match/application/useLocalGame.ts) publica o estado `finished` apenas no `onComplete`; nesse momento o [GameResultOverlay](../apps/web/src/features/match/presentation/GameResultOverlay.tsx) surge por cima do tabuleiro. O reinício cancela o sequenciador e desmonta SVG e efeitos CSS.