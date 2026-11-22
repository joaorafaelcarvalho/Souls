import {
  MAX_SOULS,
  systemRandomSource,
  type BoardPosition,
  type CardInstanceId,
  type RandomSource
} from '@souls/game-core';
import type { AiDifficulty } from '@souls/game-ai';
import { appConfig } from './app/config/runtime';
import { useEffect, useRef, useState } from 'react';
import { useLocalGame } from './features/match/application/useLocalGame';
import { GameBoard, type BoardCellState } from './features/game-board/presentation/GameBoard';
import { PlayerHand } from './features/match/presentation/PlayerHand';
import { PlayerStatus } from './features/match/presentation/PlayerStatus';
import { MatchLog } from './features/match/presentation/MatchLog';
import { CardInspectionPanel } from './features/cards/presentation/CardInspectionPanel';
import { CardInspectionDialog } from './features/cards/presentation/CardInspectionDialog';
import { GameResultOverlay } from './features/match/presentation/GameResultOverlay';
import { GameRulesDialog } from './features/rules/presentation/GameRulesDialog';
import { LoadingScreen } from './features/entry/presentation/LoadingScreen';
import { MainMenu } from './features/entry/presentation/MainMenu';
import { GameModeMenu } from './features/entry/presentation/GameModeMenu';
import { CodexPage } from './features/codex/presentation/CodexPage';
import { ReturnToMenuDialog } from './features/entry/presentation/ReturnToMenuDialog';
import { MatchPresentationSequence } from './features/match/presentation/MatchPresentationSequence';
import { TutorialScreen } from './features/tutorial/presentation/TutorialScreen';
import { DeckBuilderPage } from './features/decks/presentation/DeckBuilderPage';
import { DeckPreparationScreen } from './features/decks/presentation/DeckPreparationScreen';
import { PvePreparationScreen } from './features/pve/presentation/PvePreparationScreen';
import { OnlineRoomScreen } from './features/online/presentation/OnlineRoomScreen';
import { useOnlineGame, type OnlineConnectionConfig } from './features/online/application/useOnlineGame';
import type { PlayerDeckPair } from './features/decks/application/deckTypes';
import { AUDIO_CONTEXT_MUSIC, type AudioContextId } from './shared/audio/audioManifest';
import { AudioProvider, useAudio } from './shared/audio/AudioProvider';
import styles from './App.module.css';

const phaseLabels = {
  'first-round-positioning': 'Posicionamento da primeira ronda',
  draw: 'Compra',
  positioning: 'Posicionamento',
  attack: 'Ataque'
} as const;

const combatStageLabels = {
  highlight: 'coluna em destaque',
  attack: 'ataque em curso',
  impact: 'impacto',
  consequences: 'consequências',
  transition: 'próxima coluna'
} as const;

function combatDamageFor(
  playback: ReturnType<typeof useLocalGame>['combatPlayback'],
  playerId: 1 | 2
): number {
  if (playback === null || playback === undefined || playback.stage !== 'consequences') {
    return 0;
  }

  if (playback.hpDamageTarget === playerId && playback.hpDamage > 0) {
    return playback.hpDamage;
  }

  return 0;
}

function resourceDamageFor(
  damageByPlayer: ReturnType<typeof useLocalGame>['resourceDamageByPlayer'],
  playerId: 1 | 2
): number {
  return damageByPlayer?.[playerId] ?? 0;
}

function combatSoulDeltaFor(
  playback: ReturnType<typeof useLocalGame>['combatPlayback'],
  playerId: 1 | 2
): number {
  if (playback === null || playback === undefined || playback.stage !== 'consequences') {
    return 0;
  }

  const gained = playback.soulAwards
    .filter((award) => award.playerId === playerId)
    .reduce((total, award) => total + award.amount, 0);

  if (gained > 0) {
    return gained;
  }

  return 0;
}
export interface AppProps {
  readonly random?: RandomSource;
}

export default function App(props: AppProps) {
  return (
    <AudioProvider>
      <AppContent {...props} />
    </AudioProvider>
  );
}

