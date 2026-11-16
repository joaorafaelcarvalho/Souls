# API

## Estado atual

A API é uma aplicação Fastify mínima em [apps/api](../apps/api). Nesta fase existe apenas um endpoint técnico. Não existem endpoints de partida, contas, autenticação, matchmaking, WebSockets, persistência ou autorização.

## Endpoint implementado

### `GET /health`

Resposta HTTP 200:

```json
{
  "status": "ok",
  "service": "souls-api"
}
```

Este endpoint confirma que o processo Fastify está a responder. Não é um health check de dependências externas, porque não existem dependências externas configuradas.

## Execução

```powershell
npm run dev:api
```

A configuração usa:

- `HOST`: por omissão `127.0.0.1`;
- `PORT`: por omissão `3000`, com valores inteiros entre 1 e 65535.

Em PowerShell:

```powershell
$env:PORT = "3001"
npm run dev:api
```

## Separação futura

A evolução prevista é:

1. a interface recebe uma intenção tipada;
2. valida o formato de entrada;
3. um caso de uso coordena o game-core;
4. o resultado autorizado devolve novo estado e eventos.

O protocolo, os contratos definitivos, a autenticação e o transporte em tempo real ainda não foram escolhidos. Não existe uma API fictícia para esses comportamentos.