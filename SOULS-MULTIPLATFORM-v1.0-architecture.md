# SOULS — Multiplatform Architecture v1.0

## Resumo executivo

O SOULS já possui uma base monorepo adequada para crescer de Web para Android/iOS: `game-core` concentra as regras, `game-content` mantém cartas JSON, `game-ai` é independente de React, `game-online` define a visão autorizada e `apps/api` executa partidas online no servidor.

Esta entrega prepara o crescimento sem migrar pastas centrais, trocar o package manager, alterar o protocolo online, criar Flutter ou duplicar o motor. O estado detalhado está em:

- [`CURRENT-ARCHITECTURE.md`](docs/architecture/CURRENT-ARCHITECTURE.md) — auditoria da árvore e dependências reais;
- [`MULTIPLATFORM-MIGRATION-PLAN.md`](docs/architecture/MULTIPLATFORM-MIGRATION-PLAN.md) — caminhos, riscos, testes e reversão;
- [`FLUTTER-ARCHITECTURE.md`](docs/mobile/FLUTTER-ARCHITECTURE.md) — proposta futura para Dart/Android/iOS;
- [`tests/game-fixtures/README.md`](tests/game-fixtures/README.md) — base atual de conformidade JSON.

## 1. Estado inicial

Existem `apps/web` React/Vite e `apps/api` Node/Fastify, além de `game-core`, `game-content`, `game-ai`, `game-online` e `balance-lab`. O package manager é npm, com `package-lock.json` e workspaces `apps/*`/`packages/*`.

Não existem `apps/mobile`, `game-contracts`, `game-assets`, schemas JSON/OpenAPI, workflows CI/CD ou deployment. O protocolo online atual é TypeScript em `game-online`, mas os payloads já são JSON serializáveis.

## 2. Responsabilidades preservadas

- Web mantém apresentação, navegação, estado visual, animações, áudio e adapters de browser.
- API mantém HTTP, WebSocket, salas, tokens, validação de comandos, privacidade e estado autoritativo online.
- `game-core` continua a única fonte normativa das regras e eventos.
- `game-content` continua a fonte das definições JSON e validações de catálogo/baralho.
- `game-ai` continua sem React/DOM e sem alterar o motor.
- `game-online` continua a ponte de visão autorizada e mensagens atuais.
- Balance Lab continua separado do runtime do cliente.

Nenhuma regra, carta, custo, Souls, turno, IA, protocolo existente ou resultado histórico foi alterado para esta preparação.

## 3. Estratégia de partilha

### Dados

As cartas JSON são a melhor base atual para Web e futuro Mobile. A extração de lore/configuração para um diretório canónico é uma etapa futura que precisa de testes de equivalência. UUIDs e valores nunca devem ser regenerados ou mantidos em duas listas manuais.

### Contratos

O primeiro passo futuro é formalizar os payloads existentes em schemas versionados, preservando compatibilidade. Os tipos TypeScript e modelos Dart devem ser gerados/validados a partir dessa origem comum quando a ferramenta escolhida for justificada.

### Assets

Não foi criado um package de assets vazio nem feita uma migração estrutural dos recursos Web. A Web já contém uma primeira seleção de 19 IDs/23 ficheiros de áudio licenciados, com rastreabilidade em `SOULS-AUDIO-LICENSES.md`. O futuro pipeline deve manter uma fonte canónica, manifests, hashes/licenças e adapters de destino. A reprodução de áudio será nativa por plataforma; os ficheiros/IDs podem ser comuns.

## 4. Web, Backend e Flutter

O modo online é a estratégia inicial de menor risco: Web ou Flutter enviam comandos ao mesmo backend Node, que executa `game-core` e devolve snapshots autorizados. O Flutter nunca importa TypeScript diretamente.

O modo offline Flutter só deve existir após uma implementação Dart equivalente passar as fixtures independentes da linguagem. Até lá, não há autorização arquitetural para criar um segundo motor.

## 5. Alterações seguras efetuadas

- documentação da arquitetura atual e das fronteiras reais;
- plano de migração com impacto, risco, testes e reversão;
- proposta documentada para Flutter sem criar projeto Dart;
- três fixtures JSON de combate derivadas de testes oficiais;
- script `fixtures:validate`, executável em Windows e Unix através de Node e caminhos relativos;
- entrada `npm run fixtures:validate` sem alterar os scripts existentes.

## 6. Validação

As validações existentes do projeto continuam disponíveis:

```text
npm run lint
npm run typecheck
npm run test:ci
npm run build
npm run fixtures:validate
```

Na auditoria, `lint`, `typecheck`, `test:ci` e `build` estavam verdes após o Audio Engine; o novo `fixtures:validate` validou os três JSONs contra o `game-core` compilado. A preparação não adicionou dependências npm.

## 7. Migrações ainda pendentes

As seguintes ações são deliberadamente propostas, não executadas:

1. package/schema de contratos multiplataforma;
2. migração controlada de lore/configuração para dados canónicos;
3. pipeline comum de assets;
4. criação do projeto Flutter;
5. escolha da estratégia de IA Dart/serviço;
6. fixtures completas de estado, comandos e eventos para todos os fluxos oficiais.

Cada item exige revisão própria porque pode afetar imports, build, contratos, licenças, desempenho ou compatibilidade online.

## 8. Riscos e limitações

- dois motores TypeScript/Dart podem divergir se a conformidade não for automatizada;
- schemas introduzidos sem compatibilidade podem quebrar clientes online;
- mover assets pode quebrar URLs públicas e referências CSS/catalogadas;
- o backend atual mantém salas em memória;
- não há CI/CD/deployment auditável no repositório;
- o estado Git local não foi verificado porque as instruções do projeto proíbem executar Git nesta fase.

## 9. Próximos passos recomendados

1. aprovar o plano e escolher a estratégia schema-first;
2. ampliar as fixtures para compra, Souls, retirada, turnos e vitória;
3. validar contratos atuais com snapshots;
4. só então criar `apps/mobile` isolado;
5. começar pelo lobby/partida online Flutter antes de considerar modo offline.
