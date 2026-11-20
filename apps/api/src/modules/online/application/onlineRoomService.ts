import { randomBytes, randomUUID } from 'node:crypto';
import {
  CatalogValidationError,
  validateOfficialDeckReferences,
  type CardCatalog
} from '@souls/game-content';
import {
  finishPositioningPhase,
  GameRuleError,
  initializeGame,
  placeCard,
  resolveAttackPhase,
  resolveDrawPhase,
  retireCard,
  type CardDefinitionId,
  type GameEvent,
  type GameOperationResult,
  type GameState,
  type PlayerId,
  type RandomSource,
  type UuidGenerator
} from '@souls/game-core';
import {
  createAuthorizedGameView,
  type CreateRoomResponse,
  type OnlineAction,
  type OnlineClientMessage,
  type OnlineGameEvent,
  type OnlineMatchSnapshot,
  type OnlineRoomSnapshot,
  type OnlineServerMessage
} from '@souls/game-online';

const ROOM_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const ROOM_CODE_LENGTH = 6;
const ROOM_CODE_PATTERN = /^[A-HJ-NP-Z2-9]{6}$/;
const DEFAULT_ROOM_TTL_MS = 30 * 60 * 1000;
const MAX_COMMAND_ID_LENGTH = 96;

export interface OnlineRoomServiceOptions {
  readonly catalog: CardCatalog;
  readonly now?: () => number;
  readonly roomTtlMs?: number;
  readonly randomSource?: RandomSource;
  readonly uuidGenerator?: UuidGenerator;
  readonly codeGenerator?: () => string;
  readonly tokenGenerator?: () => string;
}

export type OnlineMessageSender = (message: OnlineServerMessage) => void;

export class OnlineRoomError extends Error {
  public readonly code: string;

  public constructor(code: string, message: string) {
    super(message);
    this.name = 'OnlineRoomError';
    this.code = code;
  }
}

interface Participant {
  readonly playerId: PlayerId;
  readonly sessionToken: string;
  connected: boolean;
  deck?: readonly CardDefinitionId[];
  ready: boolean;
  rematchAccepted: boolean;
  sender: OnlineMessageSender | undefined;
  readonly processedCommands: Map<string, string>;
}

interface Room {
  readonly roomId: string;
  readonly roomCode: string;
  readonly participants: Map<PlayerId, Participant>;
  phase: OnlineRoomSnapshot['phase'];
  state?: GameState;
  matchId?: string;
  matchVersion: number;
  version: number;
  lastActivityAt: number;
}

class SecureRandomSource implements RandomSource {
  public next(): number {
    return randomBytes(4).readUInt32BE(0) / 0x1_0000_0000;
  }
}

class SecureUuidGenerator implements UuidGenerator {
  public next(): string {
    return randomUUID();
  }
}

function defaultCodeGenerator(): string {
  const bytes = randomBytes(ROOM_CODE_LENGTH);
  return Array.from(bytes, (byte) => ROOM_CODE_ALPHABET[byte % ROOM_CODE_ALPHABET.length]).join('');
}

function defaultTokenGenerator(): string {
  return randomBytes(32).toString('base64url');
}

function isCommandId(value: string): boolean {
  return value.length > 0 && value.length <= MAX_COMMAND_ID_LENGTH;
}

function publicEvent(event: GameEvent, viewerPlayerId: PlayerId): OnlineGameEvent {
  if (event.type === 'card-drawn' && event.playerId !== viewerPlayerId) {
    return {
      type: event.type,
      playerId: event.playerId,
      attempt: event.attempt
    };
  }

  return event;
}

function publicEvents(events: readonly GameEvent[], viewerPlayerId: PlayerId): readonly OnlineGameEvent[] {
  return events.map((event) => publicEvent(event, viewerPlayerId));
}

function isValidCoordinate(value: number, maximumExclusive: number): boolean {
  return Number.isInteger(value) && value >= 0 && value < maximumExclusive;
}

function isValidAction(action: OnlineAction): boolean {
  switch (action.type) {
    case 'place-card':
      return typeof action.instanceId === 'string'
        && isValidCoordinate(action.row, 6)
        && isValidCoordinate(action.column, 4);
    case 'retire-card':
      return typeof action.instanceId === 'string';
    case 'finish-positioning':
    case 'resolve-draw':
    case 'resolve-attack':
      return true;
    default:
      return false;
  }
}

