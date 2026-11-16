# Decisões

Este documento separa decisões confirmadas pelo brief de propostas que ainda não são convenções oficiais.

## Decisões aprovadas nesta fundação

### D-001 — Workspace modular

Código separado em `apps/web`, `apps/api`, `packages/game-core` e `packages/game-content`.

### D-002 — Game-core independente

O motor usa TypeScript, tipos, funções puras e resultados explícitos. Não importa conteúdo, React, Fastify, DOM, HTTP ou persistência.

### D-003 — Catálogo separado do motor

Definições JSON, validação, descoberta e imagens pertencem ao game-content. O motor recebe contratos e não lê ficheiros.

### D-004 — UUIDs separados

CardDefinition usa UUID permanente. CardInstance usa UUID gerado por partida e referencia a definição através de `cardDefinitionId`.

### D-005 — Baralhos por referências

Baralhos de configuração têm 20 UUIDs de definições. Não há regra de limite de cópias.

### D-006 — Aleatoriedade injetável

A inicialização recebe fontes injetáveis para baralhamento e UUIDs, permitindo testes repetíveis.

### D-007 — Transformações imutáveis

As operações devolvem novo estado e eventos, preservando a entrada.

### D-008 — Sem Git, GitHub ou publicação

A fundação é exclusivamente local. Não há repositório, branches, commits, remotes, `.github/`, CI/CD ou deploy.

## Propostas pendentes

### P-001 — Contratos da API de partidas

Ainda não estão definidos protocolo, autenticação, modelo de sessão, transporte em tempo real, versionamento ou autorização.

### P-002 — Consulta de conteúdo pelo backend

O backend poderá consultar definições através de um contrato futuro, mas ainda não há endpoint, formato de resposta ou política de versionamento aprovados.

### P-003 — Persistência

PostgreSQL é apenas uma possibilidade futura. Nenhum schema, ORM, migração ou política de retenção foi escolhido.

### P-004 — Conteúdo e direção artística

As cartas atuais são exemplos técnicos. Não foram aprovadas cartas definitivas, habilidades, valores de balanceamento, tokens visuais finais ou direção artística.

## Como propor uma nova decisão

Descreva o problema, opções, impacto sobre regras/contratos/módulos, testes e necessidade de aprovação. Uma proposta não se torna decisão oficial apenas por ter sido implementada num ficheiro.