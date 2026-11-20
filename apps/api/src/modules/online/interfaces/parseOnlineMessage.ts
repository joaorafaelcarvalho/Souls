import type { OnlineAction, OnlineClientMessage } from '@souls/game-online';

const MAX_STRING_LENGTH = 160;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function boundedString(value: unknown, maximum = MAX_STRING_LENGTH): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= maximum;
}

function parseAction(value: unknown): OnlineAction | null {
  if (!isRecord(value) || !boundedString(value.type, 40)) return null;

  switch (value.type) {
    case 'place-card':
      return boundedString(value.instanceId, 80)
        && typeof value.row === 'number'
        && Number.isInteger(value.row)
        && typeof value.column === 'number'
        && Number.isInteger(value.column)
        ? { type: value.type, instanceId: value.instanceId, row: value.row, column: value.column }
        : null;
    case 'retire-card':
      return boundedString(value.instanceId, 80)
        ? { type: value.type, instanceId: value.instanceId }
        : null;
    case 'finish-positioning':
    case 'resolve-draw':
    case 'resolve-attack':
      return { type: value.type };
    default:
      return null;
  }
}

export function parseOnlineClientMessage(value: unknown): OnlineClientMessage | null {
  if (!isRecord(value) || !boundedString(value.type, 40)) return null;

  switch (value.type) {
    case 'hello':
      return boundedString(value.roomId, 100) && boundedString(value.sessionToken, 200)
        ? { type: value.type, roomId: value.roomId, sessionToken: value.sessionToken }
        : null;
    case 'select-deck':
      return boundedString(value.commandId)
        && Array.isArray(value.deck)
        && value.deck.length <= 20
        && value.deck.every((cardId) => boundedString(cardId, 100))
        ? { type: value.type, commandId: value.commandId, deck: value.deck }
        : null;
    case 'set-ready':
      return boundedString(value.commandId) && typeof value.ready === 'boolean'
        ? { type: value.type, commandId: value.commandId, ready: value.ready }
        : null;
    case 'command': {
      const action = parseAction(value.action);
      return boundedString(value.commandId)
        && boundedString(value.matchId, 100)
        && typeof value.expectedVersion === 'number'
        && Number.isInteger(value.expectedVersion)
        && value.expectedVersion >= 0
        && action !== null
        ? {
            type: value.type,
            commandId: value.commandId,
            matchId: value.matchId,
            expectedVersion: value.expectedVersion,
            action
          }
        : null;
    }
    case 'accept-rematch':
      return boundedString(value.commandId) && boundedString(value.matchId, 100)
        ? { type: value.type, commandId: value.commandId, matchId: value.matchId }
        : null;
    case 'leave-room':
      return boundedString(value.commandId)
        ? { type: value.type, commandId: value.commandId }
        : null;
    default:
      return null;
  }
}