export class OnlineRoomService {
  private readonly rooms = new Map<string, Room>();
  private readonly catalog: CardCatalog;
  private readonly now: () => number;
  private readonly roomTtlMs: number;
  private readonly randomSource: RandomSource;
  private readonly uuidGenerator: UuidGenerator;
  private readonly codeGenerator: () => string;
  private readonly tokenGenerator: () => string;

  public constructor(options: OnlineRoomServiceOptions) {
    this.catalog = options.catalog;
    this.now = options.now ?? Date.now;
    this.roomTtlMs = options.roomTtlMs ?? DEFAULT_ROOM_TTL_MS;
    this.randomSource = options.randomSource ?? new SecureRandomSource();
    this.uuidGenerator = options.uuidGenerator ?? new SecureUuidGenerator();
    this.codeGenerator = options.codeGenerator ?? defaultCodeGenerator;
    this.tokenGenerator = options.tokenGenerator ?? defaultTokenGenerator;
  }

  public createRoom(): CreateRoomResponse {
    this.cleanupExpiredRooms();
    let roomCode = this.codeGenerator().toUpperCase();
    let attempts = 0;
    while (this.findRoomByCode(roomCode) !== undefined && attempts < 10) {
      roomCode = this.codeGenerator().toUpperCase();
      attempts += 1;
    }

    if (!ROOM_CODE_PATTERN.test(roomCode) || this.findRoomByCode(roomCode) !== undefined) {
      throw new OnlineRoomError('room-unavailable', 'Não foi possível criar uma sala neste momento.');
    }

    const room: Room = {
      roomId: randomUUID(),
      roomCode,
      participants: new Map(),
      phase: 'lobby',
      matchVersion: 0,
      version: 0,
      lastActivityAt: this.now()
    };
    room.participants.set(1, this.createParticipant(1));
    this.rooms.set(room.roomId, room);

    return {
      room: this.snapshotFor(room, 1),
      sessionToken: this.participantFor(room, 1).sessionToken
    };
  }

  public joinRoom(roomCodeInput: string): CreateRoomResponse {
    this.cleanupExpiredRooms();
    const roomCode = roomCodeInput.trim().toUpperCase();
    if (!ROOM_CODE_PATTERN.test(roomCode)) {
      throw new OnlineRoomError('invalid-room-code', 'O código da sala não é válido.');
    }

    const room = this.findRoomByCode(roomCode);
    if (room === undefined) {
      throw new OnlineRoomError('room-not-found', 'A sala não existe ou já expirou.');
    }
    if (room.phase !== 'lobby') {
      throw new OnlineRoomError('match-already-started', 'A partida desta sala já começou.');
    }
    if (room.participants.has(2)) {
      throw new OnlineRoomError('room-full', 'A sala já tem dois participantes.');
    }

    room.participants.set(2, this.createParticipant(2));
    room.version += 1;
    room.lastActivityAt = this.now();
    this.broadcastRoom(room);

    return {
      room: this.snapshotFor(room, 2),
      sessionToken: this.participantFor(room, 2).sessionToken
    };
  }

  public attach(roomId: string, sessionToken: string, sender: OnlineMessageSender): OnlineRoomSnapshot {
    const room = this.requireRoom(roomId);
    const participant = this.requireParticipantByToken(room, sessionToken);
    participant.sender = sender;
    participant.connected = true;
    room.lastActivityAt = this.now();
    sender({ type: 'hello-accepted', room: this.snapshotFor(room, participant.playerId) });
    this.broadcastRoom(room);

    if (room.state !== undefined && room.matchId !== undefined) {
      sender({ type: 'match-updated', snapshot: this.matchSnapshot(room, participant.playerId, [], undefined) });
    }

    return this.snapshotFor(room, participant.playerId);
  }

  public detach(roomId: string, sessionToken: string, sender?: OnlineMessageSender): void {
    const room = this.rooms.get(roomId);
    if (room === undefined) return;
    const participant = this.findParticipantByToken(room, sessionToken, false);
    if (participant === undefined || (sender !== undefined && participant.sender !== sender)) return;

    participant.connected = false;
    participant.sender = undefined;
    room.lastActivityAt = this.now();
    room.version += 1;
    this.broadcastRoom(room);
  }

