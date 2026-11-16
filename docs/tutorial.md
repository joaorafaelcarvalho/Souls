# SOULS — Tutorial Interativo v1

## Objetivo

O tutorial é um modo independente do PvP Local. Apresenta uma sessão determinística, reutiliza o tabuleiro, a mão, os eventos e o sequenciador de combate existentes e não altera as regras do [regulamento v0.7](./game-rules.md).

## Arquitetura

- [tutorialSteps.ts](../apps/web/src/features/tutorial/application/tutorialSteps.ts) define as doze etapas pedagógicas e os seus objetivos.
- [tutorialGame.ts](../apps/web/src/features/tutorial/application/tutorialGame.ts) cria a mão ordenada e os cenários através de `initializeGame` e das operações oficiais.
- [useTutorialGame.ts](../apps/web/src/features/tutorial/application/useTutorialGame.ts) mantém a etapa, seleção, cenário, feedback e reprodução de combate. Não calcula dano, Souls ou legalidade.
- [TutorialInstructionPanel.tsx](../apps/web/src/features/tutorial/presentation/TutorialInstructionPanel.tsx) apresenta objetivo, progresso, feedback e ações.
- [TutorialScreen.tsx](../apps/web/src/features/tutorial/presentation/TutorialScreen.tsx) compõe os componentes visuais existentes com os destaques contextuais.

O modo tutorial usa cenários independentes quando uma demonstração contínua não seria compatível com os limites oficiais de colocação. Cada cenário é criado pelo motor e as ações do jogador continuam a passar por `placeCard`, `resolveDrawPhase` e `resolveAttackPhase`.

## Etapas

1. Bem-vindo ao SOULS;
2. zonas do tabuleiro;
3. seleção e leitura dos atributos das cartas;
4. posicionamento melee;
5. preparação da defesa;
6. posicionamento ranged;
7. ordem dos turnos;
8. compra obrigatória;
9. combate por coluna;
10. ataque combinado;
11. Souls, retirada estratégica e bloqueios;
12. executar Soul Harvest;
13. vitória e derrota.

As etapas de compra, combate e Souls executam operações reais. O tutorial explica que uma carta destruída e uma retirada estratégica podem conceder Souls, que a retirada consome uma das duas ações e que um ataque bloqueado não remove Souls nem HP. No catálogo atual, o `Cavaleiro Negro` é nível 1; o cenário de Souls obtém primeiro uma Soul através de combate e só depois permite a sua invocação, pagando o custo oficial.

## Progresso e limpeza

A conclusão é registada apenas como `souls.tutorial.v1.completed` no `localStorage`. Repetir o tutorial reinicia a sessão, mas não apaga o marcador de conclusão. Sair desmonta a sessão e cancela o sequenciador local.

Não existe IA tutorial, persistência remota, autenticação, matchmaking ou alteração do estado de uma partida PvP.
