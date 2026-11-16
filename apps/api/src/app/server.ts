import Fastify, { type FastifyInstance } from 'fastify';
import { registerHealthRoute } from '../modules/health/interfaces/registerHealthRoute.ts';

export function buildServer(): FastifyInstance {
  const server = Fastify({ logger: false });

  registerHealthRoute(server);

  return server;
}