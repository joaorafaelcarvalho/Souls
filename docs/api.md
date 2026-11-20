# API

## Estado atual

A API é uma aplicação Fastify em [apps/api](../apps/api). Além do endpoint técnico, expõe a criação/entrada em salas privadas e o transporte WebSocket do PvP Online. As salas e partidas vivem em memória.

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

## PvP Online

### `POST /online/rooms`

Cria uma sala privada e devolve `room.roomId`, `room.roomCode`, `room.selfPlayerId` e `sessionToken`.

### `POST /online/rooms/join`

Recebe `{ "roomCode": "AB7K2Q" }`, associa o segundo participante e devolve a credencial privada dessa sessão.

### `GET/Upgrade /online`

O endpoint WebSocket recebe primeiro um `hello` com `roomId` e `sessionToken`. Depois aceita comandos de lobby e partida e publica snapshots autorizados. O token não é colocado na URL.

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

## Limites

Não há contas de utilizador, matchmaking público, persistência, ranking ou escalabilidade horizontal. Reiniciar o processo elimina as salas e partidas em memória. Consulte [SOULS-PVP-ONLINE-v1.0-implementation.md](./SOULS-PVP-ONLINE-v1.0-implementation.md) para o protocolo, configuração e teste em dois computadores.