  public receive(roomId: string, sessionToken: string, message: OnlineClientMessage): void {
    const room = this.requireRoom(roomId);
    const participant = this.requireParticipantByToken(room, sessionToken);
    room.lastActivityAt = this.now();

    if (message.type === 'hello') {
      throw new OnlineRoomError('invalid-message', 'A sessão WebSocket já está autenticada.');
    }

    if (message.type === 'leave-room') {
      this.leaveRoom(room);
      return;
    }

    try {
      if (message.type === 'select-deck') {
        this.selectDeck(room, participant, message.commandId, message.deck);
        return;
      }

      if (message.type === 'set-ready') {
        this.setReady(room, participant, message.commandId, message.ready);
        return;
      }

      if (message.type === 'accept-rematch') {
        this.acceptRematch(room, participant, message.commandId, message.matchId);
        return;
      }

      if (message.type === 'command') {
        this.applyAction(room, participant, message.commandId, message.matchId, message.expectedVersion, message.action);
      }
    } catch (error) {
      const commandId = 'commandId' in message ? message.commandId : undefined;
      this.reject(participant, error, commandId, room.matchVersion);
    }
  }

  public cleanupExpiredRooms(now = this.now()): number {
    let removed = 0;
    for (const [roomId, room] of this.rooms) {
      if (now - room.lastActivityAt < this.roomTtlMs) continue;
      for (const participant of room.participants.values()) {
        participant.sender?.({ type: 'room-closed', reason: 'expired' });
      }
      this.rooms.delete(roomId);
      removed += 1;
    }
    return removed;
  }

  public getRoomCount(): number {
    return this.rooms.size;
  }

  private createParticipant(playerId: PlayerId): Participant {
    return {
      playerId,
      sessionToken: this.tokenGenerator(),
      connected: false,
      ready: false,
      rematchAccepted: false,
      sender: undefined,
      processedCommands: new Map()
    };
  }

  private findRoomByCode(roomCode: string): Room | undefined {
    return [...this.rooms.values()].find((room) => room.roomCode === roomCode);
  }

  private requireRoom(roomId: string): Room {
    const room = this.rooms.get(roomId);
    if (room === undefined) throw new OnlineRoomError('room-not-found', 'A sala não existe ou já expirou.');
    return room;
  }

  private participantFor(room: Room, playerId: PlayerId): Participant {
    const participant = room.participants.get(playerId);
    if (participant === undefined) throw new OnlineRoomError('participant-not-found', 'O participante não está na sala.');
    return participant;
  }

  private findParticipantByToken(room: Room, token: string, throwOnMissing = true): Participant | undefined {
    const participant = [...room.participants.values()].find((candidate) => candidate.sessionToken === token);
    if (participant === undefined && throwOnMissing) {
      throw new OnlineRoomError('session-invalid', 'A sessão da sala não é válida.');
    }
    return participant;
  }

  private requireParticipantByToken(room: Room, token: string): Participant {
    const participant = this.findParticipantByToken(room, token, false);
    if (participant === undefined) {
      throw new OnlineRoomError('session-invalid', 'A sessão da sala não é válida.');
    }
    return participant;
  }

  private snapshotFor(room: Room, playerId: PlayerId): OnlineRoomSnapshot {
    return {
      roomId: room.roomId,
      roomCode: room.roomCode,
      phase: room.phase,
      selfPlayerId: playerId,
      participants: [...room.participants.values()]
        .sort((left, right) => left.playerId - right.playerId)
        .map((participant) => ({
          playerId: participant.playerId,
          connected: participant.connected,
          deckSelected: participant.deck !== undefined,
          ready: participant.ready,
          rematchAccepted: participant.rematchAccepted
        })),
      ...(room.matchId === undefined ? {} : { matchId: room.matchId }),
      version: room.state === undefined ? room.version : room.matchVersion
    };
  }

  private broadcastRoom(room: Room): void {
    for (const participant of room.participants.values()) {
      participant.sender?.({ type: 'room-updated', room: this.snapshotFor(room, participant.playerId) });
    }
  }

  private rememberCommand(participant: Participant, commandId: string, version: string): void {
    participant.processedCommands.set(commandId, version);
  }

  private duplicateCommand(room: Room, participant: Participant, commandId: string): boolean {
    const previousVersion = participant.processedCommands.get(commandId);
    if (previousVersion === undefined) return false;
    participant.sender?.({ type: 'command-accepted', commandId, version: room.matchVersion });
    return true;
  }

  private validateCommandId(commandId: string): void {
    if (!isCommandId(commandId)) throw new OnlineRoomError('invalid-command', 'O identificador da ação não é válido.');
  }

