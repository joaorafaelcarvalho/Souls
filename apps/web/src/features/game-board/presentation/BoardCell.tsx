import type { BoardPosition, CardDefinition } from '@souls/game-core';
import type { CSSProperties } from 'react';
import { combatVfxTiming } from '../../combat/combatVfxTiming';
import { CardDestructionOverlay } from '../../combat/presentation/CardDestructionOverlay';
import type { CombatAnimationSpeed, CombatAnimationStage } from '../../combat/application/CombatAnimationSequencer';
import { Card } from '../../cards/presentation/Card';
import styles from './BoardCell.module.css';

export type BoardCellState = 'valid' | 'invalid' | 'inactive';
export type BoardCellCombatEffect = 'column' | 'attacker' | 'target' | 'destroyed';

export interface BoardCellProps {
  readonly position: BoardPosition;
  readonly occupantId: string | null;
  readonly cardDefinition?: CardDefinition;
  readonly cellState?: BoardCellState;
  readonly combatEffect?: BoardCellCombatEffect;
  readonly combatStage?: CombatAnimationStage;
  readonly combatSpeed?: CombatAnimationSpeed;
  readonly destructionOverlayActive?: boolean;
  readonly tutorialHighlighted?: boolean;
  readonly onClick?: (position: BoardPosition, occupantId: string | null) => void;
}

const combatEffectClasses: Record<BoardCellCombatEffect, string> = {
  column: styles.combatColumn!,
  attacker: styles.combatAttacker!,
  target: styles.combatTarget!,
  destroyed: styles.combatDestroyed!
};

export function BoardCell({
  position,
  occupantId,
  cardDefinition,
  cellState = 'inactive',
  combatEffect,
  combatStage,
  combatSpeed,
  destructionOverlayActive = false,
  tutorialHighlighted = false,
  onClick
}: BoardCellProps) {
  const isOccupied = occupantId !== null && cardDefinition !== undefined;
  const isDestroyed = combatEffect === 'destroyed';
  const accessibleLabel = isOccupied
    ? isDestroyed
      ? `Carta ${cardDefinition.name} está a ser destruída.`
      : `Casa ocupada por ${cardDefinition.name}`
    : 'Casa vazia';
  const isDisabled = onClick === undefined || cellState !== 'valid';
  const combatClass = combatEffect === undefined ? '' : combatEffectClasses[combatEffect];
  const combatStyle: CSSProperties | undefined = combatSpeed === undefined
    ? undefined
    : {
        '--vfx-charge-duration': `${combatVfxTiming.charge / combatSpeed}ms`,
        '--vfx-impact-duration': `${combatVfxTiming.impact / combatSpeed}ms`,
        '--vfx-destruction-duration': `${combatVfxTiming.destructionFeedback / combatSpeed}ms`
      } as CSSProperties;

  return (
    <button
      className={`${styles.cell} ${styles[position.type]} ${styles[cellState]} ${combatClass} ${tutorialHighlighted ? styles.tutorialHighlighted : ''}`}
      data-cell-state={cellState}
      data-cell-type={position.type}
      {...(occupantId === null ? {} : { 'data-occupant-id': occupantId })}
      {...(combatSpeed === undefined ? {} : { 'data-combat-speed': combatSpeed })}
      {...(combatStyle === undefined ? {} : { style: combatStyle })}
      {...(combatEffect === undefined ? {} : { 'data-combat-effect': combatEffect })}
      {...(combatStage === undefined ? {} : { 'data-combat-stage': combatStage })}
      {...(destructionOverlayActive ? { 'data-destruction-overlay': 'active' } : {})}
      {...(tutorialHighlighted ? { 'data-tutorial-highlight': 'active' } : {})}
      data-testid={`board-cell-${position.key}`}
      aria-label={accessibleLabel}
      disabled={isDisabled}
      type="button"
      onClick={() => onClick?.(position, occupantId)}
    >
      {isOccupied && !isDestroyed ? <Card definition={cardDefinition} variant="board" /> : null}
      {isOccupied && destructionOverlayActive
        ? <CardDestructionOverlay active />
        : null}
    </button>
  );
}
