# SOULS — Arquitetura atual

## Escopo e método

Este documento descreve o estado real do repositório auditado em 21 de novembro de 2026. A auditoria cobriu os workspaces npm, configurações TypeScript/Vite/Node, imports entre packages, backend, catálogo, assets, áudio e testes.

O estado Git não foi consultado: [`AGENTS.md`](../../AGENTS.md) proíbe executar Git/GitHub nesta fase. Portanto, este documento não afirma que a árvore local está limpa nem tenta distinguir alterações pré-existentes de alterações desta tarefa.

## Árvore relevante

```text
SOULS/
├── apps/
│   ├── web/
│   │   ├── public/images/             # imagens e animações atualmente servidas pela Web
│   │   └── src/
│   │       ├── app/                   # configuração runtime
│   │       ├── features/              # entrada, jogo, combate, decks, tutorial, online
│   │       ├── mocks/                 # cenários do protótipo local
│   │       └── shared/                # estilos e Audio Engine Web
│   └── api/
│       ├── src/app/                   # servidor Fastify e configuração
│       ├── src/modules/               # health e online rooms
│       └── tests/                     # HTTP/WebSocket
├── packages/
│   ├── game-core/                     # regras determinísticas TypeScript
│   ├── game-content/                  # JSONs de cartas, catálogo e validação
│   ├── game-ai/                       # observação e decisões da IA
│   ├── game-online/                   # visão autorizada e mensagens online TypeScript
│   └── balance-lab/                   # simulação, auditorias e relatórios
├── tests/game-fixtures/               # fixtures JSON portáteis adicionadas nesta preparação
├── scripts/                           # validadores Node não destrutivos
├── docs/                              # regras, arquitetura, frontend, backend e relatórios
├── package.json / package-lock.json   # npm workspaces
└── tsconfig.base.json                 # base TypeScript estrita
```

Não existem atualmente `apps/mobile`, `packages/game-contracts` ou `packages/game-assets`. Também não existem workflows `.github`, `Dockerfile` ou `docker-compose.yml`.

## Aplicações

### `apps/web` — React/Vite

Responsabilidades observadas:

- entrada, navegação, menu, tutorial, códice, Deck Builder e preparação de partidas;
- composição visual do tabuleiro, cartas, estados autorizados, logs e resultado;
- controladores locais, PvE e online no frontend;
- sequenciamento de animações e VFX, sem recalcular o combate;
- integração WebSocket/HTTP com a API;
- armazenamento local de baralhos/tutorial e, agora, preferências do Audio Engine;
- Audio Manager Web baseado em `HTMLAudioElement`/Web Audio provisório.

Entradas principais: [`apps/web/src/main.tsx`](../../apps/web/src/main.tsx) e [`apps/web/src/App.tsx`](../../apps/web/src/App.tsx). O build usa Vite; os testes usam Vitest + jsdom + Testing Library.

### `apps/api` — Node.js/Fastify

Responsabilidades observadas:

- `GET /health`;
- criação/entrada em salas privadas;
- autenticação temporária por token de sessão;
- WebSocket online, comandos versionados, reconexão e encerramento;
- validação de baralhos pelo catálogo e execução do `game-core`;
- filtragem de eventos/mãos através de `game-online`.

Entradas principais: [`apps/api/src/main.ts`](../../apps/api/src/main.ts) e [`apps/api/src/app/server.ts`](../../apps/api/src/app/server.ts). O catálogo do servidor é descoberto por `node:fs` em [`loadServerCardCatalog.ts`](../../apps/api/src/modules/online/infrastructure/loadServerCardCatalog.ts), enquanto a Web usa `import.meta.glob`.

## Packages

