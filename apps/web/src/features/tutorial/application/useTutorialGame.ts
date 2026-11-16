import {
  canPlaceCard,
  finishPositioningPhase,
  GameRuleError,
  placeCard,
  retireCard,
  resolveAttackPhase,
  resolveDrawPhase,
  type BoardPosition,
  type BoardRow,
  type CardInstanceId,
  type GameEvent,
  type GameOperationResult,
  type GameState,
  type PlayerId
} from '@souls/game-core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  createCombatScenario,
  createFailedDrawScenario,
  createFinalChallengeScenario,
  createDrawScenario,
  createHighLevelShowcaseScenario,
  createRetirementScenario,
  createSoulDrawScenario,
  createSoulInvocationScenario,
  createTutorialGame,
  definitionIdFor
} from './tutorialGame';
import { TUTORIAL_STEPS, type TutorialCardKey, type TutorialStep, type TutorialZone } from './tutorialSteps';
import { createAuthorizedGameView, type AuthorizedGameView } from '../../match/application/authorizedGameView';
import {
  CombatAnimationSequencer,
  prefersReducedMotion,
  type CombatAnimationSpeed,
  type CombatPlaybackState
} from '../../combat/application/CombatAnimationSequencer';
import { formatGameEvents } from '../../match/application/formatGameEvents';
import type { BoardCellState } from '../../game-board/presentation/GameBoard';
import { markTutorialCompleted } from './tutorialProgress';

export type TutorialPhase = 'intro' | 'active' | 'complete';

export interface TutorialCommands {
  readonly start: () => void;
  readonly reset: () => void;
  readonly restartStep: () => void;
  readonly advanceStep: () => void;
  readonly exploreZone: (zone: TutorialZone) => void;
  readonly selectCard: (instanceId: CardInstanceId) => void;
  readonly selectBoardCard: (instanceId: CardInstanceId) => void;
  readonly placeSelectedCard: (row: number, column: number) => void;
  readonly retireSelectedCard: () => void;
  readonly resolveDraw: () => void;
  readonly finishPositioning: () => void;
  readonly resolveAttack: () => void;
  readonly setCombatSpeed: (speed: CombatAnimationSpeed) => void;
  readonly skipCombat: () => void;
}

export interface TutorialSession {
  readonly phase: TutorialPhase;
  readonly step: TutorialStep;
  readonly stepIndex: number;
  readonly totalSteps: number;
  readonly state: GameState;
  readonly view: AuthorizedGameView;
  readonly selectedCardId: CardInstanceId | null;
  readonly highlightedCardId: CardInstanceId | null;
  readonly message: string;
  readonly matchLog: readonly string[];
  readonly stepCompleted: boolean;
  readonly exploredZones: ReadonlySet<TutorialZone>;
  readonly highlightedZone: TutorialZone | null;
  readonly highlightedRows: readonly BoardRow[];
  readonly combatPlayback: CombatPlaybackState | null;
  readonly combatSpeed: CombatAnimationSpeed;
  readonly isCombatAnimating: boolean;
  readonly isResourceAnimating: boolean;
  readonly resourceDamageByPlayer: Readonly<Record<PlayerId, number>> | null;
  readonly resourceSoulDeltaByPlayer: Readonly<Record<PlayerId, number>> | null;
  readonly resourcePlaybackKey: string | undefined;
  readonly canAdvance: boolean;
  readonly canPlaceSelectedCard: (instanceId: CardInstanceId, position: BoardPosition) => boolean;
  readonly getCellState: (position: BoardPosition, occupantId: string | null) => BoardCellState;
  readonly commands: TutorialCommands;
}

const initialLog = ['Tutorial iniciado.'];
const DRAW_FEEDBACK_DELAY_MS = 520;
const zoneRows: Readonly<Record<TutorialZone, readonly BoardRow[]>> = {
  defense: [2, 3],
  melee: [1, 4],
  ranged: [0, 5]
};

interface TutorialDrawSegment {
  readonly events: readonly GameEvent[];
  readonly damageByPlayer: Readonly<Record<PlayerId, number>>;
  readonly soulsSpentByPlayer: Readonly<Record<PlayerId, number>>;
}

