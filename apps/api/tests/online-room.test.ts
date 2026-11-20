import { describe, expect, it } from 'vitest';
import { WebSocket } from 'ws';
import { buildServer } from '../src/app/server.ts';
import { loadServerCardCatalog } from '../src/modules/online/infrastructure/loadServerCardCatalog.ts';
import { OnlineRoomService } from '../src/modules/online/application/onlineRoomService.ts';
import type { OnlineServerMessage } from '@souls/game-online';

function officialDeck(): readonly string[] {
  const catalog = loadServerCardCatalog();
  const quantityByLevel = { 0: 10, 1: 4, 2: 3, 3: 2, 4: 1 } as const;
  return ([0, 1, 2, 3, 4] as const).flatMap((level) => {
    const definition = catalog.definitions.find((card) => card.level === level);
    return definition === undefined ? [] : Array.from({ length: quantityByLevel[level] }, () => definition.id);
  });
}

function latestMatch(messages: readonly OnlineServerMessage[]) {
  return [...messages].reverse().find((message) => message.type === 'match-updated');
}

function createReadyService() {
  const service = new OnlineRoomService({
    catalog: loadServerCardCatalog(),
    randomSource: { next: () => 0 }
  });
  const created = service.createRoom();
  const joined = service.joinRoom(created.room.roomCode);
  const playerOneMessages: OnlineServerMessage[] = [];
  const playerTwoMessages: OnlineServerMessage[] = [];
  service.attach(created.room.roomId, created.sessionToken, (message) => playerOneMessages.push(message));
  service.attach(joined.room.roomId, joined.sessionToken, (message) => playerTwoMessages.push(message));
  const deck = officialDeck();
  service.receive(created.room.roomId, created.sessionToken, { type: 'select-deck', commandId: 'deck-1', deck });
  service.receive(joined.room.roomId, joined.sessionToken, { type: 'select-deck', commandId: 'deck-2', deck });
  service.receive(created.room.roomId, created.sessionToken, { type: 'set-ready', commandId: 'ready-1', ready: true });
  service.receive(joined.room.roomId, joined.sessionToken, { type: 'set-ready', commandId: 'ready-2', ready: true });
  return { service, created, joined, playerOneMessages, playerTwoMessages };
}