| Package | Responsabilidade atual | Dependências principais | Estado multiplataforma |
|---|---|---|---|
| `game-core` | Estado, turnos, compra, posicionamento, Souls, combate, dano, vitória e eventos oficiais | nenhuma aplicação/framework | forte candidato a referência normativa; TypeScript não é importável diretamente por Dart |
| `game-content` | JSONs das 26 cartas, catálogo, validação de UUID/campos/baralhos e lore | `game-core` | cartas já têm fonte JSON; lore continua definido em TypeScript |
| `game-ai` | observação sanitizada, opções legais e decisão por dificuldade/estratégia | `game-core` | independente de React; sem representação Dart ou serviço separado |
| `game-online` | `AuthorizedGameView`, snapshots, salas e mensagens cliente/servidor | `game-core` | contratos são TypeScript; os payloads JSON são interoperáveis, mas não há schema externo versionado |
| `balance-lab` | agentes, simulações, cobertura, auditorias e relatórios | `game-ai`, `game-content`, `game-core` | Node/TypeScript; não faz parte do runtime de cliente |

Não foi criado um package novo apenas para preencher a árvore de referência. `game-contracts` e `game-assets` ficam como decisões futuras no plano de migração.

## Dependências entre módulos

```text
apps/web ────────> game-core
     ├───────────> game-content ─────> game-core
     ├───────────> game-ai ──────────> game-core
     └───────────> game-online ──────> game-core

apps/api ────────> game-content
     ├───────────> game-online ──────> game-core
     └───────────> game-core

balance-lab ─────> game-ai ──────────> game-core
     ├───────────> game-content
     └───────────> game-core
```

Não foi identificado um ciclo de dependências entre packages. O `game-core` não importa React, Fastify, DOM, áudio, JSON ou filesystem. O `game-content` valida conteúdo e não duplica combate. O Audio Engine depende apenas da camada Web e observa eventos/trace; não foi colocado no motor.

## Dados oficiais e conteúdo

- As definições de cartas vivem em [`packages/game-content/cards`](../../packages/game-content/cards) como JSONs individuais.
- O UUID de cada definição é permanente; instâncias e baralhos continuam a ser conceitos do `game-core`.
- A Web descobre JSONs com `import.meta.glob`; o servidor Node enumera os mesmos JSONs com `node:fs` e passa-os pelo carregador/validador partilhado.
- `packages/game-content/src/lore/catalog.ts` ainda contém lore TypeScript, portanto não é hoje uma fonte de dados multiplataforma tão direta quanto as cartas.
- Não existe `game-config.json` canónico; constantes de regras continuam no `game-core`, conforme a arquitetura vigente.

Conclusão: não se deve mover ou duplicar o catálogo nesta tarefa. Uma eventual extração para `data/` canónico precisa de comparar todos os valores e preservar os UUIDs através de testes de equivalência.

## Assets

Os assets atuais são Web-específicos em [`apps/web/public/images`](../../apps/web/public/images) e [`apps/web/public/audio`](../../apps/web/public/audio), com referências `/images/...` e `/audio/...` no catálogo, manifesto e componentes. Existem PNG, SVG, WebP, OGG, MP3 e WAV de cartas, fundos, branding, VFX, música e SFX.

O Audio Engine usa caminhos `/audio/...` definidos no [`audioManifest.ts`](../../apps/web/src/shared/audio/audioManifest.ts). Existem atualmente 19 IDs prontos, com 23 ficheiros licenciados integrados em MP3, OGG e WAV. A rastreabilidade está em [`SOULS-AUDIO-LICENSES.md`](../../SOULS-AUDIO-LICENSES.md) e a implementação em [`SOULS-AUDIO-ENGINE-v1.0-implementation.md`](../SOULS-AUDIO-ENGINE-v1.0-implementation.md).

Não foi criada uma cópia para Flutter nem um package de assets vazio. A futura fonte canónica deve ser escolhida antes de qualquer movimento físico, com validação de referências, nomes, IDs e licenças; a seleção de áudio atual já tem rastreabilidade, mas continua Web-only.

## Contratos e comunicação

O contrato online atual está em [`packages/game-online/src/index.ts`](../../packages/game-online/src/index.ts). Ele define:

- comandos de deck, ready, ações de partida, rematch e saída;
- mensagens de hello, snapshots, aceitação/rejeição, erros e encerramento;
- `AuthorizedGameView` com mão do próprio jogador e informação pública filtrada;
- eventos online públicos e `CombatResolutionTrace`.

