import {
  canPlaceCard,
  finishPositioningPhase,
  GameRuleError,
  placeCard,
  resolveAttackPhase,
  resolveDrawPhase,
  retireCard,
  type CardInstanceId,
  type GameEvent,
  type GameOperationResult,
  type GameState,
  type PlayerId,
  type RandomSource
} from '@souls/game-core';
import {
  createAiDecisionAgent,
  createAiObservation,
  createAiRandom,
  getLegalPlacements,
  getLegalRetirements,
  type AiDifficulty,
  type AiStrategy
} from '@souls/game-ai';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createDemoGame } from '../../../mocks/match';
import type { PlayerDeckPair } from '../../decks/application/deckTypes';
import {
  CombatAnimationSequencer,
  prefersReducedMotion,
  type CombatAnimationSpeed,
  type CombatPlaybackState
} from '../../combat/application/CombatAnimationSequencer';
import { createAuthorizedGameView, type AuthorizedGameView } from './authorizedGameView';
import { formatCombatColumnTrace, formatGameEvents } from './formatGameEvents';
import type { MatchCommands } from './MatchCommands';

function eventMessage(events: readonly GameEvent[], aiPlayerId?: PlayerId): string {
  const label = (playerId: PlayerId) => playerId === aiPlayerId ? 'A IA' : 'Jogador ' + playerId;
  const ended = events.find((event) => event.type === 'game-ended');

  if (ended?.type === 'game-ended') {
    return label(ended.winnerId) + ' venceu a partida.';
  }

  if (events.some((event) => event.type === 'card-destroyed')) {
    return 'Ataque resolvido: cartas destruídas e consequências aplicadas.';
  }

  if (events.some((event) => event.type === 'card-drawn')) {
    return 'Compra concluída. Escolha uma carta e uma casa para posicionar.';
  }

  if (events.some((event) => event.type === 'draw-failed')) {
    return 'Compra concluída com penalizações por baralho vazio.';
  }

  if (events.some((event) => event.type === 'card-retired')) {
    return events.some((event) => event.type === 'souls-gained' && event.reason === 'retirement')
      ? 'Carta retirada: recebeste 1 Soul e ainda tens uma colocação disponível.'
      : 'Carta retirada para o descarte. As Souls já estavam no limite.';
  }

  if (events.some((event) => event.type === 'card-invoked')) {
    return 'Carta colocada no tabuleiro.';
  }

  if (events.some((event) => event.type === 'turn-started')) {
    return 'Novo turno iniciado.';
  }

  return 'Estado atualizado.';
}

const initialLog = ['Ronda 1 começou.'];
const AI_STEP_DELAY_MS = 650;
const DRAW_FEEDBACK_DELAY_MS = 520;

interface DrawPlaybackSegment {
  readonly events: readonly GameEvent[];
  readonly damageByPlayer: Readonly<Record<PlayerId, number>>;
}

interface DrawPlaybackState {
  readonly result: GameOperationResult;
  readonly segments: readonly DrawPlaybackSegment[];
  readonly index: number;
  readonly currentDamageByPlayer: Readonly<Record<PlayerId, number>>;
  readonly damageByPlayer: Readonly<Record<PlayerId, number>>;
}

function drawSegments(events: readonly GameEvent[]): readonly DrawPlaybackSegment[] {
  const segments: DrawPlaybackSegment[] = [];
  let current: GameEvent[] = [];
  const pushCurrent = () => {
    if (current.length === 0) return;
    const damageByPlayer = { 1: 0, 2: 0 } as Record<PlayerId, number>;
    for (const event of current) {
      if (event.type === 'damage-dealt') damageByPlayer[event.targetPlayerId] += event.amount;
    }
    segments.push({ events: current, damageByPlayer });
    current = [];
  };
  for (const event of events) {
    if ((event.type === 'card-drawn' || event.type === 'draw-failed') && current.length > 0) pushCurrent();
    current.push(event);
  }
  pushCurrent();
  return segments;
}

export interface LocalGameOptions {
  /**
   * Fixed viewer identity for a future online session. Local hot-seat mode
   * omits it so the active player's private hand remains the visible hand.
   */
  readonly viewerPlayerId?: PlayerId;
  readonly playerDecks?: PlayerDeckPair;
  readonly restartKey?: number;
  readonly random?: RandomSource;
  readonly ai?: {
    readonly playerId: PlayerId;
    readonly strategy: AiStrategy;
    readonly difficulty: AiDifficulty;
  };
  readonly aiPresentationReady?: boolean;
}

