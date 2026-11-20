export interface ApiConfig {
  readonly host: string;
  readonly port: number;
  readonly webOrigin: string;
}

export type Environment = Readonly<Record<string, string | undefined>>;

function parsePort(value: string | undefined): number {
  if (value === undefined || value.trim() === '') {
    return 3000;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }

  return port;
}

export function loadConfig(environment: Environment = process.env): ApiConfig {
  return {
    host: environment.HOST ?? '127.0.0.1',
    port: parsePort(environment.PORT),
    webOrigin: environment.WEB_ORIGIN ?? 'http://localhost:5173'
  };
}
