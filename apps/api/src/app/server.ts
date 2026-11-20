import Fastify, { type FastifyInstance } from 'fastify';
import type { CardCatalog } from '@souls/game-content';
import { registerHealthRoute } from '../modules/health/interfaces/registerHealthRoute.ts';
import { OnlineRoomService } from '../modules/online/application/onlineRoomService.ts';
import { loadServerCardCatalog } from '../modules/online/infrastructure/loadServerCardCatalog.ts';
import { registerOnlineRoutes } from '../modules/online/interfaces/registerOnlineRoutes.ts';
import { registerOnlineWebSocket } from '../modules/online/interfaces/registerOnlineWebSocket.ts';

export interface ServerOptions {
  readonly catalog?: CardCatalog;
  readonly onlineService?: OnlineRoomService;
  readonly allowedOrigin?: string;
}

export function buildServer(options: ServerOptions = {}): FastifyInstance {
  const server = Fastify({ logger: false });
  const onlineService = options.onlineService ?? new OnlineRoomService({
    catalog: options.catalog ?? loadServerCardCatalog()
  });
  const allowedOrigin = options.allowedOrigin ?? process.env.WEB_ORIGIN ?? 'http://localhost:5173';
  const cleanupTimer = setInterval(() => onlineService.cleanupExpiredRooms(), 60_000);
  cleanupTimer.unref?.();

  server.addHook('onClose', async () => {
    clearInterval(cleanupTimer);
  });

  server.addHook('onRequest', async (request, reply) => {
    reply.header('Access-Control-Allow-Origin', allowedOrigin);
    reply.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    reply.header('Access-Control-Allow-Headers', 'content-type');
    if (request.method === 'OPTIONS') {
      await reply.code(204).send();
      return;
    }
  });

  registerHealthRoute(server);
  registerOnlineRoutes(server, onlineService);
  registerOnlineWebSocket(server, onlineService, allowedOrigin);

  return server;
}
