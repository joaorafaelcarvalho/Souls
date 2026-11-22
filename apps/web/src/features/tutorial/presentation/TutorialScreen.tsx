import type { BoardPosition } from '@souls/game-core';
import { useState } from 'react';
import { GameBoard, type BoardCellState } from '../../game-board/presentation/GameBoard';
import { MatchLog } from '../../match/presentation/MatchLog';
import { PlayerHand } from '../../match/presentation/PlayerHand';
import { PlayerStatus } from '../../match/presentation/PlayerStatus';
import { useTutorialGame } from '../application/useTutorialGame';
import { TutorialCardAttributePanel } from './TutorialCardAttributePanel';
import { TutorialInstructionPanel } from './TutorialInstructionPanel';
import { useAudio } from '../../../shared/audio/AudioProvider';
import styles from './TutorialScreen.module.css';

export interface TutorialScreenProps {
  readonly onExit: () => void;
  readonly onPlayNow: () => void;
}

function Intro({ onStart, onExit }: { readonly onStart: () => void; readonly onExit: () => void }) {
  return (
    <main className={`${styles.screen} ${styles.intro}`} data-testid="tutorial-intro" aria-label="Introdução do tutorial SOULS">
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.introContent}>
        <p className={styles.eyebrow}>SOULS · PARTIDA GUIADA</p>
        <img className={styles.introLogo} src="/images/branding/souls-logo.png" alt="SOULS" />
        <span className={styles.crest} aria-hidden="true">⚔</span>
        <h1>BEM-VINDO AO SOULS</h1>
        <p className={styles.introText}>Cada carta é um guerreiro. Cada decisão pode determinar o destino da batalha.</p>
        <p className={styles.introSubtext}>Aprende a dominar o tabuleiro, proteger as tuas linhas e conquistar Souls.</p>
        <div className={styles.introActions}>
          <button className={styles.primaryButton} type="button" onClick={onStart}>COMEÇAR TUTORIAL</button>
          <button className={styles.secondaryButton} type="button" onClick={onExit}>VOLTAR AO MENU</button>
        </div>
      </div>
    </main>
  );
}

function Completion({ onRestart, onPlayNow, onExit }: { readonly onRestart: () => void; readonly onPlayNow: () => void; readonly onExit: () => void }) {
  return (
    <main className={`${styles.screen} ${styles.completeScreen}`} data-testid="tutorial-complete" aria-label="Tutorial concluído">
      <div className={styles.backdrop} aria-hidden="true" />
      <section className={styles.completePanel}>
        <span className={styles.crest} aria-hidden="true">✦</span>
        <p className={styles.eyebrow}>FUNDAMENTOS DOMINADOS</p>
        <h1>TUTORIAL CONCLUÍDO</h1>
        <p>Dominas agora os fundamentos do SOULS. O teu próximo duelo será decidido pelas tuas próprias escolhas.</p>
        <div className={styles.completeActions}>
          <button className={styles.primaryButton} type="button" onClick={onPlayNow}>JOGAR AGORA</button>
          <button className={styles.secondaryButton} type="button" onClick={onRestart}>REPETIR TUTORIAL</button>
          <button className={styles.secondaryButton} type="button" onClick={onExit}>VOLTAR AO MENU</button>
        </div>
      </section>
    </main>
  );
}

