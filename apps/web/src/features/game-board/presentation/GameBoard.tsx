import {
  BOARD_COLUMNS,
  BOARD_ROWS,
  getBoardPosition,
  type BoardPosition,
  type BoardState,
  type CardDefinition,
  type CardInstance,
  type BoardRow,
  type PlayerId
} from '@souls/game-core';
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { CombatPlaybackState } from '../../combat/application/CombatAnimationSequencer';
import { LightningAttackEffect } from '../../combat/presentation/LightningAttackEffect';
import { BoardCell, type BoardCellCombatEffect, type BoardCellState } from './BoardCell';
import styles from './GameBoard.module.css';

export type { BoardCellState } from './BoardCell';

export interface GameBoardProps {
  readonly board: BoardState;
  readonly cardInstances?: Readonly<Record<string, CardInstance>>;
  readonly cardDefinitions?: Readonly<Record<string, CardDefinition>>;
  readonly getCellState?: (position: BoardPosition, occupantId: string | null) => BoardCellState;
  readonly onCellClick?: (position: BoardPosition, occupantId: string | null) => void;
  readonly opponentPanel?: ReactNode;
  readonly playerPanel?: ReactNode;
  readonly combatPlayback?: CombatPlaybackState | null;
  readonly highlightedRows?: readonly BoardRow[];
  readonly perspectivePlayerId?: PlayerId;
}

interface BoardDimensions {
  readonly cellWidth: number;
  readonly cellHeight: number;
  readonly width: number;
  readonly height: number;
}

type BoardStyle = CSSProperties & {
  '--souls-board-cell-width': string;
  '--souls-board-cell-height': string;
  '--souls-board-width': string;
  '--souls-board-height': string;
};

const stageLabels: Record<CombatPlaybackState['stage'], string> = {
  highlight: 'coluna em destaque',
  attack: 'ataque em curso',
  impact: 'impacto',
  consequences: 'consequências',
  transition: 'próxima coluna'
};

function combatEffectFor(
  playback: CombatPlaybackState | null | undefined,
  column: number,
  occupantId: string | null
): BoardCellCombatEffect | undefined {
  if (playback === null || playback === undefined) {
    return undefined;
  }

  if (occupantId !== null && playback.destroyedCardIds.includes(occupantId)) {
    return 'destroyed';
  }

  if (column !== playback.column) {
    return undefined;
  }

  if (occupantId !== null && playback.attackerIds.includes(occupantId)) {
    return 'attacker';
  }

  if (occupantId !== null && playback.targetIds.includes(occupantId)) {
    return 'target';
  }

  return 'column';
}

export function GameBoard({
  board,
  cardInstances,
  cardDefinitions,
  getCellState,
  onCellClick,
  opponentPanel,
  playerPanel,
  combatPlayback,
  highlightedRows,
  perspectivePlayerId
}: GameBoardProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const boardShellRef = useRef<HTMLElement>(null);
  const [dimensions, setDimensions] = useState<BoardDimensions | null>(null);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;

    if (viewport === null || typeof ResizeObserver === 'undefined') {
      return;
    }

    const updateDimensions = () => {
      const width = viewport.clientWidth;
      const height = viewport.clientHeight;
      const computedStyle = getComputedStyle(viewport);
      const gapToken = computedStyle.getPropertyValue('--souls-board-gap').trim();
      const gapValue = Number.parseFloat(gapToken);
      const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const gap = gapToken.endsWith('rem') ? gapValue * rootFontSize : gapValue || 6;
      const cellWidth = Math.max(0, Math.min((width - gap * 3) / 4, (height - gap * 5) / 9));

      if (cellWidth === 0) {
        return;
      }

      setDimensions({
        cellWidth,
        cellHeight: cellWidth * 1.5,
        width: cellWidth * 4 + gap * 3,
        height: cellWidth * 9 + gap * 5
      });
    };

    const observer = new ResizeObserver(updateDimensions);
    observer.observe(viewport);
    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  const boardStyle: BoardStyle | undefined = dimensions === null
    ? undefined
    : {
        '--souls-board-cell-width': `${dimensions.cellWidth}px`,
        '--souls-board-cell-height': `${dimensions.cellHeight}px`,
        '--souls-board-width': `${dimensions.width}px`,
        '--souls-board-height': `${dimensions.height}px`
      };

  return (
    <section ref={boardShellRef} aria-label="Tabuleiro SOULS" className={styles.boardShell}>
      {opponentPanel === undefined ? null : <div className={styles.playerOverlayTop}>{opponentPanel}</div>}
      {playerPanel === undefined ? null : <div className={styles.playerOverlayBottom}>{playerPanel}</div>}
      <LightningAttackEffect
        cardDefinitions={cardDefinitions}
        cardInstances={cardInstances}
        containerRef={boardShellRef}
        playback={combatPlayback}
      />
      {combatPlayback === undefined || combatPlayback === null ? null : (
        <div className={styles.combatBanner} aria-live="polite">
          <strong>Coluna {combatPlayback.column + 1} / {combatPlayback.totalColumns}</strong>
          <span>{stageLabels[combatPlayback.stage]}</span>
          {combatPlayback.exchangeCount > 1
            ? <span>Troca {combatPlayback.exchangeIndex + 1} / {combatPlayback.exchangeCount}</span>
            : null}
          {combatPlayback.isCombined ? <span>Ataque combinado</span> : null}
        </div>
      )}

      <div ref={viewportRef} className={styles.gridViewport}>
        <div className={styles.grid} data-testid="game-board" style={boardStyle}>
          {Array.from({ length: BOARD_ROWS * BOARD_COLUMNS }, (_, index) => {
            const visualRow = Math.floor(index / BOARD_COLUMNS);
            const column = index % BOARD_COLUMNS;
            const row = perspectivePlayerId === 2 ? BOARD_ROWS - 1 - visualRow : visualRow;
            const position = getBoardPosition(row, column);
            const occupantId = board.occupants[position.key];
            const instance = occupantId === null ? undefined : cardInstances?.[occupantId];
            const cardDefinition = instance === undefined ? undefined : cardDefinitions?.[instance.cardDefinitionId];
            const cellState = getCellState?.(position, occupantId);
            const combatEffect = combatEffectFor(combatPlayback, column, occupantId);
            const destructionOverlayActive = occupantId !== null
              && combatPlayback?.activeDestroyedCardIds.includes(occupantId) === true;
            const tutorialHighlighted = highlightedRows?.includes(position.row) === true;

            return (
              <BoardCell
                key={position.key}
                occupantId={occupantId}
                position={position}
                {...(cardDefinition === undefined ? {} : { cardDefinition })}
                {...(cellState === undefined ? {} : { cellState })}
                {...(combatEffect === undefined ? {} : { combatEffect })}
                {...(destructionOverlayActive ? { destructionOverlayActive: true } : {})}
                {...(tutorialHighlighted ? { tutorialHighlighted: true } : {})}
                {...(combatPlayback === undefined || combatPlayback === null
                  ? {}
                  : { combatStage: combatPlayback.stage, combatSpeed: combatPlayback.speed })}
                {...(onCellClick === undefined ? {} : { onClick: onCellClick })}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
