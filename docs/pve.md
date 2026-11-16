# SOULS · Jogador vs IA v1.0

## Arquitetura

O modo PvE reutiliza o mesmo GameState, as mesmas operações e a mesma resolução do game-core. A IA não altera estado diretamente:

1. o controlador PvE observa a fase e o jogador ativo;
2. cria uma visão sanitizada através do pacote game-ai;
3. pede ao agente uma decisão entre opções legais produzidas pelo motor;
4. aplica a decisão através de placeCard, retireCard, resolveDrawPhase, finishPositioningPhase ou resolveAttackPhase;
5. a apresentação mostra os mesmos eventos e animações do PvP Local.

O agente recebe a própria mão, o tabuleiro público, Souls/HP públicos e a fase. Não recebe a mão, o baralho ou o descarte privado do jogador humano.

## Dificuldades

- Fácil: ações legais simples com maior variabilidade e menor planeamento;
- Normal: avaliação de ataque, defesa, Souls, colunas e progressão;
- Difícil: avaliação de ameaças, dano direto, proteção e valor futuro com pesquisa limitada, sem alterar regras.

As dificuldades modificam apenas a decisão. Não dão Souls, HP, cartas, informação oculta ou ações adicionais.

## Baralhos

O jogador seleciona um baralho guardado pelo Deck Builder. A partida só começa quando a validação oficial N0=10, N1=4, N2=3, N3=2, N4=1 passa. A IA usa o baralho técnico equilibrado oficial, com a mesma quantidade de cartas e os mesmos atributos disponíveis ao jogador.

## Ciclo automático

Durante o turno da IA, os controlos humanos ficam bloqueados. Cada ação é apresentada separadamente e o turno segue:

~~~text
COMPRA → POSICIONAMENTO/RETIRADA → ATAQUE
~~~

O motor pode decidir imediatamente, mas a apresentação aguarda o handoff/anúncio do turno e usa um intervalo de 650 ms entre ações. Durante compras falhadas, cada penalização de HP é apresentada individualmente com um intervalo de 520 ms; o HP visível é atualizado por troca de combate ou por compra falhada, enquanto o GameState oficial só é confirmado no fim da sequência correspondente.

As animações de combate, velocidade 2×, salto, logs, vitória, derrota, revanche e saída reutilizam o fluxo existente. O painel final expõe apenas `Revanche` e `Menu Principal`.

## IA Difícil v1.1

A dificuldade Difícil continua a usar apenas a observação pública e opções legais produzidas pelo game-core. A heurística agora:

- avalia a pressão ofensiva por coluna;
- protege cartas ranged com uma defesa na mesma coluna;
- prefere colocar a defesa primeiro quando existe uma ranged legal que pode seguir na mesma coluna;
- valoriza uma ranged numa coluna já protegida;
- mantém a escolha de ações separada da resolução oficial do motor.

Isto é planeamento heurístico de até duas colocações, não um segundo motor nem informação adicional.

## Penalização de compras falhadas

Uma compra falhada sem Soul disponível causa 500 HP por tentativa. A constante normativa está em game-core e a interface apenas apresenta o evento; o PvP Local e o modo PvE usam a mesma operação oficial.

## Testes

O pacote game-ai tem testes de decisão e privacidade. O frontend testa a entrada no modo PvE e o arranque através do menu. Os testes globais devem ser executados com:

~~~powershell
npm run test:ci
npm run typecheck
npm run lint
npm run build
~~~

## Limitações

- A IA é local e síncrona; não existe servidor, matchmaking ou PvE online.
- A pesquisa Difícil é heurística e limitada para não bloquear a interface.
- O relatório de fim continua baseado nas métricas disponíveis na visão autorizada; não são inventadas estatísticas por carta.
- A IA não possui progressão, recompensas ou economia própria.
