import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { OnlineRoomError, type OnlineRoomService } from '../application/onlineRoomService.ts';

interface JoinBody {
  readonly roomCode?: unknown;
}

function errorStatus(error: OnlineRoomError): number {
  switch (error.code) {
    case 'room-not-found':
    case 'session-invalid':
      return 404;
    case 'room-full':
    case 'match-already-started':
      return 409;
    case 'rate-limited':
      return 429;
    default:
      return 400;
  }
}

function sendError(reply: FastifyReply, error: unknown): FastifyReply {
  if (error instanceof OnlineRoomError) {
    return reply.code(errorStatus(error)).send({ error: { code: error.code, message: error.message } });
  }

  return reply.code(500).send({ error: { code: 'online-unavailable', message: 'O serviço online não está disponível.' } });
}

class RequestRateLimiter {
  private readonly entries = new Map<string, { count: number; resetAt: number }>();

  public check(key: string, now: number): boolean {
    const current = this.entries.get(key);
    if (current === undefined || current.resetAt <= now) {
      this.entries.set(key, { count: 1, resetAt: now + 60_000 });
      return true;
    }
    if (current.count >= 30) return false;
    current.count += 1;
    return true;
  }
}

export function registerOnlineRoutes(server: FastifyInstance, service: OnlineRoomService): void {
  const limiter = new RequestRateLimiter();

  server.post('/online/rooms', async (request, reply) => {
    if (!limiter.check(request.ip, Date.now())) {
      return sendError(reply, new OnlineRoomError('rate-limited', 'Demasiadas tentativas. Tenta novamente dentro de pouco tempo.'));
    }

    try {
      return reply.code(201).send(service.createRoom());
    } catch (error) {
      return sendError(reply, error);
    }
  });

  server.post('/online/rooms/join', async (request: FastifyRequest<{ Body: JoinBody }>, reply) => {
    if (!limiter.check(request.ip, Date.now())) {
      return sendError(reply, new OnlineRoomError('rate-limited', 'Demasiadas tentativas. Tenta novamente dentro de pouco tempo.'));
    }

    const body = request.body;
    if (body === null || typeof body !== 'object' || typeof body.roomCode !== 'string') {
      return sendError(reply, new OnlineRoomError('invalid-room-code', 'Introduz um código de sala válido.'));
    }

    try {
      return reply.code(200).send(service.joinRoom(body.roomCode));
    } catch (error) {
      return sendError(reply, error);
    }
  });
}
