import { afterEach, describe, expect, it } from 'vitest';
import { buildServer } from '../src/app/server.ts';

describe('health endpoint', () => {
  let server = buildServer();

  afterEach(async () => {
    await server.close();
    server = buildServer();
  });

  it('returns a technical readiness response', async () => {
    const response = await server.inject({ method: 'GET', url: '/health' });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      status: 'ok',
      service: 'souls-api'
    });
  });
});