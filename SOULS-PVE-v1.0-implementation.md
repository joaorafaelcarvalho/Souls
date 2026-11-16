# SOULS Player vs IA v1.0 — relatório de implementação

## Resumo

O modo Jogador vs IA foi integrado no fluxo real da aplicação. O jogador entra pelo menu principal, seleciona um baralho válido, escolhe Fácil, Normal ou Difícil e inicia uma partida que usa o mesmo game-core do PvP Local.

## Arquitetura

- game-core continua a validar e aplicar todas as ações;
- game-ai contém observação sanitizada, opções legais e decisões por dificuldade;
- o Balance Lab reutiliza game-ai com a dificuldade Normal;
- o hook da partida coordena o turno automático da IA;
- o frontend reutiliza o tabuleiro, log, sequenciador de combate, velocidades e ecrã de resultado existentes.

A IA recebe apenas a própria mão, o tabuleiro público, HP/Souls públicos e a fase. A mão e o baralho privado do jogador humano não entram na observação.

## Dificuldades

- Fácil: escolhas legais simples com variabilidade controlada;
- Normal: avaliação estratégica reutilizada pelo Balance Lab;
- Difícil: avaliação de colunas vulneráveis, dano direto, defesa e valor futuro com heurística limitada.

Nenhuma dificuldade altera regras, HP, Souls, cartas, custos ou informação disponível.

## Integração

- JOGADOR VS IA foi adicionado ao submenu JOGAR;
- o ecrã de preparação usa os baralhos guardados do Deck Builder;
- baralhos inválidos são rejeitados pela validação oficial partilhada;
- a IA usa o baralho técnico equilibrado oficial;
- os controlos humanos ficam bloqueados durante o turno da IA;
- compras, posicionamento, retirada e ataque passam pelas operações oficiais;
- logs e animações identificam e apresentam as ações da IA;
- o controlador aguarda a confirmação visual da passagem de turno e a conclusão do anúncio antes de iniciar;
- cada ação automática tem um intervalo de apresentação de 650 ms, sem atrasar o motor oficial;
- revanche e regresso ao menu limpam os temporizadores do controlador.

## Ficheiros principais

- packages/game-ai: novo módulo partilhado de decisão e observação;
- apps/web/src/features/pve/presentation/PvePreparationScreen.tsx: preparação do PvE;
- apps/web/src/features/match/application/useLocalGame.ts: ciclo automático da IA;
- apps/web/src/App.tsx e GameModeMenu.tsx: integração de navegação e apresentação;
- apps/web/src/features/match/application/formatGameEvents.ts: identificação de eventos;
- packages/balance-lab/src/agents.ts: reutilização da decisão Normal.

## Testes

Foram adicionados testes para:

- decisões legais em todas as dificuldades;
- ausência de mão/baralho privado do adversário na observação;
- entrada pelo menu e preparação Player vs IA;
- regressão do PvP Local;
- validação, typecheck, lint e build dos workspaces existentes.

Resultados da execução final em 14/11/2026:

- Testes: 120 passaram através de test:ci;
- game-ai: 4 testes;
- Balance Lab: 14 testes;
- frontend web: 57 testes, incluindo a sincronização do handoff;
- game-core: 35 testes;
- Lint: passou;
- Typecheck: passou;
- Build: passou.

## Limitações

- A IA é local e não usa backend;
- a dificuldade Difícil usa pesquisa heurística limitada, não pesquisa profunda;
- ainda não existem recompensas, progressão ou estatísticas específicas de carreira PvE;
- a telemetria de dano por carta continua limitada pelos eventos oficiais existentes.
