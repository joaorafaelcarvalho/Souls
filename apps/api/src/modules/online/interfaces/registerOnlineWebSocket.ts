import type { FastifyInstance } from 'fastify';
import type { IncomingMessage } from 'node:http';
import type { Duplex } from 'node:stream';
import { WebSocket, WebSocketServer, type RawData } from 'ws';
import type { OnlineServerMessage } from '@souls/game-online';
import { OnlineRoomError, type OnlineMessageSender, type OnlineRoomService } from '../application/onlineRoomService.ts';
import { parseOnlineClientMessage } from './parseOnlineMessage.ts';

function rawDataToString(data: RawData): string {
  if (typeof data === 'string') return data;
  if (data instanceof ArrayBuffer) return Buffer.from(data).toString('utf8');
  if (Array.isArray(data)) return Buffer.concat([...data]).toString('utf8');
  return data.toString('utf8');
}

function send(socket: WebSocket, message: OnlineServerMessage): void {
  if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(message));
}

function allowedOrigin(request: IncomingMessage, origin: string): boolean {
  const requestOrigin = request.headers.origin;
  return requestOrigin === undefined || origin === '*' || requestOrigin === origin;
}

export function registerOnlineWebSocket(
  server: FastifyInstance,
  service: OnlineRoomService,
  origin: string
): void {
  const socketServer = new WebSocketServer({ noServer: true });
  const upgradeHandler = (request: IncomingMessage, socket: Duplex, head: Buffer) => {
    const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
    if (requestUrl.pathname !== '/online' || !allowedOrigin(request, origin)) {
      socket.destroy();
      return;
    }

    socketServer.handleUpgrade(request, socket, head, (client) => {
      socketServer.emit('connection', client, request);
    });
  };

  server.server.on('upgrade', upgradeHandler);
  socketServer.on('connection', (socket) => {
    let session: { readonly roomId: string; readonly sessionToken: string; readonly sender: OnlineMessageSender } | null = null;
    const sender: OnlineMessageSender = (message) => send(socket, message);

    socket.on('message', (data) => {
      const payload = rawDataToString(data);
      if (payload.length > 64 * 1024) {
        send(socket, { type: 'online-error', code: 'payload-too-large', message: 'A mensagem é demasiado grande.' });
        socket.close();
        return;
      }

      let parsedJson: unknown;
      try {
        parsedJson = JSON.parse(payload);
      } catch {
        send(socket, { type: 'online-error', code: 'invalid-message', message: 'A mensagem não é válida.' });
        return;
      }

      const message = parseOnlineClientMessage(parsedJson);
      if (message === null) {
        send(socket, { type: 'online-error', code: 'invalid-message', message: 'A mensagem não é válida.' });
        return;
      }

      if (session === null) {
        if (message.type !== 'hello') {
          send(socket, { type: 'online-error', code: 'session-required', message: 'A sessão ainda não foi identificada.' });
          return;
        }

        try {
          service.attach(message.roomId, message.sessionToken, sender);
          session = { roomId: message.roomId, sessionToken: message.sessionToken, sender };
        } catch (error) {
          const onlineError = error instanceof OnlineRoomError
            ? error
            : new OnlineRoomError('session-invalid', 'A sessão da sala não é válida.');
          send(socket, { type: 'online-error', code: onlineError.code, message: onlineError.message });
          socket.close();
        }
        return;
      }

      if (message.type === 'hello') {
        send(socket, { type: 'online-error', code: 'invalid-message', message: 'A sessão WebSocket já está identificada.' });
        return;
      }

      try {
        service.receive(session.roomId, session.sessionToken, message);
      } catch (error) {
        const onlineError = error instanceof OnlineRoomError
          ? error
          : new OnlineRoomError('invalid-command', 'Não foi possível processar a mensagem.');
        send(socket, { type: 'online-error', code: onlineError.code, message: onlineError.message });
      }
    });

    socket.on('close', () => {
      if (session !== null) service.detach(session.roomId, session.sessionToken, session.sender);
    });
  });

  server.addHook('onClose', async () => {
    server.server.off('upgrade', upgradeHandler);
    await new Promise<void>((resolve) => socketServer.close(() => resolve()));
  });
}
