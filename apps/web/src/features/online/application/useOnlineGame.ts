import {
  getBoardPosition,
  summonCost,
  type CardInstanceId,
  type PlayerId
} from '@souls/game-core';
import {
  type AuthorizedGameView,
  type OnlineClientMessage,
  type OnlineGameEvent,
  type OnlineRoomSnapshot,
  type OnlineServerMessage
} from '@souls/game-online';
import { useCallback, useEffect, useRef, useState } from 'react';
import { appConfig } from '../../../app/config/runtime';
import {
  CombatAnimationSequencer,
  prefersReducedMotion,
  type CombatAnimationSpeed,
  type CombatPlaybackState
} from '../../combat/application/CombatAnimationSequencer';
import type { MatchCommands } from '../../match/application/MatchCommands';
import { formatOnlineEvents, onlineEventMessage } from './formatOnlineEvents';

export interface OnlineConnectionConfig {
  readonly roomId: string;
  readonly sessionToken: string;
}

interface DamageByPlayer {
  readonly 1: number;
  readonly 2: number;
}

export interface OnlineGameSession {
  readonly room: OnlineRoomSnapshot | null;
  readonly view: AuthorizedGameView | null;
  readonly matchId: string | null;
  readonly connectionState: 'disconnected' | 'connecting' | 'connected';
  readonly canPlaceSelectedCard: (instanceId: CardInstanceId, row: number, column: number) => boolean;
  readonly commands: MatchCommands;
  readonly selectDeck: (deck: readonly string[]) => void;
  readonly setReady: (ready: boolean) => void;
  readonly acceptRematch: () => void;
  readonly combatPlayback: CombatPlaybackState | null;
  readonly combatSpeed: CombatAnimationSpeed;
  readonly isCombatAnimating: boolean;
  readonly matchLog: readonly string[];
  readonly message: string;
  readonly selectedCardId: CardInstanceId | null;
  readonly isResourceAnimating: boolean;
  readonly resourceDamageByPlayer: DamageByPlayer | null;
  readonly resourcePlaybackKey: string | undefined;
}