Os objetos são serializáveis em JSON, mas a origem formal ainda é TypeScript. Não há JSON Schema, OpenAPI para os payloads ou geração de modelos Dart. Alterar esse contrato sem versionamento seria uma mudança de risco alto; a migração segura proposta mantém o formato atual e introduz schemas apenas em fase própria.

## Browser e Node

| Dependência | Local atual | Implicação futura |
|---|---|---|
| `import.meta.glob` | `game-content` browser loader | não pode ser usado pelo Node/Flutter; já existe loader Node separado |
| `node:fs`, `node:crypto`, `node:url` | API e Balance Lab | não devem entrar em `game-core`/modelo partilhado |
| DOM, `window`, `document`, WebSocket browser, `localStorage` | `apps/web` | devem ficar nos adapters/presentation Web |
| Fastify/`ws` | `apps/api` | Flutter comunica por HTTP/WebSocket, não importa estes módulos |
| `HTMLAudioElement`/Web Audio | `apps/web/src/shared/audio` | Flutter terá playback nativo próprio usando os mesmos ficheiros |

## Scripts e package manager

O projeto usa npm workspaces e `package-lock.json`. Os comandos atuais são:

| Comando | Função |
|---|---|
| `npm install` | instala dependências do workspace |
| `npm run dev:web` | inicia Vite Web |
| `npm run dev:api` | inicia API Node em watch |
| `npm run lint` | ESLint de todo o repositório |
| `npm run typecheck` | typecheck dos workspaces |
| `npm run test:ci` | testes dos workspaces |
| `npm run build` | build dos workspaces e bundle Vite |
| `npm run balance:smoke` / `balance:*` | Balance Lab existente |
| `npm run fixtures:validate` | valida as fixtures JSON portáteis adicionadas nesta preparação |

Não foi alterado o package manager nem renomeado qualquer script existente.

## Estado de validação auditado

Antes da documentação multiplataforma, a implementação existente e o Audio Engine passaram `npm run lint`, `npm run typecheck`, `npm run test:ci` e `npm run build`. Depois das fixtures, `npm run fixtures:validate` validou três cenários de combate contra o `game-core` compilado.

## Problemas e limites arquiteturais

1. `game-online` mistura contratos de rede e visão autorizada; é reutilizável, mas ainda não é uma origem schema-first para Dart.
2. Cartas estão em JSON, porém lore e algumas configurações continuam em TypeScript.
3. Assets só têm organização física Web; não existe pipeline comum Web/Mobile.
4. O loader Node está dentro da API e usa um caminho relativo para o workspace de conteúdo; é funcional, mas deve ser isolado antes de um empacotamento multiplataforma.
5. A API mantém salas em memória e não possui persistência/múltiplos processos, limitação já documentada e não relacionada com Flutter.
6. Não há CI/CD ou deployment configurado no repositório auditado.
7. `game-core` e `game-ai` não têm fixtures JSON de estado completo; a primeira base portátil adicionada cobre apenas resolução de coluna.

## Elementos já preparados

- separação clara de `game-core`, conteúdo, IA, rede, Web e API;
- JSON de cartas com UUIDs permanentes;
- operações/eventos determinísticos e `RandomSource` injetável;
- visão online autorizada sem expor mãos privadas;
- testes Node/Web e scripts de build independentes;
- Audio Engine isolado na Web, com assets licenciados rastreados e playback específico de browser;
- fixtures JSON que podem ser lidas por outra linguagem.

## Elementos que precisam de adaptação futura

- schemas versionados para mensagens HTTP/WebSocket e geração/validação Dart;
- decisão de fonte canónica para lore, configurações e assets;
- pipeline de assets com destinos Web/Mobile sem duplicações manuais;
- estratégia para IA offline em Dart ou serviço autoritativo;
- fixtures de estado/commands/events para compra, Souls, retirada e vitória;
- criação real de `apps/mobile` numa tarefa separada.