  private selectDeck(room: Room, participant: Participant, commandId: string, input: readonly string[]): void {
    this.validateCommandId(commandId);
    if (this.duplicateCommand(room, participant, commandId)) return;
    if (room.phase !== 'lobby') throw new OnlineRoomError('match-already-started', 'O baralho já está bloqueado para esta partida.');
    if (!Array.isArray(input) || input.length > 20) throw new OnlineRoomError('invalid-deck', 'O baralho enviado não é válido.');

    let deck: readonly CardDefinitionId[];
    try {
      deck = validateOfficialDeckReferences(input, this.catalog, 'baralho online');
    } catch (error) {
      if (error instanceof CatalogValidationError) {
        throw new OnlineRoomError('invalid-deck', 'O baralho não respeita a composição oficial.');
      }
      throw error;
    }

    participant.deck = [...deck];
    participant.ready = false;
    room.version += 1;
    room.lastActivityAt = this.now();
    this.rememberCommand(participant, commandId, 'lobby');
    participant.sender?.({ type: 'command-accepted', commandId, version: room.version });
    this.broadcastRoom(room);
  }

  private setReady(room: Room, participant: Participant, commandId: string, ready: boolean): void {
    this.validateCommandId(commandId);
    if (this.duplicateCommand(room, participant, commandId)) return;
    if (room.phase !== 'lobby') throw new OnlineRoomError('match-already-started', 'A preparação desta partida já terminou.');
    if (ready && participant.deck === undefined) throw new OnlineRoomError('deck-required', 'Seleciona um baralho válido antes de confirmar.');

    participant.ready = ready;
    room.version += 1;
    room.lastActivityAt = this.now();
    this.rememberCommand(participant, commandId, 'lobby');

    const bothReady = room.participants.size === 2
      && [...room.participants.values()].every((candidate) => candidate.ready && candidate.deck !== undefined);
    if (bothReady) {
      this.startMatch(room);
      participant.sender?.({ type: 'command-accepted', commandId, version: room.matchVersion });
      this.broadcastRoom(room);
      this.broadcastMatch(room, [], undefined);
      return;
    }

    participant.sender?.({ type: 'command-accepted', commandId, version: room.version });
    this.broadcastRoom(room);
  }

  private startMatch(room: Room): void {
    const first = this.participantFor(room, 1);
    const second = this.participantFor(room, 2);
    if (first.deck === undefined || second.deck === undefined) {
      throw new OnlineRoomError('deck-required', 'Os dois baralhos são necessários para iniciar.');
    }

    room.state = initializeGame({
      players: [
        { id: 1, deck: first.deck },
        { id: 2, deck: second.deck }
      ],
      cardDefinitions: this.catalog.definitions,
      random: this.randomSource,
      uuidGenerator: this.uuidGenerator
    });
    room.matchId = randomUUID();
    room.matchVersion = 0;
    room.phase = 'playing';
    first.rematchAccepted = false;
    second.rematchAccepted = false;
    first.processedCommands.clear();
    second.processedCommands.clear();
  }

  private matchSnapshot(
    room: Room,
    playerId: PlayerId,
    events: readonly GameEvent[],
    result: GameOperationResult['combatTrace']
  ): OnlineMatchSnapshot {
    if (room.state === undefined || room.matchId === undefined) {
      throw new OnlineRoomError('match-not-started', 'A partida ainda não começou.');
    }

    return {
      room: this.snapshotFor(room, playerId),
      matchId: room.matchId,
      version: room.matchVersion,
      view: createAuthorizedGameView(room.state, playerId),
      events: publicEvents(events, playerId),
      ...(result === undefined ? {} : { combatTrace: result })
    };
  }

  private broadcastMatch(
    room: Room,
    events: readonly GameEvent[],
    combatTrace: GameOperationResult['combatTrace']
  ): void {
    for (const participant of room.participants.values()) {
      participant.sender?.({
        type: 'match-updated',
        snapshot: this.matchSnapshot(room, participant.playerId, events, combatTrace)
      });
    }
  }