interface TutorialDrawPlayback {
  readonly result: GameOperationResult;
  readonly segments: readonly TutorialDrawSegment[];
  readonly index: number;
  readonly damageByPlayer: Readonly<Record<PlayerId, number>>;
  readonly soulsSpentByPlayer: Readonly<Record<PlayerId, number>>;
  readonly currentDamageByPlayer: Readonly<Record<PlayerId, number>>;
  readonly currentSoulsSpentByPlayer: Readonly<Record<PlayerId, number>>;
  readonly onComplete: () => void;
}

function drawSegments(events: readonly GameEvent[]): readonly TutorialDrawSegment[] {
  const segments: TutorialDrawSegment[] = [];
  let current: GameEvent[] = [];

  const pushCurrent = () => {
    if (current.length === 0) return;
    const damageByPlayer = { 1: 0, 2: 0 } as Record<PlayerId, number>;
    const soulsSpentByPlayer = { 1: 0, 2: 0 } as Record<PlayerId, number>;

    for (const event of current) {
      if (event.type === 'damage-dealt') damageByPlayer[event.targetPlayerId] += event.amount;
      if (event.type === 'souls-spent' && event.reason === 'failed-draw') soulsSpentByPlayer[event.playerId] += event.amount;
    }

    segments.push({ events: current, damageByPlayer, soulsSpentByPlayer });
    current = [];
  };

  for (const event of events) {
    if ((event.type === 'card-drawn' || event.type === 'draw-failed') && current.length > 0) pushCurrent();
    current.push(event);
  }
  pushCurrent();
  return segments;
}

function segmentMessage(segment: TutorialDrawSegment): string {
  if (segment.events.some((event) => event.type === 'draw-failed' && event.penalty === 'hp')) {
    return 'Compra falhada: -500 HP. A penalização foi aplicada nesta tentativa.';
  }
  if (segment.events.some((event) => event.type === 'draw-failed' && event.penalty === 'soul')) {
    return 'Compra falhada: 1 Soul foi consumida antes de perder HP.';
  }
  return 'Compra normal concluída. A carta entrou na mão.';
}

function messageForStep(step: TutorialStep): string {
  switch (step.id) {
    case 'board': return 'Seleciona uma zona destacada para conhecer a sua função.';
    case 'cards': return 'Seleciona o Cavaleiro na mão para abrir o painel de atributos.';
    case 'melee-placement': return 'Seleciona o Cavaleiro e escolhe uma célula melee válida.';
    case 'defense': return 'Seleciona o Defensor e escolhe uma célula de defesa válida.';
    case 'ranged-placement': return 'Seleciona o Arqueiro e escolhe uma célula ranged válida.';
    case 'turns': return 'Uma ronda tem um turno de cada jogador. Continua quando estiveres pronto.';
    case 'draw': return 'Executa as duas compras obrigatórias desta ronda.';
    case 'draw-failed': return 'Executa as duas compras e observa cada penalização de 500 HP.';
    case 'draw-soul': return 'Executa as duas compras e observa primeiro o consumo da Soul.';
    case 'combat': return 'Observa a resolução automática da coluna 0.';
    case 'combined': return 'Resolve o ataque para veres o ATK melee e ranged combinado.';
    case 'souls': return 'Tens 2 Souls neste cenário de treino. Invoca a carta de nível 2 e observa o custo.';
    case 'levels': return 'Seleciona a Matriarca dos Selos para comparar N3 e N4.';
    case 'retirement': return 'Seleciona a carta no campo e retira-a. A ação concede 1 Soul e deixa uma única colocação disponível.';
    case 'victory': return 'Escolhe uma colocação legal, termina o posicionamento e resolve o ataque do duelo final.';
    default: return step.description;
  }
}

