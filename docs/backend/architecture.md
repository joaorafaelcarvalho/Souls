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
│   └── health/
│       └── interfaces/
│           └── registerHealthRoute.ts
└── main.ts
```

### Application

Casos de uso futuros coordenarão comandos de partida e chamarão o game-core. Ainda não há um caso de uso de partida.

### Domain

O domínio de jogo é partilhado em [game-core](../../packages/game-core). O backend não possui uma segunda implementação das regras.

### Infrastructure

Persistência e integrações futuras devem entrar numa camada própria. Não há base de dados nem serviço externo nesta fase.

### Interfaces

As rotas e contratos de entrada/saída ficam em módulos de interface. A rota atual é um health check técnico.

## Execução

- [server.ts](../../apps/api/src/app/server.ts) compõe o Fastify;
- [environment.ts](../../apps/api/src/app/config/environment.ts) valida HOST e PORT;
- [main.ts](../../apps/api/src/main.ts) inicia o processo;
- o teste usa `server.inject` sem abrir uma porta real.

## Direção futura

O backend poderá receber intenções, validar a forma, carregar uma partida autorizada, executar game-core e devolver estado/eventos. O protocolo, a persistência e a autorização continuam pendentes.