function AppContent({ random = systemRandomSource }: AppProps) {
  const audio = useAudio();
  const [selectedPlayerDecks, setSelectedPlayerDecks] = useState<PlayerDeckPair | null>(null);
  const [onlineConfig, setOnlineConfig] = useState<OnlineConnectionConfig | null>(null);
  const [pveConfig, setPveConfig] = useState<{ readonly difficulty: AiDifficulty } | null>(null);
  const [presentationReady, setPresentationReady] = useState(true);
  const [deckStartToken, setDeckStartToken] = useState(0);
  const localGame = useLocalGame({
    random,
    restartKey: deckStartToken,
    onEvents: audio.playGameEvents,
    onCombatPlayback: audio.playCombatPlayback,
    onReset: audio.stopAllSfx,
    ...(selectedPlayerDecks === null ? {} : { playerDecks: selectedPlayerDecks }),
    ...(pveConfig === null ? {} : {
      viewerPlayerId: 1 as const,
      ai: { playerId: 2 as const, strategy: 'balanced' as const, difficulty: pveConfig.difficulty },
      aiPresentationReady: presentationReady
    })
  });
  const onlineGame = useOnlineGame(onlineConfig, {
    onEvents: audio.playGameEvents,
    onCombatPlayback: audio.playCombatPlayback,
    onReset: audio.stopAllSfx
  });
  const [inspectedCardId, setInspectedCardId] = useState<CardInstanceId | null>(null);
  const [handOpen, setHandOpen] = useState(false);
  const [resultVisible, setResultVisible] = useState(true);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [returnMenuOpen, setReturnMenuOpen] = useState(false);
  const [entryScreen, setEntryScreen] = useState<'loading' | 'menu' | 'mode-menu' | 'codex' | 'deck-builder' | 'deck-preparation' | 'pve-preparation' | 'online-lobby' | 'game' | 'tutorial'>('loading');
  const [isMenuLeaving, setIsMenuLeaving] = useState(false);
  const entryTransitionTimerRef = useRef<number | null>(null);
  const isOnline = onlineConfig !== null;
  const view = isOnline && onlineGame.view !== null ? onlineGame.view : localGame.view;
  const combatPlayback = isOnline ? onlineGame.combatPlayback : localGame.combatPlayback;
  const combatSpeed = isOnline ? onlineGame.combatSpeed : localGame.combatSpeed;
  const canPlaceSelectedCard = isOnline ? onlineGame.canPlaceSelectedCard : localGame.canPlaceSelectedCard;
  const commands = isOnline ? onlineGame.commands : localGame.commands;
  const isCombatAnimating = isOnline ? onlineGame.isCombatAnimating : localGame.isCombatAnimating;
  const isResourceAnimating = isOnline ? onlineGame.isResourceAnimating : localGame.isResourceAnimating;
  const isAiTurn = isOnline ? false : localGame.isAiTurn;
  const isPve = isOnline ? false : localGame.isPve;
  const matchId = isOnline ? (onlineGame.matchId ?? 'online-waiting') : localGame.matchId;
  const matchLog = isOnline ? onlineGame.matchLog : localGame.matchLog;
  const message = isOnline ? onlineGame.message : localGame.message;
  const selectedCardId = isOnline ? onlineGame.selectedCardId : localGame.selectedCardId;
  const resourceDamageByPlayer = isOnline ? onlineGame.resourceDamageByPlayer : localGame.resourceDamageByPlayer;
  const resourcePlaybackKey = isOnline ? onlineGame.resourcePlaybackKey : localGame.resourcePlaybackKey;
  const selectedCardInHand = selectedCardId !== null && view.viewer.hand.includes(selectedCardId);
  const selectedCardOnBoard = selectedCardId !== null && Object.values(view.board.occupants).includes(selectedCardId);
  const selectedCardDefinition = selectedCardId === null
    ? undefined
    : view.cardDefinitions[view.visibleCardInstances[selectedCardId]?.cardDefinitionId ?? ''];
  const inspectedCardDefinition = inspectedCardId === null
    ? undefined
    : view.cardDefinitions[view.visibleCardInstances[inspectedCardId]?.cardDefinitionId ?? ''];
  const inspectedCardInstance = inspectedCardId === null
    ? undefined
    : view.visibleCardInstances[inspectedCardId];
  const inspectedCardInHand = inspectedCardId !== null && view.viewer.hand.includes(inspectedCardId);
  const inspectedCardSource = inspectedCardInHand ? 'hand' as const : 'board' as const;
  const canPlaceInspectedCard = inspectedCardInHand
    && inspectedCardId !== null
    && !isCombatAnimating
    && !isResourceAnimating
    && !isAiTurn
    && view.status !== 'finished'
    && Array.from({ length: 6 }, (_, row) => row).some((row) =>
      Array.from({ length: 4 }, (_, column) => column).some((column) =>
        canPlaceSelectedCard(inspectedCardId, row, column)
      )
    );
  const canRetireInspectedCard = inspectedCardInstance?.ownerId === view.viewerPlayerId
    && view.activePlayerId === view.viewerPlayerId
    && view.status !== 'finished'
    && !isCombatAnimating
    && !isResourceAnimating
    && !isAiTurn
    && (view.turn.phase === 'first-round-positioning' || view.turn.phase === 'positioning')
    && view.turn.placementsMade === 0
    && !view.turn.hasRetired;
  const retirementDisabledReason = view.turn.phase !== 'first-round-positioning' && view.turn.phase !== 'positioning'
    ? 'A retirada só pode ocorrer durante o posicionamento.'
    : view.turn.placementsMade > 0 || view.turn.hasStartedPlacement
      ? 'A retirada tem de acontecer antes de qualquer colocação.'
      : view.activePlayerId !== view.viewerPlayerId
        ? 'Só o jogador ativo pode retirar uma carta.'
        : 'A retirada não está disponível neste momento.';
  const isActionAnimating = isCombatAnimating || isResourceAnimating;
  const opponentPlayerId = view.viewerPlayerId === 1 ? 2 : 1;
  const audioContext: AudioContextId | null = entryScreen === 'loading'
    ? null
    : entryScreen === 'game'
      ? view.status === 'finished'
        ? view.winnerId === view.viewerPlayerId ? 'victory' : 'defeat'
        : 'battle'
      : entryScreen === 'online-lobby'
        ? 'lobby'
        : entryScreen === 'tutorial'
          ? 'tutorial'
          : 'menu';

  useEffect(() => {
    if (audioContext === null) {
      return;
    }

    const musicId = AUDIO_CONTEXT_MUSIC[audioContext];
    audio.preload([musicId]);
    void audio.playMusic(musicId);
  }, [audio.playMusic, audio.preload, audioContext]);

  useEffect(() => () => {
    if (entryTransitionTimerRef.current !== null) {
      window.clearTimeout(entryTransitionTimerRef.current);
    }
  }, []);

  useEffect(() => {
    if (entryScreen === 'online-lobby' && onlineConfig !== null && onlineGame.view !== null) {
      setEntryScreen('game');
    }
  }, [entryScreen, onlineConfig, onlineGame.view]);

  useEffect(() => {
    if (inspectedCardId !== null && inspectedCardInstance === undefined) {
      setInspectedCardId(null);
    }
  }, [inspectedCardId, inspectedCardInstance]);

  function startLocalGame(playerDecks: PlayerDeckPair) {
    if (isMenuLeaving) {
      return;
    }

    const reducedMotion = typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setPveConfig(null);
      setPresentationReady(true);
      setSelectedPlayerDecks(playerDecks);
      setDeckStartToken((current) => current + 1);
      setEntryScreen('game');
      return;
    }

    setIsMenuLeaving(true);
    entryTransitionTimerRef.current = window.setTimeout(() => {
      entryTransitionTimerRef.current = null;
      setIsMenuLeaving(false);
      setPveConfig(null);
      setPresentationReady(true);
      setSelectedPlayerDecks(playerDecks);
      setDeckStartToken((current) => current + 1);
      setEntryScreen('game');
    }, 420);
  }

  function startPveGame(playerDecks: PlayerDeckPair, difficulty: AiDifficulty) {
    if (isMenuLeaving) return;
    const begin = () => {
      setIsMenuLeaving(false);
      setPresentationReady(false);
      setPveConfig({ difficulty });
      setSelectedPlayerDecks(playerDecks);
      setDeckStartToken((current) => current + 1);
      setEntryScreen('game');
    };
    const reducedMotion = typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      begin();
      return;
    }
    setIsMenuLeaving(true);
    entryTransitionTimerRef.current = window.setTimeout(() => {
      entryTransitionTimerRef.current = null;
      begin();
    }, 420);
  }

  function openGameModes() {
    if (isMenuLeaving) {
      return;
    }

    setIsMenuLeaving(false);
    setEntryScreen('mode-menu');
  }

  function enterTutorial() {
    if (isMenuLeaving) {
      return;
    }

    const reducedMotion = typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setEntryScreen('tutorial');
      return;
    }

    setIsMenuLeaving(true);
    entryTransitionTimerRef.current = window.setTimeout(() => {
      entryTransitionTimerRef.current = null;
      setIsMenuLeaving(false);
      setEntryScreen('tutorial');
    }, 420);
  }

  function openCodex() {
    if (isMenuLeaving) {
      return;
    }

    const reducedMotion = typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setEntryScreen('codex');
      return;
    }

    setIsMenuLeaving(true);
    entryTransitionTimerRef.current = window.setTimeout(() => {
      entryTransitionTimerRef.current = null;
      setIsMenuLeaving(false);
      setEntryScreen('codex');
    }, 420);
  }

  function openDeckPreparation() {
    setEntryScreen('deck-preparation');
  }

  function openPvePreparation() {
    setEntryScreen('pve-preparation');
  }

  function openOnlineLobby() {
    setOnlineConfig(null);
    setEntryScreen('online-lobby');
  }

  if (entryScreen === 'loading') {
    return <LoadingScreen onComplete={() => setEntryScreen('menu')} />;
  }

  if (entryScreen === 'menu') {
    return <MainMenu transitioning={isMenuLeaving} onOpenModes={openGameModes} onCodex={openCodex} onDeckBuilder={() => setEntryScreen('deck-builder')} />;
  }

  if (entryScreen === 'mode-menu') {
    return (
      <GameModeMenu
        onLocalGame={openDeckPreparation}
        onPve={openPvePreparation}
        onOnline={openOnlineLobby}
        onTutorial={enterTutorial}
        onBack={() => setEntryScreen('menu')}
      />
    );
  }

  if (entryScreen === 'codex') {
    return <CodexPage onBack={() => setEntryScreen('menu')} />;
  }

  if (entryScreen === 'deck-builder') {
    return <DeckBuilderPage onBack={() => setEntryScreen('menu')} onOpenDeckSelection={openDeckPreparation} />;
  }

  if (entryScreen === 'deck-preparation') {
    return (
      <DeckPreparationScreen
        onBack={() => setEntryScreen('mode-menu')}
        onOpenBuilder={() => setEntryScreen('deck-builder')}
        onStart={startLocalGame}
      />
    );
  }

  if (entryScreen === 'pve-preparation') {
    return (
      <PvePreparationScreen
        onBack={() => setEntryScreen('mode-menu')}
        onOpenBuilder={() => setEntryScreen('deck-builder')}
        onStart={startPveGame}
      />
    );
  }

  if (entryScreen === 'online-lobby') {
    return (
      <OnlineRoomScreen
        session={onlineGame}
        onConnected={setOnlineConfig}
        onBack={() => {
          onlineGame.commands.reset();
          setOnlineConfig(null);
          setEntryScreen('mode-menu');
        }}
      />
    );
  }

  if (entryScreen === 'tutorial') {
    return (
      <TutorialScreen
        onExit={() => {
          setIsMenuLeaving(false);
          setEntryScreen('menu');
        }}
        onPlayNow={() => {
          setIsMenuLeaving(false);
          setEntryScreen('game');
        }}
      />
    );
  }

  function handleReset() {
    audio.stopAllSfx();
    setInspectedCardId(null);
    setHandOpen(false);
    setResultVisible(true);
    commands.reset();
  }

  function handleRematch() {
    if (isOnline) {
      audio.stopAllSfx();
      onlineGame.acceptRematch();
      return;
    }
    handleReset();
  }

  function requestReturnToMenu() {
    setReturnMenuOpen(true);
  }

  function cancelReturnToMenu() {
    setReturnMenuOpen(false);
  }

  function confirmReturnToMenu() {
    setReturnMenuOpen(false);
    goToMainMenu();
  }

  function goToMainMenu() {
    audio.stopAllSfx();
    setInspectedCardId(null);
    setHandOpen(false);
    setRulesOpen(false);
    setResultVisible(true);
    commands.reset();
    setPveConfig(null);
    setPresentationReady(true);
    setSelectedPlayerDecks(null);
    setOnlineConfig(null);
    setIsMenuLeaving(false);
    setEntryScreen('menu');
  }

  function closeCardInspection() {
    setInspectedCardId(null);
  }

  function placeInspectedCard() {
    if (!canPlaceInspectedCard) {
      return;
    }

    setInspectedCardId(null);
    setHandOpen(false);
  }

  function retireInspectedCard() {
    if (!canRetireInspectedCard) {
      return;
    }

    commands.retireSelectedCard();
    setInspectedCardId(null);
    setHandOpen(false);
  }

  function handleHandSelect(instanceId: CardInstanceId) {
    if (isActionAnimating || isAiTurn || view.status === 'finished') {
      return;
    }

    setInspectedCardId(instanceId);
    commands.selectCard(instanceId);
  }

  function handleCellClick(position: BoardPosition, occupantId: string | null) {
    if (isActionAnimating || isAiTurn || view.status === 'finished') {
      return;
    }

    if (occupantId !== null) {
      setInspectedCardId(occupantId);
      setHandOpen(false);
      commands.selectBoardCard(occupantId);
      return;
    }

    if (selectedCardInHand) {
      commands.placeSelectedCard(position.row, position.column);
    }
  }

  function getCellState(position: BoardPosition, occupantId: string | null): BoardCellState {
    if (isActionAnimating || isAiTurn || view.status === 'finished') {
      return 'invalid';
    }

    if (!selectedCardInHand) {
      return occupantId === null ? 'inactive' : 'valid';
    }

    if (selectedCardId === null) {
      return 'invalid';
    }

    if (occupantId !== null) {
      const occupant = view.visibleCardInstances[occupantId];
      const canSelectOwnCard = (
        view.turn.phase === 'first-round-positioning' || view.turn.phase === 'positioning'
      ) && occupant?.ownerId === view.activePlayerId;

      return canSelectOwnCard ? 'valid' : 'invalid';
    }

    return canPlaceSelectedCard(selectedCardId as CardInstanceId, position.row, position.column)
      ? 'valid'
      : 'invalid';
  }

  function renderPhaseAction() {
    if (isResourceAnimating) {
      return <span>Compra em processamento…</span>;
    }
    if (isAiTurn) {
      return <span>A IA está a jogar…</span>;
    }
    if (isOnline && onlineGame.connectionState !== 'connected') {
      return <span>LIGAÇÃO INTERROMPIDA</span>;
    }
    if (isOnline && view.activePlayerId !== view.viewerPlayerId) {
      return <span>A AGUARDAR O ADVERSÁRIO</span>;
    }
    if (view.status === 'finished') {
      return <button type="button" onClick={handleReset}>Recomeçar demonstração</button>;
    }

    if (view.turn.phase === 'draw') {
      return <button type="button" onClick={commands.resolveDraw}>Efetuar duas compras</button>;
    }

    if (view.turn.phase === 'attack') {
      return <button type="button" onClick={commands.resolveAttack}>Resolver ataque obrigatório</button>;
    }

    return <button type="button" onClick={commands.advancePositioning}>Terminar posicionamento</button>;
  }

  return (
    <main className={styles.shell}>
      <aside className={styles.leftRail} aria-label="Identidade do jogo e estado do adversário">
        <div className={styles.leftTop}>
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow}>{appConfig.stageLabel}</p>
              <h1 className={styles.logoTitle}>
                <img className={styles.logo} src="/images/branding/souls-logo.png" alt={appConfig.name} />
              </h1>
            </div>
            <div className={styles.headerActions}>
              <button type="button" onClick={requestReturnToMenu}>Voltar</button>
              <button type="button" aria-label="Consultar regras do jogo" title="Consultar regras do jogo" onClick={() => setRulesOpen(true)}>Regras</button>
            </div>
          </header>
        </div>
        <MatchLog entries={matchLog} />
      </aside>

      <section className={styles.boardStage} aria-label="Área central do tabuleiro">
        <GameBoard
          board={view.board}
          perspectivePlayerId={isOnline ? view.viewerPlayerId : 1}
          cardDefinitions={view.cardDefinitions}
          cardInstances={view.visibleCardInstances}
          combatPlayback={combatPlayback}
          getCellState={getCellState}
          onCellClick={handleCellClick}
          opponentPlayerId={opponentPlayerId}
          opponentPanel={<PlayerStatus player={view.players[opponentPlayerId]} {...(isPve ? { label: 'A IA' } : {})} isActive={view.activePlayerId === opponentPlayerId} position="top" damageAmount={combatDamageFor(combatPlayback, opponentPlayerId) || resourceDamageFor(resourceDamageByPlayer, opponentPlayerId)} soulDelta={combatSoulDeltaFor(combatPlayback, opponentPlayerId)} feedbackKey={resourcePlaybackKey} feedbackSpeed={combatPlayback?.speed ?? 1} />}
          playerPlayerId={view.viewerPlayerId}
          playerPanel={<PlayerStatus player={view.players[view.viewerPlayerId]} isActive={view.activePlayerId === view.viewerPlayerId} position="bottom" damageAmount={combatDamageFor(combatPlayback, view.viewerPlayerId) || resourceDamageFor(resourceDamageByPlayer, view.viewerPlayerId)} soulDelta={combatSoulDeltaFor(combatPlayback, view.viewerPlayerId)} feedbackKey={combatPlayback === null ? resourcePlaybackKey : `${combatPlayback.column}-${combatPlayback.exchangeIndex}-p${view.viewerPlayerId}`} feedbackSpeed={combatPlayback?.speed ?? 1} />}
        />
      </section>

      <aside className={styles.rightRail} aria-label="Informações da ronda">
        <div className={styles.turnPanel} aria-label="Informações da ronda">
          <span className={styles.round}>Ronda {view.turn.round}</span>
          <strong>{isPve && isAiTurn ? 'A IA' : isOnline ? (view.activePlayerId === view.viewerPlayerId ? 'O TEU TURNO' : 'TURNO DO ADVERSÁRIO') : 'Jogador ' + view.activePlayerId}</strong>
          <span>{phaseLabels[view.turn.phase]}</span>
          {view.turn.phase === 'first-round-positioning' || view.turn.phase === 'positioning' ? (
            <span>Ações de posicionamento: {Math.max(0, 2 - view.turn.placementsMade)}/2</span>
          ) : null}

          {isCombatAnimating ? (
            <div className={styles.combatControls} aria-label="Controlos da animação de combate">
              <span>
                Coluna {combatPlayback === null ? 1 : combatPlayback.column + 1} / {combatPlayback?.totalColumns ?? 1}
                {' · '}{combatPlayback === null ? 'a preparar' : combatStageLabels[combatPlayback.stage]}
                {combatPlayback !== null && combatPlayback.exchangeCount > 1
                  ? ` · Troca ${combatPlayback.exchangeIndex + 1}/${combatPlayback.exchangeCount}`
                  : ''}
              </span>
              <button
                type="button"
                onClick={() => commands.setCombatSpeed(combatSpeed === 1 ? 2 : 1)}
              >
                {combatSpeed === 1 ? 'Acelerar 2×' : 'Velocidade 1×'}
              </button>
              <button type="button" onClick={commands.skipCombat}>Saltar animação</button>
            </div>
          ) : (
            <div className={styles.controls}>{renderPhaseAction()}</div>
          )}
          <p className={styles.message} role="status">{message}</p>
        </div>

        <CardInspectionPanel definition={inspectedCardDefinition} />
      </aside>

      <section className={`${styles.playerArea} ${handOpen ? styles.handOpen : ''}`} aria-label="Estado do jogador ativo">
        {handOpen ? (
          <button
            className={styles.handBackdrop}
            type="button"
            aria-label="Fechar mão"
            onClick={() => setHandOpen(false)}
          />
        ) : null}
        <div className={styles.playerControls}>
          <section className={styles.selection} aria-live="polite">
            <strong>
              {selectedCardDefinition === undefined
                ? 'Nenhuma carta selecionada'
                : <>Selecionada: {selectedCardDefinition.name}</>}
            </strong>
            <span>
              {selectedCardInHand
                ? 'As casas válidas estão ativas; as restantes estão desativadas.'
                : selectedCardOnBoard
                  ? 'Carta no campo selecionada.'
                  : 'Selecione uma carta da mão.'}
            </span>
            {selectedCardOnBoard && !isActionAnimating && !isAiTurn && view.turn.phase !== 'attack' && view.turn.placementsMade === 0 ? (
              <button type="button" onClick={commands.retireSelectedCard}>
                {view.players[view.activePlayerId].souls >= 5 ? 'Retirar carta · Souls no limite' : 'Retirar carta · +1 Soul'}
              </button>
            ) : null}
          </section>

          <PlayerHand
            cardDefinitions={view.cardDefinitions}
            cardIds={view.viewer.hand}
            cardInstances={view.visibleCardInstances}
            disabled={isActionAnimating || isAiTurn || (isOnline && view.activePlayerId !== view.viewerPlayerId) || view.status === 'finished'}
            onSelect={handleHandSelect}
            selectedCardId={selectedCardId}
            showHeading={handOpen}
            id="player-hand-drawer"
            {...(styles.handDrawer === undefined ? {} : { className: styles.handDrawer })}
          />
        </div>
        <button
          className={styles.handToggle}
          type="button"
          aria-label={handOpen ? 'Fechar mão' : 'Abrir mão'}
          aria-controls="player-hand-drawer"
          aria-expanded={handOpen}
          onClick={() => setHandOpen((open) => !open)}
        >
          <span aria-hidden="true">✦</span>
          Mão ({view.viewer.hand.length})
        </button>
      </section>

      <ReturnToMenuDialog open={returnMenuOpen} onCancel={cancelReturnToMenu} onConfirm={confirmReturnToMenu} />

      <GameRulesDialog open={rulesOpen} onClose={() => setRulesOpen(false)} />

      <CardInspectionDialog
        open={inspectedCardId !== null}
        definition={inspectedCardDefinition}
        source={inspectedCardSource}
        canPlace={canPlaceInspectedCard}
        canRetire={canRetireInspectedCard}
        showRetireAction={inspectedCardSource === 'board' && inspectedCardInstance?.ownerId === view.viewerPlayerId}
        retirementLabel={view.players[view.viewerPlayerId].souls >= MAX_SOULS ? 'Retirar carta · Souls no limite' : 'Retirar carta · +1 Soul'}
        retirementDisabledReason={retirementDisabledReason}
        onClose={closeCardInspection}
        onPlace={placeInspectedCard}
        onRetire={retireInspectedCard}
      />

      <GameResultOverlay view={view} visible={resultVisible} {...(isPve ? { playerLabels: { 1: 'Jogador', 2: 'A IA' } } : {})} onMenu={goToMainMenu} onRematch={handleRematch} />

      <MatchPresentationSequence
        key={matchId}
        firstPlayerId={view.turn.firstPlayerId}
        activePlayerId={view.activePlayerId}
        status={view.status}
        turnPhase={view.turn.phase}
        isResourceAnimating={isResourceAnimating}
        viewerPlayerId={view.viewerPlayerId}
        onResolveDraw={commands.resolveDraw}
        onPresentationReady={setPresentationReady}
      />
    </main>
  );
}
