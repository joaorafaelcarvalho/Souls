# Arquitetura

## Objetivo

SOULS usa um workspace local com aplicações e pacotes separados por responsabilidade:

```text
apps/web ────────┐
                 ├── regras e estados ── packages/game-core
apps/api ────────┘              ↑
                   conteúdo ───┴── packages/game-content
                   rede/projeção ── packages/game-online
```

O frontend apresenta o estado autorizado e o conteúdo. O backend mantém as sessões online e usa diretamente o motor; nenhum destes módulos duplica o combate.

## Workspace

| Caminho | Responsabilidade atual | Dependências permitidas |
| --- | --- | --- |
| [apps/web](../apps/web) | React/Vite, catálogo visual, imagens e protótipo local | React, Vite, game-core, game-content |
| [apps/api](../apps/api) | Fastify, salas online em memória, WebSocket e configuração | Fastify, ws, game-core/game-content/game-online |
| [packages/game-core](../packages/game-core) | modelos, instâncias, progressão e regras determinísticas | TypeScript sem frameworks ou conteúdo |
| [packages/game-content](../packages/game-content) | definições JSON, catálogo, carregamento e validação | contratos do game-core; sem DOM ou regras de combate |
| [packages/game-ai](../packages/game-ai) | observação sanitizada, opções legais e decisões de agentes | game-core; sem React, DOM ou infraestrutura |
| [packages/game-online](../packages/game-online) | contratos de rede e projeção autorizada pura | game-core; sem React, DOM ou transporte |
| [docs](.) | fonte normativa e documentação técnica | nenhuma |

O workspace não contém base de dados, contas persistentes, serviços externos ou deploy. A comunicação em tempo real do PvP Online é feita pelo WebSocket em `apps/api`.

## Catálogo e UUIDs

O catálogo vive em [packages/game-content](../packages/game-content):

- cada carta tem um JSON individual por categoria;
- o carregador browser usa `import.meta.glob`;
- o catálogo rejeita definições inválidas ou UUIDs duplicados;
- os baralhos referenciam UUIDs de definições;
- o game-core cria UUIDs individuais para cada CardInstance;
- imagens ficam em [apps/web/public/images/cards](../apps/web/public/images/cards).

Consulte [docs/cards.md](./cards.md).

O game-core não depende do sistema de ficheiros, de JSON ou de imagens. Recebe definições e referências através de contratos tipados.

## Camadas

### Domain

Contém tipos e conceitos do jogo: cartas, instâncias, jogadores, tabuleiro, turnos, estado e resultados de combate.

### Application

Contém operações de inicialização, criação de instâncias, posicionamento, retirada, compra, progressão e resolução de ataques. Operações determinísticas permanecem puras.

### Content

O game-content valida conteúdo externo ao motor. A validação de nomes, UUIDs, campos e referências de imagem não altera regras de combate.

### Infrastructure

No game-core e game-content não há infraestrutura de armazenamento. No backend, a camada está reservada para persistência e integrações futuras.

### Presentation e interfaces

A apresentação React transforma contratos em componentes visuais e carrega imagens públicas. As interfaces Fastify expõem `/health`, criação/entrada em salas e o WebSocket online. Nenhuma destas camadas decide resultados de combate.

A resolução de ataque pode devolver `GameOperationResult.combatTrace`, um traço puro de colunas, trocas e eventos produzido pelo próprio game-core. O traço não contém tempos nem dependências de browser. [CombatAnimationSequencer](./combat-animations.md) consome-o no frontend, mantém o estado visual anterior durante a reprodução e publica o estado oficial apenas no fim.

### Fronteira de sessão e privacidade

O adaptador local mantém o `GameState` completo para executar as operações do motor, mas a apresentação recebe apenas a [AuthorizedGameView](./frontend/authorized-match-view.md). Esta visão separa `activePlayerId` — identidade usada pelas regras para a ação atual — de `viewerPlayerId` — identidade autorizada a ver uma mão privada. O catálogo, o tabuleiro, as estatísticas e as contagens públicas continuam disponíveis; mãos, baralhos e descartes privados do adversário não são expostos.

As interações passam pelo contrato [MatchCommands](../apps/web/src/features/match/application/MatchCommands.ts). O adaptador local executa-as localmente; o [useOnlineGame](../apps/web/src/features/online/application/useOnlineGame.ts) envia-as ao servidor autoritativo através dos contratos de [game-online](../packages/game-online/src/index.ts). WebSockets, tokens e Fastify ficam fora do game-core. O [TurnHandoffOverlay](./components/TurnHandoffOverlay.md) permanece uma preocupação exclusiva da apresentação, partilhada pelos modos local e online.

O [TutorialScreen](../apps/web/src/features/tutorial/presentation/TutorialScreen.tsx) é um modo de apresentação independente. O seu controlador cria cenários determinísticos através dos contratos oficiais do game-core, valida o progresso pedagógico depois dos resultados normativos e não partilha nem modifica o estado de uma partida PvP.

## Dependências e fluxo

1. JSONs individuais são descobertos pelo bundler;
2. game-content valida e cria o catálogo;
3. o frontend consulta definições e imagens;
4. o game-core recebe definições e baralhos por UUID;
5. o game-core cria instâncias com UUIDs próprios;
6. regras e combate usam apenas estado e dados tipados.

Regras de dependência:

- game-core não importa game-content;
- game-core não importa React, Fastify, DOM, HTTP ou imagens;
- game-content não calcula dano nem define fases;
- game-ai não aplica ações nem recebe mãos ou baralhos privados do adversário;
- frontend não calcula combate;
- backend não duplica o motor.

## Estado atual

Implementado:

- catálogo modular com JSONs por categoria;
- validação e descoberta sem lista manual de imports;
- definições e instâncias separadas por UUID;
- imagens públicas separadas;
- preparação, compras, posicionamento, ataques e vitória;
- protótipo local com consulta ao catálogo.
- visão autorizada da partida e contrato de comandos reutilizável para a sessão online;
- salas privadas em memória, tokens anónimos, lobby, validação servidor, comandos versionados, WebSocket, reconexão temporária e revanche consensual.

Ainda pendente:

- consulta do catálogo através da API;
- persistência após reinício e coordenação entre múltiplas instâncias;
- conteúdo definitivo e balanceamento.

Qualquer evolução deve manter o regulamento em [game-rules.md](./game-rules.md), o catálogo em [cards.md](./cards.md) e as decisões em [decisions.md](./decisions.md).
## Animação sem duplicação de regras

O motor continua a calcular imediatamente o resultado completo de uma resolução. A camada web usa o traço determinístico apenas para organizar a apresentação em colunas e trocas. Os temporizadores, velocidade, reduced motion, cancelamento, bloqueio de interação e efeitos CSS pertencem a `apps/web`. O `game-core` não conhece React, DOM, imagens, CSS ou APIs de animação.
## Fim da partida na apresentação

O `game-core` continua a definir `status: 'finished'` e `winnerId` no momento normativo. A apresentação só mostra [GameResultOverlay](./components/GameResultOverlay.md) depois de o sequenciador terminar a apresentação do golpe decisivo. O botão de revanche chama o controlador local, cancela efeitos e cria um novo estado; não existem regras de revanche no motor.