function scenarioForStep(stepId: string, currentState: GameState): GameState {
  switch (stepId) {
    case 'board':
    case 'cards':
    case 'melee-placement':
    case 'defense':
    case 'ranged-placement':
    case 'turns':
      return createTutorialGame();
    case 'draw':
      return createDrawScenario();
    case 'draw-failed':
      return createFailedDrawScenario();
    case 'draw-soul':
      return createSoulDrawScenario();
    case 'combat':
      return createCombatScenario(false);
    case 'combined':
      return createCombatScenario(true);
    case 'souls':
      return createSoulInvocationScenario();
    case 'levels':
      return createHighLevelShowcaseScenario();
    case 'retirement':
      return createRetirementScenario();
    case 'victory':
      return createFinalChallengeScenario();
    default:
      return currentState;
  }
}

function targetCardMatches(state: GameState, instanceId: CardInstanceId, key: TutorialCardKey): boolean {
  return state.cardInstances[instanceId]?.cardDefinitionId === definitionIdFor(state, key);
}

function cardLabel(key: TutorialCardKey): string {
  return {
    cavaleiro: 'Cavaleiro',
    defensor: 'Defensor',
    arqueiro: 'Arqueiro',
    mago: 'Mago',
    'cavaleiro-negro': 'Cavaleiro Negro',
    'cacadora-lua-palida': 'Caçadora da Lua Pálida',
    'matriarca-selos': 'Matriarca dos Selos',
    'rei-exilado': 'Rei Exilado'
  }[key];
}