export function TutorialScreen({ onExit, onPlayNow }: TutorialScreenProps) {
  const audio = useAudio();
  const [handOpen, setHandOpen] = useState(false);
  const tutorial = useTutorialGame({
    onEvents: audio.playGameEvents,
    onCombatPlayback: audio.playCombatPlayback,
    onReset: audio.stopAllSfx
  });

  if (tutorial.phase === 'intro') {
    return <Intro onStart={tutorial.commands.start} onExit={onExit} />;
  }

  if (tutorial.phase === 'complete') {
    return <Completion onRestart={tutorial.commands.reset} onPlayNow={onPlayNow} onExit={onExit} />;
  }

  const selectedCardDefinition = tutorial.selectedCardId === null
    ? undefined
    : tutorial.view.cardDefinitions[tutorial.view.visibleCardInstances[tutorial.selectedCardId]?.cardDefinitionId ?? ''];
  const selectedCardInHand = tutorial.selectedCardId !== null && tutorial.view.viewer.hand.includes(tutorial.selectedCardId);
  const handEnabled = tutorial.step.kind === 'card-selection'
    || tutorial.step.kind === 'placement'
    || tutorial.step.kind === 'challenge';
  const boardEnabled = handEnabled || tutorial.step.kind === 'retirement';

  const action = tutorial.step.kind === 'draw'
    ? tutorial.commands.resolveDraw
    : tutorial.step.kind === 'retirement'
      ? tutorial.commands.retireSelectedCard
      : tutorial.step.id === 'victory' && tutorial.view.turn.phase === 'positioning'
        ? tutorial.commands.finishPositioning
        : tutorial.commands.resolveAttack;
  const actionLabel = tutorial.step.id === 'victory' && tutorial.view.turn.phase === 'positioning'
    ? 'Terminar posicionamento'
    : tutorial.step.id === 'victory'
      ? 'Resolver ataque'
      : undefined;
  const comparisonDefinition = tutorial.step.id === 'levels'
    ? Object.values(tutorial.view.cardDefinitions).find((definition) => definition.name === 'Rei Exilado')
    : undefined;

  function handleCellClick(position: BoardPosition, occupantId: string | null) {
    if (occupantId !== null) {
      if (tutorial.step.kind === 'retirement') {
        tutorial.commands.selectBoardCard(occupantId);
      }
      return;
    }

    if (selectedCardInHand) {
      tutorial.commands.placeSelectedCard(position.row, position.column);
    }
  }

  function getCellState(position: BoardPosition, occupantId: string | null): BoardCellState {
    if (!boardEnabled || tutorial.isCombatAnimating) {
      return 'invalid';
    }

    if (!selectedCardInHand || tutorial.selectedCardId === null) {
      return occupantId === null ? 'inactive' : 'valid';
    }

    if (occupantId !== null) {
      return 'invalid';
    }

    return tutorial.canPlaceSelectedCard(tutorial.selectedCardId, position) ? 'valid' : 'invalid';
  }

  return (
    <main className={styles.screen} data-testid="tutorial-screen" aria-label="Tutorial interativo SOULS">
      <aside className={styles.leftRail} aria-label="Progresso do tutorial">
        <header className={styles.brandHeader}>
          <p className={styles.eyebrow}>SOULS · PARTIDA GUIADA</p>
          <img src="/images/branding/souls-logo.png" alt="SOULS" />
          <button type="button" onClick={onExit}>Sair do tutorial</button>
        </header>
        <section className={styles.phaseCard} aria-label="Fase atual">
          <span>RONDA {tutorial.view.turn.round}</span>
          <strong>Jogador {tutorial.view.activePlayerId}</strong>
          <small>{tutorial.view.turn.phase}</small>
        </section>
        <MatchLog entries={tutorial.matchLog} />
      </aside>

      <section className={styles.boardStage} aria-label="Tabuleiro do tutorial">
        <GameBoard
          board={tutorial.view.board}
          cardDefinitions={tutorial.view.cardDefinitions}
          cardInstances={tutorial.view.visibleCardInstances}
          highlightedRows={tutorial.highlightedRows}
          combatPlayback={tutorial.combatPlayback}
          getCellState={getCellState}
          onCellClick={handleCellClick}
          opponentPlayerId={2}
          opponentPanel={<PlayerStatus player={tutorial.view.players[2]} isActive={tutorial.view.activePlayerId === 2} position="top" />}
          playerPlayerId={1}
          playerPanel={<PlayerStatus player={tutorial.view.players[1]} isActive={tutorial.view.activePlayerId === 1} position="bottom" />}
        />
      </section>

      <aside className={styles.rightRail} aria-label="Orientação do tutorial">
        <TutorialInstructionPanel
          step={tutorial.step}
          stepIndex={tutorial.stepIndex}
          totalSteps={tutorial.totalSteps}
          message={tutorial.message}
          stepCompleted={tutorial.stepCompleted}
          canAdvance={tutorial.canAdvance}
          isCombatAnimating={tutorial.isCombatAnimating}
          exploredZones={tutorial.exploredZones}
          highlightedZone={tutorial.highlightedZone}
          onExploreZone={tutorial.commands.exploreZone}
          onAction={action}
          {...(actionLabel === undefined ? {} : { actionLabel })}
          onAdvance={tutorial.commands.advanceStep}
          onExit={onExit}
        />
      </aside>

      <section className={`${styles.handStage} ${handOpen ? styles.handOpen : ''}`} aria-label="Mão do tutorial">
        {handOpen ? (
          <button
            className={styles.handBackdrop}
            type="button"
            aria-label="Fechar mão do tutorial"
            onClick={() => setHandOpen(false)}
          />
        ) : null}
        <div className={styles.handHeading}>
          <strong>{selectedCardDefinition === undefined ? 'Seleciona uma carta' : `Selecionada: ${selectedCardDefinition.name}`}</strong>
          <span>{handEnabled ? 'A carta indicada está destacada pelo objetivo.' : 'Observa as cartas e os seus atributos.'}</span>
        </div>
        <PlayerHand
          cardDefinitions={tutorial.view.cardDefinitions}
          cardIds={tutorial.view.viewer.hand}
          cardInstances={tutorial.view.visibleCardInstances}
          selectedCardId={tutorial.selectedCardId}
          disabled={!handEnabled || tutorial.isCombatAnimating}
          onSelect={tutorial.commands.selectCard}
          showHeading={handOpen}
          id="tutorial-hand-drawer"
          {...(styles.tutorialHand === undefined ? {} : { className: styles.tutorialHand })}
        />
        <button
          className={styles.handToggle}
          type="button"
          aria-label={handOpen ? 'Fechar mão do tutorial' : 'Abrir mão do tutorial'}
          aria-controls="tutorial-hand-drawer"
          aria-expanded={handOpen}
          onClick={() => setHandOpen((open) => !open)}
        >
          <span aria-hidden="true">✦</span>
          Mão ({tutorial.view.viewer.hand.length})
        </button>
      </section>

      {(tutorial.step.id === 'cards' || tutorial.step.id === 'levels') && selectedCardDefinition !== undefined ? (
        <div className={styles.cardDetailModal} role="dialog" aria-modal="true" aria-label={`Atributos de ${selectedCardDefinition.name}`}>
          <TutorialCardAttributePanel
            definition={selectedCardDefinition}
            {...(comparisonDefinition === undefined ? {} : { comparisonDefinition })}
            onContinue={tutorial.commands.advanceStep}
          />
        </div>
      ) : null}
    </main>
  );
}
