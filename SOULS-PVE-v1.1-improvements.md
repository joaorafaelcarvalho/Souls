# SOULS Player vs IA v1.1 — melhorias de apresentação e decisão

## Escopo

Esta revisão não cria regras novas de PvE. O modo Player vs IA continua a usar o `game-core` oficial e as mesmas operações do PvP Local. A única alteração normativa aprovada nesta fase é a penalização de 500 HP por tentativa de compra falhada sem Soul disponível.

## Fluxo visível

- Cada ação automática da IA aguarda 650 ms antes de ser apresentada.
- O controlador só começa a agir depois da passagem/anúncio visual do turno.
- As compras falhadas são reproduzidas uma a uma com 520 ms entre segmentos.
- O HP mostrado é atualizado por troca de combate e por cada compra falhada.
- Durante o playback, os controlos humanos ficam bloqueados.
- O estado oficial só é aplicado no fim da operação; o overlay visual não duplica regras nem altera o motor.

## IA Difícil

A decisão Hard continua limitada à própria mão, ao tabuleiro público, aos HP/Souls públicos e às opções legais. A heurística passou a avaliar ameaças por coluna, proteção de ranged e sequência defesa → ranged quando existem duas colocações legais compatíveis. Foram adicionados testes determinísticos para proteção e preparação na mesma coluna.

## Resultado da partida

O painel final apresenta exclusivamente os botões `Revanche` e `Menu Principal`. O segundo executa o regresso direto ao menu principal; o botão `Voltar` do cabeçalho mantém o diálogo de confirmação existente.

## Validação final — 16/11/2026

Comandos executados no projeto:

~~~powershell
npm run test:ci
npm run typecheck
npm run lint
npm run build
~~~

Resultados reais:

- `npm run test:ci`: 123 testes passaram, 0 falharam;
- API: 1 teste;
- web: 58 testes;
- Balance Lab: 14 testes;
- game-ai: 6 testes;
- game-content: 9 testes;
- game-core: 35 testes;
- `npm run typecheck`: passou em todos os workspaces;
- `npm run lint`: passou;
- `npm run build`: passou, incluindo o bundle Vite da aplicação web.

Durante a primeira execução da suite, um teste antigo esperava apenas uma falha de compra quando o jogador tinha 1.000 HP. Com a penalização aprovada de 500 HP, as duas compras falhadas são necessárias e o teste foi corrigido para verificar os dois eventos. A suite completa foi executada novamente e passou.

## Limitações

- A IA Hard continua a ser uma heurística local, sem pesquisa profunda.
- O playback não torna as cartas compradas visíveis antes da confirmação oficial da operação; a melhoria desta versão é dirigida ao HP e à separação temporal das fases.
- Não foram alterados ATK, DEF, níveis, custos, cartas oficiais ou regras de combate.