export function useTutorialGame(): TutorialSession {
  const [phase, setPhase] = useState<TutorialPhase>('intro');
  const [stepIndex, setStepIndex] = useState(0);
  const [state, setState] = useState<GameState>(() => createTutorialGame());
  const [selectedCardId, setSelectedCardId] = useState<CardInstanceId | null>(null);
  const [message, setMessage] = useState('Começa o tutorial para aprender os fundamentos do SOULS.');
  const [matchLog, setMatchLog] = useState<readonly string[]>(initialLog);
  const [stepCompleted, setStepCompleted] = useState(false);
  const [exploredZones, setExploredZones] = useState<ReadonlySet<TutorialZone>>(new Set());
  const [highlightedZone, setHighlightedZone] = useState<TutorialZone | null>(null);
  const [combatPlayback, setCombatPlayback] = useState<CombatPlaybackState | null>(null);
  const [drawPlayback, setDrawPlayback] = useState<TutorialDrawPlayback | null>(null);
  const [isCombatAnimating, setIsCombatAnimating] = useState(false);
  const [combatSpeed, setCombatSpeedState] = useState<CombatAnimationSpeed>(1);
  const [sequencer] = useState(() => new CombatAnimationSequencer());
  const drawTimerRef = useRef<number | null>(null);

  const step = TUTORIAL_STEPS[stepIndex] ?? TUTORIAL_STEPS[0]!;
  const isResourceAnimating = drawPlayback !== null;
  const baseView = createAuthorizedGameView(state, 1);
  const cumulativeHpDamage = combatPlayback?.cumulativeHpDamage ?? drawPlayback?.damageByPlayer;
  const view = cumulativeHpDamage === undefined && drawPlayback === null
    ? baseView
    : {
        ...baseView,
        players: {
          1: {
            ...baseView.players[1],
            hp: Math.max(0, baseView.players[1].hp - (cumulativeHpDamage?.[1] ?? 0)),
            souls: Math.max(0, baseView.players[1].souls - (drawPlayback?.soulsSpentByPlayer[1] ?? 0))
          },
          2: {
            ...baseView.players[2],
            hp: Math.max(0, baseView.players[2].hp - (cumulativeHpDamage?.[2] ?? 0)),
            souls: Math.max(0, baseView.players[2].souls - (drawPlayback?.soulsSpentByPlayer[2] ?? 0))
          }
        }
      };

  useEffect(() => () => sequencer.cancel(false), [sequencer]);

  useEffect(() => () => {
    if (drawTimerRef.current !== null) {
      window.clearTimeout(drawTimerRef.current);
    }
  }, []);

  const applyResult = useCallback((result: GameOperationResult, previousState: GameState) => {
    const entries = formatGameEvents(result.events, previousState, result.state);
    setState(result.state);
    setSelectedCardId(null);
    setMatchLog((current) => [...current, ...entries].slice(-40));
  }, []);

  const startDrawPlayback = useCallback((
    result: GameOperationResult,
    previousState: GameState,
    onComplete: () => void
  ) => {
    const segments = drawSegments(result.events);
    const hasResourceEvent = segments.some((segment) => (
      segment.damageByPlayer[1] > 0
      || segment.damageByPlayer[2] > 0
      || segment.soulsSpentByPlayer[1] > 0
      || segment.soulsSpentByPlayer[2] > 0
    ));

    if (!hasResourceEvent) {
      applyResult(result, previousState);
      onComplete();
      return;
    }

    const first = segments[0];
    if (first === undefined) {
      applyResult(result, previousState);
      onComplete();
      return;
    }

    setSelectedCardId(null);
    setDrawPlayback({
      result,
      segments,
      index: 0,
      damageByPlayer: first.damageByPlayer,
      soulsSpentByPlayer: first.soulsSpentByPlayer,
      currentDamageByPlayer: first.damageByPlayer,
      currentSoulsSpentByPlayer: first.soulsSpentByPlayer,
      onComplete
    });
    setMessage(segmentMessage(first));
    setMatchLog((current) => [
      ...current,
      ...formatGameEvents(first.events, previousState, result.state)
    ].slice(-40));
  }, [applyResult]);

  const advanceDrawPlayback = useCallback(() => {
    const playback = drawPlayback;
    if (playback === null) return;

    const nextIndex = playback.index + 1;
    const next = playback.segments[nextIndex];
    if (next === undefined) {
      setState(playback.result.state);
      setDrawPlayback(null);
      playback.onComplete();
      return;
    }

    const damageByPlayer = {
      1: playback.damageByPlayer[1] + next.damageByPlayer[1],
      2: playback.damageByPlayer[2] + next.damageByPlayer[2]
    } as const;
    const soulsSpentByPlayer = {
      1: playback.soulsSpentByPlayer[1] + next.soulsSpentByPlayer[1],
      2: playback.soulsSpentByPlayer[2] + next.soulsSpentByPlayer[2]
    } as const;

    setDrawPlayback({
      ...playback,
      index: nextIndex,
      damageByPlayer,
      soulsSpentByPlayer,
      currentDamageByPlayer: next.damageByPlayer,
      currentSoulsSpentByPlayer: next.soulsSpentByPlayer
    });
    setMessage(segmentMessage(next));
    setMatchLog((current) => [
      ...current,
      ...formatGameEvents(next.events, playback.result.state, playback.result.state)
    ].slice(-40));
  }, [drawPlayback]);

  useEffect(() => {
    if (drawPlayback === null || drawTimerRef.current !== null) return;
    drawTimerRef.current = window.setTimeout(() => {
      drawTimerRef.current = null;
      advanceDrawPlayback();
    }, DRAW_FEEDBACK_DELAY_MS);
  }, [advanceDrawPlayback, drawPlayback]);

  const start = useCallback(() => {
    const nextState = createTutorialGame();
    setPhase('active');
    setStepIndex(1);
    setState(nextState);
    setSelectedCardId(null);
    setStepCompleted(false);
    setExploredZones(new Set());
    setHighlightedZone(null);
    setDrawPlayback(null);
    setMatchLog(initialLog);
    setMessage(messageForStep(TUTORIAL_STEPS[1]!));
  }, []);

  const reset = useCallback(() => {
    sequencer.cancel();
    if (drawTimerRef.current !== null) {
      window.clearTimeout(drawTimerRef.current);
      drawTimerRef.current = null;
    }
    setPhase('intro');
    setStepIndex(0);
    setState(createTutorialGame());
    setSelectedCardId(null);
    setStepCompleted(false);
    setExploredZones(new Set());
    setHighlightedZone(null);
    setCombatPlayback(null);
    setDrawPlayback(null);
    setIsCombatAnimating(false);
    setMatchLog(initialLog);
    setMessage('Começa o tutorial para aprender os fundamentos do SOULS.');
  }, [sequencer]);

  const restartStep = useCallback(() => {
    sequencer.cancel();
    if (drawTimerRef.current !== null) {
      window.clearTimeout(drawTimerRef.current);
      drawTimerRef.current = null;
    }
    const nextState = scenarioForStep(step.id, state);
    setState(nextState);
    setSelectedCardId(null);
    setStepCompleted(false);
    setExploredZones(new Set());
    setHighlightedZone(null);
    setCombatPlayback(null);
    setDrawPlayback(null);
    setIsCombatAnimating(false);
    setMessage(messageForStep(step));
  }, [sequencer, state, step]);

  const advanceStep = useCallback(() => {
    if (phase !== 'active' || !stepCompleted && step.kind !== 'explain') {
      setMessage('Conclui o objetivo indicado antes de avançar.');
      return;
    }

    const nextIndex = stepIndex + 1;

    if (nextIndex >= TUTORIAL_STEPS.length) {
      markTutorialCompleted();
      setPhase('complete');
      return;
    }

    const nextStep = TUTORIAL_STEPS[nextIndex]!;
    setStepIndex(nextIndex);
    setState((current) => scenarioForStep(nextStep.id, current));
    setSelectedCardId(null);
    setStepCompleted(false);
    setExploredZones(new Set());
    setHighlightedZone(null);
    setCombatPlayback(null);
    setDrawPlayback(null);
    setMessage(messageForStep(nextStep));
  }, [phase, step.kind, stepCompleted, stepIndex]);

  const exploreZone = useCallback((zone: TutorialZone) => {
    if (step.id !== 'board') {
      return;
    }

    const nextZones = new Set(exploredZones);
    nextZones.add(zone);
    setExploredZones(nextZones);
    setHighlightedZone(zone);
    setMessage(zone === 'defense'
      ? 'A defesa protege a tua coluna dos ataques adversários.'
      : zone === 'melee'
        ? 'A zona melee coloca guerreiros corpo a corpo na linha de combate.'
        : 'A zona ranged permite ataques de longo alcance.');

    if (nextZones.size === 3) {
      setStepCompleted(true);
      setMessage('As três zonas foram reconhecidas.');
    }
  }, [exploredZones, step.id]);

  const selectCard = useCallback((instanceId: CardInstanceId) => {
    if (phase !== 'active' || isCombatAnimating || isResourceAnimating) {
      return;
    }

    if (!view.viewer.hand.includes(instanceId)) {
      setMessage('Seleciona uma carta da mão do jogador tutorial.');
      return;
    }

    if (step.targetCard !== undefined && !targetCardMatches(state, instanceId, step.targetCard)) {
      setMessage(`Agora seleciona o ${cardLabel(step.targetCard)}.`);
      return;
    }

    setSelectedCardId(instanceId);
    setMessage(step.kind === 'card-selection' ? 'Carta selecionada. Consulta agora o painel grande com os seus atributos.' : 'Carta selecionada. Escolhe uma célula destacada.');

    if (step.kind === 'card-selection') {
      setStepCompleted(true);
    }
  }, [isCombatAnimating, isResourceAnimating, phase, state, step, view.viewer.hand]);

  const selectBoardCard = useCallback((instanceId: CardInstanceId) => {
    if (phase !== 'active' || isCombatAnimating || isResourceAnimating || step.kind !== 'retirement') {
      return;
    }

    const instance = state.cardInstances[instanceId];
    if (instance?.ownerId !== 1 || !Object.values(state.board.occupants).includes(instanceId)) {
      setMessage('Seleciona uma carta tua que esteja no campo.');
      return;
    }

    setSelectedCardId(instanceId);
    setMessage('Carta selecionada. Executa a retirada estratégica para receber uma Soul.');
  }, [isCombatAnimating, isResourceAnimating, phase, state, step.kind]);

  const placeSelectedCard = useCallback((row: number, column: number) => {
    if (phase !== 'active' || isCombatAnimating || isResourceAnimating || !['placement', 'challenge'].includes(step.kind)) {
      return;
    }

    if (selectedCardId === null) {
      setMessage('Seleciona primeiro a carta indicada.');
      return;
    }

    if (step.kind === 'placement') {
      if (step.targetCard === undefined || step.targetRow === undefined) {
        setMessage('Esta etapa ainda não tem um objetivo de colocação configurado.');
        return;
      }

      if (!targetCardMatches(state, selectedCardId, step.targetCard)) {
        setMessage('Esta não é a carta pedida nesta etapa.');
        return;
      }

      if (row !== step.targetRow) {
        setMessage(step.targetRow === 3
          ? 'O Defensor deve ficar na linha defensiva.'
          : step.targetRow === 4
            ? `O ${step.targetCard === 'cavaleiro-negro' ? 'Cavaleiro Negro' : 'Cavaleiro'} deve ficar na linha melee.`
            : 'O Arqueiro deve ficar na linha ranged.');
        return;
      }
    }

    try {
      const result = placeCard(state, {
        playerId: 1,
        instanceId: selectedCardId,
        row,
        column
      });
      applyResult(result, state);
      if (step.kind === 'challenge') {
        setMessage('Carta posicionada. Podes colocar outra carta ou terminar o posicionamento.');
      } else {
        setStepCompleted(true);
        setMessage('Objetivo concluído. A ação foi validada pelo motor oficial.');
      }
    } catch (error) {
      setMessage(error instanceof GameRuleError ? error.message : 'Essa ação não pode ser executada neste cenário.');
    }
  }, [applyResult, isCombatAnimating, isResourceAnimating, phase, selectedCardId, state, step]);

  const retireSelectedCard = useCallback(() => {
    if (phase !== 'active' || isCombatAnimating || isResourceAnimating || step.kind !== 'retirement') {
      return;
    }

    if (selectedCardId === null) {
      setMessage('Seleciona primeiro uma carta no campo.');
      return;
    }

    try {
      const result = retireCard(state, { playerId: 1, instanceId: selectedCardId });
      applyResult(result, state);
      setStepCompleted(true);
      setMessage('Retirada concluída: recebeste uma Soul e ficou uma colocação disponível.');
    } catch (error) {
      setMessage(error instanceof GameRuleError ? error.message : 'Não foi possível retirar esta carta.');
    }
  }, [applyResult, isCombatAnimating, isResourceAnimating, phase, selectedCardId, state, step.kind]);

  const resolveDraw = useCallback(() => {
    if (phase !== 'active' || step.kind !== 'draw' || isResourceAnimating || state.turn.phase !== 'draw') {
      return;
    }

    try {
      const result = resolveDrawPhase(state);
      startDrawPlayback(result, state, () => {
        setStepCompleted(true);
        setMessage('As duas compras oficiais foram observadas.');
      });
    } catch (error) {
      setMessage(error instanceof GameRuleError ? error.message : 'Não foi possível efetuar a compra.');
    }
  }, [isResourceAnimating, phase, startDrawPlayback, state, step.kind]);

  const finishPositioning = useCallback(() => {
    if (phase !== 'active' || isCombatAnimating || isResourceAnimating || step.kind !== 'challenge' || state.turn.phase !== 'positioning') {
      return;
    }

    if (state.turn.placementsMade === 0) {
      setMessage('Coloca pelo menos um atacante antes de terminar o posicionamento.');
      return;
    }

    try {
      const result = finishPositioningPhase(state);
      applyResult(result, state);
      setMessage('Posicionamento terminado. Agora observa o ataque da tua coluna.');
    } catch (error) {
      setMessage(error instanceof GameRuleError ? error.message : 'Não foi possível terminar o posicionamento.');
    }
  }, [applyResult, isCombatAnimating, isResourceAnimating, phase, state, step.kind]);

  const resolveAttack = useCallback(() => {
    if (phase !== 'active' || !['combat', 'challenge'].includes(step.kind) || isCombatAnimating || isResourceAnimating || state.turn.phase !== 'attack') {
      return;
    }

    try {
      const previousState = state;
      const result = resolveAttackPhase(previousState);
      const trace = result.combatTrace;

      if (trace === undefined || trace.columns.length === 0) {
        applyResult(result, previousState);
        setStepCompleted(true);
        setMessage('O motor resolveu a coluna sem ataques pendentes.');
        return;
      }

      setIsCombatAnimating(true);
      setCombatPlayback(null);
      setMessage('Combate em reprodução. Observa a ordem oficial da coluna.');

      sequencer.play(
        trace,
        {
          onStep: (playback) => setCombatPlayback(playback),
          onComplete: () => {
            setState(result.state);
            setCombatPlayback(null);
            setIsCombatAnimating(false);
            setStepCompleted(true);
            setMatchLog((current) => [
              ...current,
              ...formatGameEvents(result.events, previousState, result.state)
            ].slice(-40));
            setMessage('Combate concluído pelo motor oficial.');
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
  }, [applyResult, combatSpeed, isCombatAnimating, isResourceAnimating, phase, sequencer, state, step.kind]);

  const setCombatSpeed = useCallback((speed: CombatAnimationSpeed) => {
    setCombatSpeedState(speed);
    sequencer.setSpeed(speed);
  }, [sequencer]);

  const skipCombat = useCallback(() => sequencer.skip(), [sequencer]);

  const highlightedRows = useMemo<readonly BoardRow[]>(() => {
    if (step.id === 'board') return highlightedZone === null ? [] : zoneRows[highlightedZone];
    if (step.targetRow !== undefined) return [step.targetRow];
    if (step.id === 'combat') return [2, 4];
    if (step.id === 'combined') return [2, 4, 5];
    if (step.id === 'retirement') return [4];
    if (step.id === 'victory') return [2, 4, 5];
    return [];
  }, [highlightedZone, step]);

  const canPlaceSelectedCard = useCallback((instanceId: CardInstanceId, position: BoardPosition) => {
    if (state.status === 'finished' || !['placement', 'challenge'].includes(step.kind)) {
      return false;
    }

    return canPlaceCard(state, {
      playerId: 1,
      instanceId,
      row: position.row,
      column: position.column
    });
  }, [state, step.kind]);

  const getCellState = useCallback((position: BoardPosition, occupantId: string | null): BoardCellState => {
    if (isCombatAnimating || isResourceAnimating) {
      return 'invalid';
    }

    if (step.id === 'board') {
      return occupantId === null ? 'valid' : 'inactive';
    }

    if (step.kind === 'retirement') {
      return occupantId === null ? 'inactive' : 'valid';
    }

    if (selectedCardId === null) {
      return occupantId === null ? 'inactive' : 'valid';
    }

    if (occupantId !== null) {
      return 'invalid';
    }

    return canPlaceSelectedCard(selectedCardId, position) ? 'valid' : 'invalid';
  }, [canPlaceSelectedCard, isCombatAnimating, isResourceAnimating, selectedCardId, step.id, step.kind]);

  const canAdvance = phase === 'active' && (stepCompleted || step.kind === 'explain');
  const commands: TutorialCommands = {
    start,
    reset,
    restartStep,
    advanceStep,
    exploreZone,
    selectCard,
    selectBoardCard,
    placeSelectedCard,
    retireSelectedCard,
    resolveDraw,
    finishPositioning,
    resolveAttack,
    setCombatSpeed,
    skipCombat
  };

  return {
    phase,
    step,
    stepIndex,
    totalSteps: TUTORIAL_STEPS.length,
    state,
    view,
    selectedCardId,
    highlightedCardId: step.targetCard === undefined
      ? null
      : view.viewer.hand.find((instanceId) => targetCardMatches(state, instanceId, step.targetCard)) ?? null,
    message,
    matchLog,
    stepCompleted,
    exploredZones,
    highlightedZone,
    highlightedRows,
    combatPlayback,
    combatSpeed,
    isCombatAnimating,
    isResourceAnimating,
    resourceDamageByPlayer: drawPlayback?.currentDamageByPlayer ?? null,
    resourceSoulDeltaByPlayer: drawPlayback === null
      ? null
      : {
          1: -(drawPlayback.currentSoulsSpentByPlayer[1] ?? 0),
          2: -(drawPlayback.currentSoulsSpentByPlayer[2] ?? 0)
        },
    resourcePlaybackKey: drawPlayback === null ? undefined : `tutorial-draw-${drawPlayback.index}`,
    canAdvance,
    canPlaceSelectedCard,
    getCellState,
    commands
  };
}
