export const appConfig = {
  name: 'SOULS',
  stageLabel: 'Fase 0 — protótipo técnico',
  apiBaseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  onlineWebSocketUrl: import.meta.env.VITE_WS_URL ?? 'ws://localhost:3000/online'
} as const;
