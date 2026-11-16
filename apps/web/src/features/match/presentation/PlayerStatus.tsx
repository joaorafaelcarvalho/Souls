import { INITIAL_HP, type PlayerId } from '@souls/game-core';
import type { CSSProperties } from 'react';
import type { CombatAnimationSpeed } from '../../combat/application/CombatAnimationSequencer';
import { PlayerDamageEffect, SoulEffect } from './CombatResourceFeedback';
import styles from './PlayerStatus.module.css';

export interface PlayerStatusProps {
  readonly player: PlayerStatusPlayer;
  readonly isActive: boolean;
  readonly position: 'top' | 'bottom';
  readonly damageAmount?: number;
  readonly soulDelta?: number;
  readonly feedbackKey?: string | undefined;
  readonly feedbackSpeed?: CombatAnimationSpeed;
  readonly label?: string;
}

export interface PlayerStatusPlayer {
  readonly id: PlayerId;
  readonly hp: number;
  readonly souls: number;
  readonly deckCount: number;
  readonly discardCount: number;
}

type StatusStyle = CSSProperties & {
  '--hp-progress': string;
};

export function PlayerStatus({
  player,
  isActive,
  position,
  damageAmount = 0,
  soulDelta = 0,
  feedbackKey,
  feedbackSpeed = 1,
  label
}: PlayerStatusProps) {
  const hpProgress = `${Math.max(0, Math.min(100, player.hp / INITIAL_HP * 100))}%`;
  const statusStyle: StatusStyle = { '--hp-progress': hpProgress };

  return (
    <section className={`${styles.status} ${isActive ? styles.active : ''}`} data-player-position={position} style={statusStyle}>
      <div className={styles.heading}>
        <span>{label ?? 'Jogador ' + player.id}</span>
        {isActive ? <span className={styles.badge}>ativo</span> : null}
      </div>
      <div className={styles.metrics}>
        <span className={styles.hpMetric}><strong>{player.hp}</strong> HP</span>
        <span><strong>{player.souls}</strong> Souls</span>
      </div>
      <div className={styles.hpBar} aria-hidden="true"><span /></div>
      <div className={styles.secondary}>
        <span>Baralho: {player.deckCount}</span>
        <span>Descarte: {player.discardCount}</span>
      </div>
      {damageAmount > 0 || soulDelta !== 0 ? (
        <div className={styles.feedback} aria-live="polite">
          {damageAmount > 0 ? <PlayerDamageEffect key={`${feedbackKey ?? 'damage'}-damage`} amount={damageAmount} speed={feedbackSpeed} /> : null}
          {soulDelta !== 0 ? <SoulEffect key={`${feedbackKey ?? 'soul'}-soul`} delta={soulDelta} speed={feedbackSpeed} /> : null}
        </div>
      ) : null}
    </section>
  );
}
