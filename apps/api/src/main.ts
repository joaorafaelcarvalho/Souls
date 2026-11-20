import { loadConfig } from './app/config/environment.ts';
import { buildServer } from './app/server.ts';

const config = loadConfig();
const server = buildServer({ allowedOrigin: config.webOrigin });

try {
  await server.listen({ host: config.host, port: config.port });
} catch (error) {
  server.log.error(error);
  process.exitCode = 1;
}