  private assertMatchCommand(
    room: Room,
    participant: Participant,
    commandId: string,
    matchId: string,
    expectedVersion: number,
    action: OnlineAction
  ): GameState {
    this.validateCommandId(commandId);
    if (room.phase !== 'playing' || room.state === undefined || room.matchId === undefined) {
      throw new OnlineRoomError('match-not-active', 'A partida não está a aceitar ações.');
    }
    if (matchId !== room.matchId) throw new OnlineRoomError('stale-match', 'A ação pertence a uma partida anterior.');
    if (expectedVersion !== room.matchVersion) throw new OnlineRoomError('stale-state', 'O estado local está desatualizado.');
    if (room.state.turn.activePlayerId !== participant.playerId) {
      throw new GameRuleError('wrong-active-player', 'A ação só pode ser enviada pelo jogador ativo.');
    }
    if (!isValidAction(action)) throw new OnlineRoomError('invalid-command', 'A ação não é válida.');
    return room.state;
  }

  private applyAction(
    room: Room,
    participant: Participant,
    commandId: string,
    matchId: string,
    expectedVersion: number,
    action: OnlineAction
  ): void {
    let state: GameState;
    try {
      this.validateCommandId(commandId);
      if (this.duplicateCommand(room, participant, commandId)) return;
      state = this.assertMatchCommand(room, participant, commandId, matchId, expectedVersion, action);
    } catch (error) {
      this.reject(participant, error, commandId);
      return;
    }

    try {
      let result: GameOperationResult;
      switch (action.type) {
        case 'place-card':
          result = placeCard(state, {
            playerId: participant.playerId,
            instanceId: action.instanceId,
            row: action.row,
            column: action.column
          });
          break;
        case 'retire-card':
          result = retireCard(state, { playerId: participant.playerId, instanceId: action.instanceId });
          break;
        case 'finish-positioning':
          result = finishPositioningPhase(state);
          break;
        case 'resolve-draw':
          result = resolveDrawPhase(state);
          break;
        case 'resolve-attack':
          result = resolveAttackPhase(state);
          break;
        default:
          throw new OnlineRoomError('invalid-command', 'A ação não é válida.');
      }

      room.state = result.state;
      room.matchVersion += 1;
      room.version += 1;
      room.lastActivityAt = this.now();
      if (result.state.status === 'finished') room.phase = 'finished';
      this.rememberCommand(participant, commandId, room.matchId ?? '');
      participant.sender?.({ type: 'command-accepted', commandId, version: room.matchVersion });
      this.broadcastRoom(room);
      this.broadcastMatch(room, result.events, result.combatTrace);
    } catch (error) {
      this.reject(participant, error, commandId, room.matchVersion);
    }
  }

  private reject(participant: Participant, error: unknown, commandId?: string, version?: number): void {
    if (error instanceof OnlineRoomError || error instanceof GameRuleError) {
      participant.sender?.({
        type: 'command-rejected',
        code: error.code,
        message: error.message,
        ...(commandId === undefined ? {} : { commandId }),
        ...(version === undefined ? {} : { version })
      });
      return;
    }

    participant.sender?.({
      type: 'command-rejected',
      code: 'invalid-command',
      message: 'Não foi possível processar a ação.',
      ...(commandId === undefined ? {} : { commandId }),
      ...(version === undefined ? {} : { version })
    });
  }

  private acceptRematch(room: Room, participant: Participant, commandId: string, matchId: string): void {
    this.validateCommandId(commandId);
    if (this.duplicateCommand(room, participant, commandId)) return;
    if (room.phase !== 'finished' || room.matchId !== matchId) {
      throw new OnlineRoomError('stale-match', 'A revanche pertence a uma partida anterior.');
    }

    participant.rematchAccepted = true;
    room.version += 1;
    room.lastActivityAt = this.now();
    this.rememberCommand(participant, commandId, matchId);
    const bothAccepted = [...room.participants.values()].every((candidate) => candidate.rematchAccepted);
    if (!bothAccepted) {
      participant.sender?.({ type: 'command-accepted', commandId, version: room.matchVersion });
      this.broadcastRoom(room);
      return;
    }

    this.startMatch(room);
    participant.sender?.({ type: 'command-accepted', commandId, version: room.matchVersion });
    this.broadcastRoom(room);
    this.broadcastMatch(room, [], undefined);
  }

  private leaveRoom(room: Room): void {
    room.phase = 'closed';
    room.version += 1;
    for (const candidate of room.participants.values()) {
      candidate.sender?.({ type: 'room-closed', reason: 'player-left' });
      candidate.connected = false;
      candidate.sender = undefined;
    }
    this.rooms.delete(room.roomId);
  }
}