function commandId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') return globalThis.crypto.randomUUID();
  return `online-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isOwnSide(playerId: PlayerId, row: number): boolean {
  return playerId === 1 ? row >= 3 : row <= 2;
}

function damageFromEvents(events: readonly OnlineGameEvent[]): DamageByPlayer {
  const damage = { 1: 0, 2: 0 };
  for (const event of events) {
    if (event.type === 'damage-dealt' && 'targetPlayerId' in event && 'amount' in event) {
      const target = event.targetPlayerId;
      if (target === 1 || target === 2) damage[target] += event.amount;
    }
  }
  return damage;
}

export function useOnlineGame(config: OnlineConnectionConfig | null): OnlineGameSession {
  const [room, setRoom] = useState<OnlineRoomSnapshot | null>(null);
  const [view, setView] = useState<AuthorizedGameView | null>(null);
  const viewRef = useRef<AuthorizedGameView | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null);
  const matchIdRef = useRef<string | null>(null);
  const versionRef = useRef(0);
  const socketRef = useRef<WebSocket | null>(null);
  const [connectionState, setConnectionState] = useState<OnlineGameSession['connectionState']>('disconnected');
  const [selectedCardId, setSelectedCardId] = useState<CardInstanceId | null>(null);
  const [message, setMessage] = useState('Cria ou entra numa sala privada para começar.');
  const [matchLog, setMatchLog] = useState<readonly string[]>([]);
  const [combatPlayback, setCombatPlayback] = useState<CombatPlaybackState | null>(null);
  const [isCombatAnimating, setIsCombatAnimating] = useState(false);
  const [combatSpeed, setCombatSpeedState] = useState<CombatAnimationSpeed>(1);
  const combatSpeedRef = useRef<CombatAnimationSpeed>(1);
  const [resourceDamageByPlayer, setResourceDamageByPlayer] = useState<DamageByPlayer | null>(null);
  const [resourcePlaybackKey, setResourcePlaybackKey] = useState<string | undefined>(undefined);
  const resourceTimerRef = useRef<number | null>(null);
  const [sequencer] = useState(() => new CombatAnimationSequencer());

  useEffect(() => {
    viewRef.current = view;
    matchIdRef.current = matchId;
  }, [matchId, view]);

  const send = useCallback((messageToSend: OnlineClientMessage) => {
    const socket = socketRef.current;
    if (socket?.readyState !== WebSocket.OPEN) {
      setMessage('A ligação ainda não está pronta.');
      return;
    }
    socket.send(JSON.stringify(messageToSend));
  }, []);

  const applySnapshot = useCallback((snapshot: Extract<OnlineServerMessage, { type: 'match-updated' }>['snapshot']) => {
    const previousView = viewRef.current;
    const previousMatchId = matchIdRef.current;
    versionRef.current = snapshot.version;
    setRoom(snapshot.room);
    setMatchId(snapshot.matchId);
    setSelectedCardId(null);
    setResourceDamageByPlayer(null);
    setResourcePlaybackKey(undefined);

    const eventEntries = formatOnlineEvents(snapshot.events, snapshot.view);
    setMatchLog((current) => [...current, ...eventEntries].slice(-100));
    setMessage(onlineEventMessage(snapshot.events));

    if (
      previousView !== null
      && previousMatchId === snapshot.matchId
      && snapshot.combatTrace !== undefined
      && snapshot.combatTrace.columns.length > 0
    ) {
      const trace = snapshot.combatTrace;
      setView(previousView);
      setIsCombatAnimating(true);
      setCombatPlayback(null);
      const presentedColumns = new Set<number>();
      sequencer.play(
        trace,
        {
          onStep: (playback) => {
            setCombatPlayback(playback);
            const cumulativeDamage = playback.cumulativeHpDamage;
            setView({
              ...previousView,
              players: {
                1: { ...previousView.players[1], hp: Math.max(0, previousView.players[1].hp - cumulativeDamage[1]) },
                2: { ...previousView.players[2], hp: Math.max(0, previousView.players[2].hp - cumulativeDamage[2]) }
              }
            });
            if (playback.stage !== 'consequences' || presentedColumns.has(playback.column)) return;
            presentedColumns.add(playback.column);
            setMatchLog((current) => [...current, `Coluna ${playback.column + 1}: consequências aplicadas.`].slice(-100));
          },
          onComplete: () => {
            setView(snapshot.view);
            viewRef.current = snapshot.view;
            setCombatPlayback(null);
            setIsCombatAnimating(false);
          },
          onCancel: () => {
            setCombatPlayback(null);
            setIsCombatAnimating(false);
          }
        },
        { speed: combatSpeedRef.current, reducedMotion: prefersReducedMotion() }
      );
      return;
    }

    setView(snapshot.view);
    viewRef.current = snapshot.view;
    if (snapshot.events.some((event) => event.type === 'draw-failed')) {
      const damage = damageFromEvents(snapshot.events);
      setResourceDamageByPlayer(damage);
      setResourcePlaybackKey(`draw-${snapshot.version}`);
      if (resourceTimerRef.current !== null) window.clearTimeout(resourceTimerRef.current);
      resourceTimerRef.current = window.setTimeout(() => {
        resourceTimerRef.current = null;
        setResourceDamageByPlayer(null);
        setResourcePlaybackKey(undefined);
      }, 520);
    }
  }, [sequencer]);

  useEffect(() => {
    let active = true;
    let reconnectTimer: number | null = null;

    const cleanup = () => {
      active = false;
      if (reconnectTimer !== null) window.clearTimeout(reconnectTimer);
      reconnectTimer = null;
      socketRef.current?.close();
      socketRef.current = null;
      sequencer.cancel(false);
      if (resourceTimerRef.current !== null) window.clearTimeout(resourceTimerRef.current);
    };

    if (config === null) {
      cleanup();
      setRoom(null);
      setView(null);
      viewRef.current = null;
      setMatchId(null);
      matchIdRef.current = null;
      versionRef.current = 0;
      setConnectionState('disconnected');
      return cleanup;
    }

    const connect = () => {
      if (!active) return;
      setConnectionState('connecting');
      const socket = new WebSocket(appConfig.onlineWebSocketUrl);
      socketRef.current = socket;

      socket.addEventListener('open', () => {
        socket.send(JSON.stringify({ type: 'hello', roomId: config.roomId, sessionToken: config.sessionToken }));
      });
      socket.addEventListener('message', (event) => {
        if (!active) return;
        let messageFromServer: OnlineServerMessage;
        try {
          messageFromServer = JSON.parse(String(event.data)) as OnlineServerMessage;
        } catch {
          setMessage('Recebemos uma atualização inválida.');
          return;
        }

        switch (messageFromServer.type) {
          case 'hello-accepted':
            setConnectionState('connected');
            setRoom(messageFromServer.room);
            setMessage('Ligação estabelecida.');
            break;
          case 'room-updated':
            setRoom(messageFromServer.room);
            if (messageFromServer.room.phase === 'closed') setMessage('A sala foi encerrada.');
            break;
          case 'match-updated':
            applySnapshot(messageFromServer.snapshot);
            break;
          case 'command-rejected':
            setMessage(messageFromServer.message);
            break;
          case 'online-error':
            setMessage(messageFromServer.message);
            break;
          case 'room-closed':
            active = false;
            socket.close();
            socketRef.current = null;
            setRoom((current) => current === null ? current : { ...current, phase: 'closed' });
            setConnectionState('disconnected');
            setMessage(messageFromServer.reason === 'expired' ? 'A sala expirou.' : 'O outro jogador saiu da sala.');
            break;
          case 'command-accepted':
            break;
        }
      });
      socket.addEventListener('close', () => {
        if (!active) return;
        setConnectionState('disconnected');
        setMessage('Ligação interrompida. A tentar reconectar a sessão…');
        reconnectTimer = window.setTimeout(() => {
          reconnectTimer = null;
          connect();
        }, 1_000);
      });
      socket.addEventListener('error', () => {
        if (active) setMessage('Não foi possível ligar ao servidor online.');
      });
    };

    connect();
    return cleanup;
  }, [applySnapshot, config, sequencer]);

  useEffect(() => () => sequencer.cancel(false), [sequencer]);

  const selectCard = useCallback((instanceId: CardInstanceId) => {
    if (view === null || isCombatAnimating || resourceDamageByPlayer !== null) return;
    if (!view.viewer.hand.includes(instanceId)) {
      setMessage('Essa carta não pertence à tua mão.');
      return;
    }
    setSelectedCardId(instanceId);
    setMessage('Carta selecionada. Escolhe uma casa válida.');
  }, [isCombatAnimating, resourceDamageByPlayer, view]);

  const selectBoardCard = useCallback((instanceId: CardInstanceId) => {
    if (view === null || isCombatAnimating || resourceDamageByPlayer !== null) return;
    if (view.visibleCardInstances[instanceId]?.ownerId !== view.viewerPlayerId) {
      setMessage('Só podes retirar cartas tuas.');
      return;
    }
    setSelectedCardId(instanceId);
    setMessage('Carta selecionada. Podes retirá-la antes das colocações.');
  }, [isCombatAnimating, resourceDamageByPlayer, view]);

  const placeSelectedCard = useCallback((row: number, column: number) => {
    if (selectedCardId === null || view === null) return;
    send({
      type: 'command',
      commandId: commandId(),
      matchId: matchIdRef.current ?? '',
      expectedVersion: versionRef.current,
      action: { type: 'place-card', instanceId: selectedCardId, row, column }
    });
  }, [selectedCardId, send, view]);

  const retireSelectedCard = useCallback(() => {
    if (selectedCardId === null || view === null) return;
    send({
      type: 'command',
      commandId: commandId(),
      matchId: matchIdRef.current ?? '',
      expectedVersion: versionRef.current,
      action: { type: 'retire-card', instanceId: selectedCardId }
    });
  }, [selectedCardId, send, view]);

  const sendAction = useCallback((action: Extract<OnlineClientMessage, { type: 'command' }>['action']) => {
    if (matchIdRef.current === null) return;
    send({
      type: 'command',
      commandId: commandId(),
      matchId: matchIdRef.current,
      expectedVersion: versionRef.current,
      action
    });
  }, [send]);

  const setCombatSpeed = useCallback((speed: CombatAnimationSpeed) => {
    setCombatSpeedState(speed);
    combatSpeedRef.current = speed;
    sequencer.setSpeed(speed);
  }, [sequencer]);

  const reset = useCallback(() => {
    const currentMatchId = matchIdRef.current;
    if (currentMatchId !== null) send({ type: 'leave-room', commandId: commandId() });
    socketRef.current?.close();
  }, [send]);

  const canPlaceSelectedCard = useCallback((instanceId: CardInstanceId, row: number, column: number): boolean => {
    if (view === null || view.status === 'finished' || view.activePlayerId !== view.viewerPlayerId) return false;
    if (view.turn.phase !== 'first-round-positioning' && view.turn.phase !== 'positioning') return false;
    const instance = view.visibleCardInstances[instanceId];
    if (instance === undefined || !view.viewer.hand.includes(instanceId)) return false;
    const position = getBoardPosition(row, column);
    if (!isOwnSide(view.viewerPlayerId, row) || view.board.occupants[position.key] !== null) return false;
    const definition = view.cardDefinitions[instance.cardDefinitionId];
    if (definition === undefined) return false;
    if (position.type === 'defense' && definition.type !== 'melee') return false;
    if (position.type === 'melee' && definition.type !== 'melee') return false;
    if (position.type === 'ranged' && definition.type !== 'ranged') return false;
    if (view.players[view.viewerPlayerId].souls < summonCost(definition.level)) return false;
    if (view.turn.placementsMade >= 2) return false;
    if (position.type === 'defense' && view.turn.defensivePlacementMade) return false;
    if (position.type !== 'defense' && view.turn.offensivePlacementMade) return false;
    return true;
  }, [view]);

  const commands: MatchCommands = {
    selectCard,
    selectBoardCard,
    placeSelectedCard,
    retireSelectedCard,
    advancePositioning: () => sendAction({ type: 'finish-positioning' }),
    resolveDraw: () => sendAction({ type: 'resolve-draw' }),
    resolveAttack: () => sendAction({ type: 'resolve-attack' }),
    setCombatSpeed,
    skipCombat: () => sequencer.skip(),
    reset
  };

  return {
    room,
    view,
    matchId,
    connectionState,
    canPlaceSelectedCard,
    commands,
    selectDeck: (deck) => send({ type: 'select-deck', commandId: commandId(), deck }),
    setReady: (ready) => send({ type: 'set-ready', commandId: commandId(), ready }),
    acceptRematch: () => {
      if (matchIdRef.current !== null) send({ type: 'accept-rematch', commandId: commandId(), matchId: matchIdRef.current });
    },
    combatPlayback,
    combatSpeed,
    isCombatAnimating,
    matchLog,
    message,
    selectedCardId,
    isResourceAnimating: resourceDamageByPlayer !== null,
    resourceDamageByPlayer,
    resourcePlaybackKey
  };
}
