# Arquitetura backend

## Objetivo

A API é uma aplicação Fastify mínima. A estrutura está preparada para módulos por funcionalidade e para um futuro caso de uso autoritativo, sem implementar capacidades não aprovadas.

## Organização

```text
apps/api/src/
├── app/
│   ├── config/
│   │   └── environment.ts
│   ├── server.ts
│   └── ...
├── modules/
│   ├── health/
│   └── online/
│       ├── application/onlineRoomService.ts
│       ├── infrastructure/loadServerCardCatalog.ts
│       └── interfaces/
└── main.ts
```

### Application

`OnlineRoomService` coordena salas, tokens anónimos, lobby, versões e comandos. Cada comando válido chama diretamente uma operação do game-core e publica uma projeção por jogador.

### Domain

O domínio de jogo é partilhado em [game-core](../../packages/game-core). O backend não possui uma segunda implementação das regras.

### Infrastructure

O catálogo do servidor é descoberto no workspace e validado através de game-content. Salas e partidas usam armazenamento em memória; não há base de dados nem serviço externo.

### Interfaces

As rotas HTTP ficam em `registerOnlineRoutes`; o Upgrade WebSocket fica em `registerOnlineWebSocket`; o parser rejeita payloads desconhecidos ou demasiado grandes.

## Execução

- [server.ts](../../apps/api/src/app/server.ts) compõe o Fastify;
- [environment.ts](../../apps/api/src/app/config/environment.ts) valida HOST e PORT;
- [main.ts](../../apps/api/src/main.ts) inicia o processo;
- o teste usa `server.inject` sem abrir uma porta real.

## Direção futura

O backend recebe intenções, valida a sessão, a sala, o participante, a versão e a fase, executa game-core e devolve eventos/snapshots autorizados. Persistência após reinício e coordenação entre instâncias continuam pendentes.