export interface LocalGameSession {
  readonly matchId: number;
  readonly view: AuthorizedGameView;
  readonly activePlayerId: PlayerId;
  readonly viewerPlayerId: PlayerId;
  readonly canPlaceSelectedCard: (instanceId: CardInstanceId, row: number, column: number) => boolean;
  readonly commands: MatchCommands;
  readonly combatPlayback: CombatPlaybackState | null;
  readonly combatSpeed: CombatAnimationSpeed;
  readonly isCombatAnimating: boolean;
  readonly matchLog: readonly string[];
  readonly message: string;
  readonly selectedCardId: CardInstanceId | null;
  readonly isAiTurn: boolean;
  readonly isPve: boolean;
  readonly isResourceAnimating: boolean;
  readonly resourceDamageByPlayer: Readonly<Record<PlayerId, number>> | null;
  readonly resourcePlaybackKey: string | undefined;
}

export function useLocalGame(options: LocalGameOptions = {}): LocalGameSession {
  const deckSignature = options.playerDecks === undefined
    ? 'technical-demo'
    : options.playerDecks.map((deck) => deck.join(',')).join('|');
  const sessionSignature = `${deckSignature}:${options.restartKey ?? 0}`;
  const [state, setState] = useState<GameState>(() => createDemoGame(options.random, options.playerDecks));
  const [matchId, setMatchId] = useState(0);
  const [selectedCardId, setSelectedCardId] = useState<CardInstanceId | null>(null);
  const [message, setMessage] = useState('Selecione uma carta da mão para começar.');
  const [matchLog, setMatchLog] = useState<readonly string[]>(initialLog);
  const [combatPlayback, setCombatPlayback] = useState<CombatPlaybackState | null>(null);
  const [isCombatAnimating, setIsCombatAnimating] = useState(false);
  const [combatSpeed, setCombatSpeedState] = useState<CombatAnimationSpeed>(1);
  const [sequencer] = useState(() => new CombatAnimationSequencer());
  const aiTimerRef = useRef<number | null>(null);
  const drawTimerRef = useRef<number | null>(null);
  const [drawPlayback, setDrawPlayback] = useState<DrawPlaybackState | null>(null);
  const aiRandomRef = useRef(options.ai === undefined ? null : createAiRandom((options.restartKey ?? 0) + 0x51a1));
  const deckSignatureRef = useRef(sessionSignature);
  const sessionSignatureRef = useRef(sessionSignature);
  const activePlayer = state.players[state.turn.activePlayerId];
  const viewerPlayerId = options.viewerPlayerId ?? state.turn.activePlayerId;

  useEffect(() => () => sequencer.cancel(false), [sequencer]);

  useEffect(() => () => {
    if (aiTimerRef.current !== null) {
      window.clearTimeout(aiTimerRef.current);
    }
    if (drawTimerRef.current !== null) {
      window.clearTimeout(drawTimerRef.current);
    }
  }, []);

  useEffect(() => {
    if (deckSignatureRef.current === sessionSignature) {
      return;
    }

    deckSignatureRef.current = sessionSignature;
    sessionSignatureRef.current = sessionSignature;
    if (options.ai !== undefined) {
      aiRandomRef.current = createAiRandom((options.restartKey ?? 0) + 0x51a1);
    }
    if (aiTimerRef.current !== null) {
      window.clearTimeout(aiTimerRef.current);
      aiTimerRef.current = null;
    }
    if (drawTimerRef.current !== null) {
      window.clearTimeout(drawTimerRef.current);
      drawTimerRef.current = null;
    }
    sequencer.cancel();
    setMatchId((current) => current + 1);
    setState(createDemoGame(options.random, options.playerDecks));
    setSelectedCardId(null);
    setCombatPlayback(null);
    setDrawPlayback(null);
    setIsCombatAnimating(false);
    setMessage('Nova partida iniciada com os baralhos selecionados.');
    setMatchLog(initialLog);
  }, [options.playerDecks, options.random, options.restartKey, sequencer, sessionSignature]);

  const aiPlayerId = options.ai?.playerId;
  const playerLabels = options.ai === undefined ? undefined : { 1: 'Jogador', 2: 'A IA' } as const;

  const applyResult = useCallback((result: GameOperationResult, previousState: GameState) => {
    const newEntries = formatGameEvents(result.events, previousState, result.state, playerLabels === undefined ? {} : { playerLabels });

    setState(result.state);
    setSelectedCardId(null);
    setMessage(eventMessage(result.events, aiPlayerId));
    setMatchLog((entries) => [...entries, ...newEntries].slice(-100));
  }, [aiPlayerId, playerLabels]);

  const commit = useCallback((
    operation: () => GameOperationResult,
    previousState: GameState
  ) => {
    try {
      applyResult(operation(), previousState);
    } catch (error) {
      setMessage(error instanceof GameRuleError ? error.message : 'Não foi possível executar a ação.');
    }
  }, [applyResult]);

  const startDrawPlayback = useCallback((result: GameOperationResult, previousState: GameState) => {
    const segments = drawSegments(result.events);
    if (!segments.some((segment) => segment.damageByPlayer[1] > 0 || segment.damageByPlayer[2] > 0)) {
      applyResult(result, previousState);
      return;
    }
    const first = segments[0];
    if (first === undefined) {
      applyResult(result, previousState);
      return;
    }
    setSelectedCardId(null);
    setDrawPlayback({
      result,
      segments,
      index: 0,
      currentDamageByPlayer: first.damageByPlayer,
      damageByPlayer: first.damageByPlayer
    });
    setMessage(eventMessage(first.events, aiPlayerId));
    setMatchLog((entries) => [
      ...entries,
      ...formatGameEvents(first.events, previousState, result.state, playerLabels === undefined ? {} : { playerLabels })
    ].slice(-100));
  }, [aiPlayerId, applyResult, playerLabels]);

  const advanceDrawPlayback = useCallback(() => {
    const playback = drawPlayback;
    if (playback === null) return;
    const nextIndex = playback.index + 1;
    const next = playback.segments[nextIndex];
    if (next === undefined) {
      setState(playback.result.state);
      setDrawPlayback(null);
      setMessage(eventMessage(playback.result.events, aiPlayerId));
      return;
    }
    const damageByPlayer = {
      1: playback.damageByPlayer[1] + next.damageByPlayer[1],
      2: playback.damageByPlayer[2] + next.damageByPlayer[2]
    } as const;
    setDrawPlayback({
      ...playback,
      index: nextIndex,
      currentDamageByPlayer: next.damageByPlayer,
      damageByPlayer
    });
    setMessage(eventMessage(next.events, aiPlayerId));
    setMatchLog((entries) => [
      ...entries,
      ...formatGameEvents(next.events, playback.result.state, playback.result.state, playerLabels === undefined ? {} : { playerLabels })
    ].slice(-100));
  }, [aiPlayerId, drawPlayback, playerLabels]);

  useEffect(() => {
    if (drawPlayback === null || drawTimerRef.current !== null) return;
    drawTimerRef.current = window.setTimeout(() => {
      drawTimerRef.current = null;
      advanceDrawPlayback();
    }, DRAW_FEEDBACK_DELAY_MS);
  }, [advanceDrawPlayback, drawPlayback]);

  const isResourceAnimating = drawPlayback !== null;

  const selectCard = useCallback(
    (instanceId: CardInstanceId) => {
      if (isCombatAnimating || isResourceAnimating) {
        return;
      }

      if (!activePlayer.hand.includes(instanceId)) {
        setMessage('Selecione uma carta da mão do jogador ativo.');
        return;
      }

      setSelectedCardId(instanceId);
      setMessage('Carta selecionada. Escolha uma casa vazia do seu lado.');
    },
    [activePlayer.hand, isCombatAnimating, isResourceAnimating]
  );

  const selectBoardCard = useCallback(
    (instanceId: CardInstanceId) => {
      if (isCombatAnimating || isResourceAnimating) {
        return;
      }

      const card = state.cardInstances[instanceId];

      if (card?.ownerId !== state.turn.activePlayerId) {
        setMessage('Só pode selecionar cartas do jogador ativo.');
        return;
      }

      setSelectedCardId(instanceId);
      setMessage('Carta do campo selecionada. Pode retirá-la antes das colocações.');
    },
    [isCombatAnimating, isResourceAnimating, state.cardInstances, state.turn.activePlayerId]
  );

  const placeSelectedCard = useCallback(
    (row: number, column: number) => {
      if (isCombatAnimating || isResourceAnimating) {
        return;
      }

      if (selectedCardId === null) {
        setMessage('Selecione primeiro uma carta da mão.');
        return;
      }

      if (!activePlayer.hand.includes(selectedCardId)) {
        setMessage('A carta selecionada não está na mão do jogador ativo.');
        return;
      }

      commit(() => placeCard(state, {
        playerId: state.turn.activePlayerId,
        instanceId: selectedCardId,
        row,
        column
      }), state);
    },
    [activePlayer.hand, commit, isCombatAnimating, isResourceAnimating, selectedCardId, state]
  );

  const retireSelectedCard = useCallback(() => {
    if (isCombatAnimating || isResourceAnimating) {
      return;
    }

    if (selectedCardId === null) {
      setMessage('Selecione uma carta sua no tabuleiro.');
      return;
    }

    commit(() => retireCard(state, {
      playerId: state.turn.activePlayerId,
      instanceId: selectedCardId
    }), state);
  }, [commit, isCombatAnimating, isResourceAnimating, selectedCardId, state]);

  const advancePositioning = useCallback(() => {
    if (isCombatAnimating || isResourceAnimating) {
      return;
    }

    commit(() => finishPositioningPhase(state), state);
  }, [commit, isCombatAnimating, isResourceAnimating, state]);

  const resolveDraw = useCallback(() => {
    if (isCombatAnimating || isResourceAnimating) {
      return;
    }

    startDrawPlayback(resolveDrawPhase(state), state);
  }, [isCombatAnimating, isResourceAnimating, startDrawPlayback, state]);

  const resolveAttack = useCallback(() => {
    if (isCombatAnimating || isResourceAnimating) {
      return;
    }

    try {
      const previousState = state;
      const result = resolveAttackPhase(previousState);
      const trace = result.combatTrace;

      if (trace === undefined || trace.columns.length === 0) {
        applyResult(result, previousState);
        return;
      }

      const presentedColumns = new Set<number>();
      setSelectedCardId(null);
      setCombatPlayback(null);
      setIsCombatAnimating(true);
      setMessage('Combate em reprodução.');

      sequencer.play(
        trace,
        {
          onStep: (playback) => {
            setCombatPlayback(playback);

            if (playback.stage !== 'consequences' || presentedColumns.has(playback.column)) {
              return;
            }

            presentedColumns.add(playback.column);
            const column = trace.columns.find((entry) => entry.column === playback.column);

            if (column === undefined) {
              return;
            }

            const entries = [
              ...formatCombatColumnTrace(column, previousState),
              ...formatGameEvents(column.events, previousState, result.state, playerLabels === undefined ? {} : { playerLabels })
            ];
            setMatchLog((current) => [...current, ...entries].slice(-100));
          },
          onComplete: () => {
            const trailingEntries = formatGameEvents(trace.trailingEvents, previousState, result.state, playerLabels === undefined ? {} : { playerLabels });
            setState(result.state);
            setSelectedCardId(null);
            setCombatPlayback(null);
            setIsCombatAnimating(false);
            setMessage(eventMessage(result.events, aiPlayerId));
            setMatchLog((current) => [...current, ...trailingEntries].slice(-100));
          },
          onCancel: () => {
            setCombatPlayback(null);
            setIsCombatAnimating(false);
          }
        },
        { speed: combatSpeed, reducedMotion: prefersReducedMotion() }
      );
    } catch (error) {
      setMessage(error instanceof GameRuleError ? error.message : 'Não foi possível resolver o ataque.');
    }
  }, [aiPlayerId, applyResult, combatSpeed, isCombatAnimating, isResourceAnimating, playerLabels, sequencer, state]);

  const runAiStep = useCallback(() => {
    const ai = options.ai;
    if (ai === undefined || state.status !== 'active' || state.turn.activePlayerId !== ai.playerId || isCombatAnimating || drawPlayback !== null) {
      return;
    }

    const random = aiRandomRef.current ?? createAiRandom((options.restartKey ?? 0) + 0x51a1);
    aiRandomRef.current = random;
    const agent = createAiDecisionAgent(ai.strategy, ai.difficulty);
    const observation = createAiObservation(state, ai.playerId);

    if (state.turn.phase === 'draw') {
      setMessage('A IA está a efetuar as compras obrigatórias.');
      startDrawPlayback(resolveDrawPhase(state), state);
      return;
    }

    if (state.turn.phase === 'first-round-positioning' || state.turn.phase === 'positioning') {
      if (state.turn.placementsMade === 0 && !state.turn.hasRetired) {
        const retirement = agent.chooseRetirement(observation, getLegalRetirements(state, ai.playerId), random);
        if (retirement !== null) {
          setMessage('A IA está a avaliar uma retirada estratégica.');
          applyResult(retireCard(state, { playerId: ai.playerId, instanceId: retirement.instanceId }), state);
          return;
        }
      }

      const placement = agent.choosePlacement(observation, getLegalPlacements(state, ai.playerId), random);
      if (placement !== null) {
        setMessage('A IA está a escolher uma colocação.');
        applyResult(placeCard(state, {
          playerId: ai.playerId,
          instanceId: placement.instanceId,
          row: placement.position.row,
          column: placement.position.column
        }), state);
        return;
      }

      setMessage('A IA terminou o posicionamento.');
      applyResult(finishPositioningPhase(state), state);
      return;
    }

    if (state.turn.phase === 'attack') {
      setMessage('A IA está a resolver o ataque obrigatório.');
      resolveAttack();
    }
  }, [applyResult, drawPlayback, isCombatAnimating, options.ai, options.restartKey, resolveAttack, startDrawPlayback, state]);

  useEffect(() => {
    if (
      options.ai === undefined
      || options.aiPresentationReady === false
      || state.status !== 'active'
      || state.turn.activePlayerId !== options.ai.playerId
      || isCombatAnimating
      || drawPlayback !== null
      || aiTimerRef.current !== null
    ) {
      return;
    }

    const scheduledSignature = sessionSignature;
    aiTimerRef.current = window.setTimeout(() => {
      aiTimerRef.current = null;
      if (sessionSignatureRef.current !== scheduledSignature) return;
      runAiStep();
    }, AI_STEP_DELAY_MS);
  }, [drawPlayback, isCombatAnimating, options.ai, options.aiPresentationReady, runAiStep, sessionSignature, state]);

  const setCombatSpeed = useCallback((speed: CombatAnimationSpeed) => {
    setCombatSpeedState(speed);
    sequencer.setSpeed(speed);
  }, [sequencer]);

  const skipCombat = useCallback(() => {
    sequencer.skip();
  }, [sequencer]);

  const reset = useCallback(() => {
    sequencer.cancel();
    if (aiTimerRef.current !== null) {
      window.clearTimeout(aiTimerRef.current);
      aiTimerRef.current = null;
    }
    if (drawTimerRef.current !== null) {
      window.clearTimeout(drawTimerRef.current);
      drawTimerRef.current = null;
    }
    if (options.ai !== undefined) {
      aiRandomRef.current = createAiRandom((options.restartKey ?? 0) + 0x51a1);
    }
    setMatchId((current) => current + 1);
    setState(createDemoGame(options.random, options.playerDecks));
    setSelectedCardId(null);
    setCombatPlayback(null);
    setDrawPlayback(null);
    setIsCombatAnimating(false);
    setMessage('Nova demonstração local iniciada.');
    setMatchLog(initialLog);
  }, [options.ai, options.random, options.restartKey, sequencer]);

  const canPlaceSelectedCard = useCallback((instanceId: CardInstanceId, row: number, column: number) => {
    if (state.status === 'finished') {
      return false;
    }

    return canPlaceCard(state, {
      playerId: state.turn.activePlayerId,
      instanceId,
      row,
      column
    });
  }, [state]);

  const baseView = createAuthorizedGameView(state, viewerPlayerId);
  const cumulativeHpDamage = combatPlayback?.cumulativeHpDamage ?? drawPlayback?.damageByPlayer;
  const view = cumulativeHpDamage === undefined
    ? baseView
    : {
        ...baseView,
        players: {
          1: { ...baseView.players[1], hp: Math.max(0, baseView.players[1].hp - cumulativeHpDamage[1]) },
          2: { ...baseView.players[2], hp: Math.max(0, baseView.players[2].hp - cumulativeHpDamage[2]) }
        }
      };
  const commands: MatchCommands = {
    selectCard,
    selectBoardCard,
    placeSelectedCard,
    retireSelectedCard,
    advancePositioning,
    resolveDraw,
    resolveAttack,
    setCombatSpeed,
    skipCombat,
    reset
  };

  return {
    matchId,
    view,
    activePlayerId: view.activePlayerId,
    viewerPlayerId: view.viewerPlayerId,
    canPlaceSelectedCard,
    commands,
    combatPlayback,
    combatSpeed,
    isCombatAnimating,
    isResourceAnimating,
    resourceDamageByPlayer: drawPlayback?.currentDamageByPlayer ?? null,
    matchLog,
    message,
    selectedCardId,
    isAiTurn: options.ai?.playerId === state.turn.activePlayerId,
    isPve: options.ai !== undefined,
    resourcePlaybackKey: drawPlayback === null ? undefined : `draw-${drawPlayback.index}`
  };
}
