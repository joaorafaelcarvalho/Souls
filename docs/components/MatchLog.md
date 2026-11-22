# MatchLog

## Responsabilidade

Apresentar o histórico textual da partida no lado esquerdo do frontend, por baixo do estado do Jogador 2.

## Integração

O componente recebe uma lista de mensagens já adaptadas para linguagem humana. O adaptador [formatGameEvents](../../apps/web/src/features/match/application/formatGameEvents.ts) transforma os GameEvent reais devolvidos pelo game-core em mensagens em português.

O histórico é atualizado pelo [useLocalGame](../../apps/web/src/features/match/application/useLocalGame.ts) depois de cada operação bem-sucedida. As mensagens mais recentes aparecem no topo e a lista mantém scroll vertical interno, limitada ao espaço do rail esquerdo.

Até 64rem, o componente é ocultado exclusivamente por CSS e não reserva espaço. A lista de eventos continua a ser mantida pelo controlador e reaparece intacta quando o viewport regressa ao layout desktop.

## Eventos apresentados

O adaptador cobre invocações, compras, falhas de compra, retiradas, destruições, dano, Souls, início de turnos/rondas e fim da partida. IDs de instância e objetos JSON não são expostos.

## Limitações

- o protótipo mantém no máximo as 100 entradas mais recentes;
- a partida local começa com uma entrada inicial de ronda;
- eventos que não existem no contrato atual do game-core não são inventados pelo frontend.
Durante uma resolução de combate, as entradas da coluna e os `GameEvent` dessa coluna são adicionados quando a etapa de consequências é apresentada. Os eventos posteriores, como o início do turno seguinte, só são adicionados quando o sequenciador termina; isto evita mostrar o resultado futuro antecipadamente. A integração está descrita em [combat-animations.md](../combat-animations.md).
