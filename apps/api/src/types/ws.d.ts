declare module 'ws' {
  import type { IncomingMessage } from 'node:http';
  import type { Duplex } from 'node:stream';

  export type RawData = string | Buffer | ArrayBuffer | readonly Buffer[];

  export class WebSocket {
    public constructor(url: string);
    public static readonly OPEN: number;
    public readonly readyState: number;
    public send(data: string): void;
    public close(): void;
    public on(event: 'open', listener: () => void): this;
    public on(event: 'message', listener: (data: RawData) => void): this;
    public on(event: 'close', listener: () => void): this;
    public on(event: 'error', listener: (error: Error) => void): this;
  }

  export class WebSocketServer {
    public constructor(options: { readonly noServer: true });
    public handleUpgrade(
      request: IncomingMessage,
      socket: Duplex,
      head: Buffer,
      callback: (client: WebSocket) => void
    ): void;
    public on(event: 'connection', listener: (client: WebSocket, request: IncomingMessage) => void): this;
    public emit(event: 'connection', client: WebSocket, request: IncomingMessage): boolean;
    public close(callback?: () => void): void;
  }
}