describe('online room service', () => {
  it('creates private rooms, joins a second participant and rejects a third', () => {
    const service = new OnlineRoomService({ catalog: loadServerCardCatalog() });
    const created = service.createRoom();
    const joined = service.joinRoom(created.room.roomCode);

    expect(created.room.roomCode).toMatch(/^[A-HJ-NP-Z2-9]{6}$/);
    expect(created.sessionToken).not.toBe(joined.sessionToken);
    expect(joined.room.participants).toHaveLength(2);
    expect(() => service.joinRoom(created.room.roomCode)).toThrowError('A sala já tem dois participantes.');
    expect(() => service.joinRoom('AAAAAA')).toThrowError('A sala não existe ou já expirou.');
  });

  it('validates decks on the server and starts one authoritative match', () => {
    const { service, created, joined, playerOneMessages, playerTwoMessages } = createReadyService();
    const playerOneMatch = latestMatch(playerOneMessages);
    const playerTwoMatch = latestMatch(playerTwoMessages);

    expect(playerOneMatch?.type).toBe('match-updated');
    expect(playerTwoMatch?.type).toBe('match-updated');
    if (playerOneMatch?.type !== 'match-updated' || playerTwoMatch?.type !== 'match-updated') return;

    expect(playerOneMatch.snapshot.view.players[2].hand).toBeNull();
    expect(playerTwoMatch.snapshot.view.players[1].hand).toBeNull();
    const opponentHandId = playerTwoMatch.snapshot.view.viewer.hand[0];
    expect(opponentHandId).toBeDefined();
    if (opponentHandId !== undefined) {
      expect(playerOneMatch.snapshot.view.visibleCardInstances[opponentHandId]).toBeUndefined();
    }

    const firstHandId = playerOneMatch.snapshot.view.viewer.hand[0];
    expect(firstHandId).toBeDefined();
    if (firstHandId === undefined) return;
    const definition = playerOneMatch.snapshot.view.cardDefinitions[
      playerOneMatch.snapshot.view.visibleCardInstances[firstHandId]!.cardDefinitionId
    ];
    expect(definition).toBeDefined();
    if (definition === undefined) return;
    const row = definition.type === 'melee' ? 3 : 5;
    const messagesBeforeDuplicate = playerOneMessages.length;

    service.receive(created.room.roomId, created.sessionToken, {
      type: 'command',
      commandId: 'place-1',
      matchId: playerOneMatch.snapshot.matchId,
      expectedVersion: playerOneMatch.snapshot.version,
      action: { type: 'place-card', instanceId: firstHandId, row, column: 0 }
    });

    const placedMatch = latestMatch(playerOneMessages);
    expect(placedMatch?.type).toBe('match-updated');
    if (placedMatch?.type !== 'match-updated') return;
    expect(placedMatch.snapshot.version).toBe(1);
    expect(placedMatch.snapshot.view.board.occupants[`${row},0`]).toBe(firstHandId);

    service.receive(created.room.roomId, created.sessionToken, {
      type: 'command',
      commandId: 'place-1',
      matchId: playerOneMatch.snapshot.matchId,
      expectedVersion: playerOneMatch.snapshot.version,
      action: { type: 'place-card', instanceId: firstHandId, row, column: 0 }
    });
    expect(playerOneMessages.length).toBe(messagesBeforeDuplicate + 4);

    service.receive(created.room.roomId, created.sessionToken, {
      type: 'command',
      commandId: 'stale-1',
      matchId: placedMatch.snapshot.matchId,
      expectedVersion: 0,
      action: { type: 'finish-positioning' }
    });
    expect(playerOneMessages.at(-1)).toMatchObject({ type: 'command-rejected', code: 'stale-state' });
    expect(playerTwoMessages.at(-1)).toMatchObject({ type: 'match-updated' });
    expect(joined.room.roomId).toBe(created.room.roomId);
  });

  it('rejects a draw command from the participant who is not active', () => {
    const { service, joined, playerOneMessages, playerTwoMessages } = createReadyService();
    const playerOneMatch = latestMatch(playerOneMessages);
    const playerTwoMatch = latestMatch(playerTwoMessages);

    expect(playerOneMatch?.type).toBe('match-updated');
    expect(playerTwoMatch?.type).toBe('match-updated');
    if (playerOneMatch?.type !== 'match-updated' || playerTwoMatch?.type !== 'match-updated') return;

    expect(playerOneMatch.snapshot.view.activePlayerId).toBe(1);
    expect(playerTwoMatch.snapshot.view.activePlayerId).toBe(1);

    service.receive(joined.room.roomId, joined.sessionToken, {
      type: 'command',
      commandId: 'draw-out-of-turn',
      matchId: playerTwoMatch.snapshot.matchId,
      expectedVersion: playerTwoMatch.snapshot.version,
      action: { type: 'resolve-draw' }
    });

    expect(playerTwoMessages.at(-1)).toMatchObject({
      type: 'command-rejected',
      code: 'wrong-active-player'
    });
    expect(latestMatch(playerOneMessages)?.type).toBe('match-updated');
    if (latestMatch(playerOneMessages)?.type === 'match-updated') {
      expect(latestMatch(playerOneMessages)?.snapshot.version).toBe(0);
    }
  });

  it('rejects invalid deck references without accepting client attributes', () => {
    const service = new OnlineRoomService({ catalog: loadServerCardCatalog() });
    const created = service.createRoom();
    const messages: OnlineServerMessage[] = [];
    service.attach(created.room.roomId, created.sessionToken, (message) => messages.push(message));

    service.receive(created.room.roomId, created.sessionToken, {
      type: 'select-deck',
      commandId: 'bad-deck',
      deck: Array.from({ length: 20 }, () => 'not-a-card-definition')
    });

    expect(messages.at(-1)).toMatchObject({ type: 'command-rejected', code: 'invalid-deck' });
  });

  it('keeps disconnected rooms recoverable until the configured expiry', () => {
    let now = 0;
    const service = new OnlineRoomService({ catalog: loadServerCardCatalog(), now: () => now, roomTtlMs: 100 });
    const created = service.createRoom();
    const messages: OnlineServerMessage[] = [];
    service.attach(created.room.roomId, created.sessionToken, (message) => messages.push(message));
    service.detach(created.room.roomId, created.sessionToken);

    now = 99;
    expect(service.cleanupExpiredRooms()).toBe(0);
    now = 101;
    expect(service.cleanupExpiredRooms()).toBe(1);
    expect(service.getRoomCount()).toBe(0);
    expect(messages.some((message) => message.type === 'room-closed')).toBe(false);
  });

  it('exposes room creation over HTTP and authenticates the WebSocket with the private token', async () => {
    const server = buildServer({ catalog: loadServerCardCatalog() });
    await server.listen({ host: '127.0.0.1', port: 0 });
    const address = server.server.address();
    if (address === null || typeof address === 'string') {
      await server.close();
      throw new Error('The test server did not expose a TCP address.');
    }

    try {
      const response = await fetch(`http://127.0.0.1:${address.port}/online/rooms`, { method: 'POST' });
      expect(response.status).toBe(201);
      const created = await response.json() as { room: { roomId: string }; sessionToken: string };
      const messages: OnlineServerMessage[] = [];
      const socket = new WebSocket(`ws://127.0.0.1:${address.port}/online`);
      const hello = new Promise<OnlineServerMessage>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Timed out waiting for WebSocket authentication.')), 2_000);
        socket.on('message', (data) => {
          const message = JSON.parse(String(data)) as OnlineServerMessage;
          messages.push(message);
          if (message.type === 'hello-accepted') {
            clearTimeout(timeout);
            resolve(message);
          }
        });
        socket.on('error', reject);
      });
      socket.on('open', () => socket.send(JSON.stringify({
        type: 'hello',
        roomId: created.room.roomId,
        sessionToken: created.sessionToken
      })));

      const accepted = await hello;
      expect(accepted).toMatchObject({ type: 'hello-accepted', room: { roomId: created.room.roomId } });
      expect(JSON.stringify(messages)).not.toContain(created.sessionToken);
      await new Promise<void>((resolve) => {
        socket.on('close', () => resolve());
        socket.close();
      });
    } finally {
      await server.close();
    }
  });
});
