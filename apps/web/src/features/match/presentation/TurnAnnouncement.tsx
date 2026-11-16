import type { PlayerId } from '@souls/game-core';
import { useEffect, useRef } from 'react';
import styles from './TurnAnnouncement.module.css';

export const TURN_ANNOUNCEMENT_DURATION_MS = 960;

export interface TurnAnnouncementProps {
  readonly playerId: PlayerId;
  readonly onComplete: () => void;
}

export function TurnAnnouncement({ playerId, onComplete }: TurnAnnouncementProps) {
  const completeRef = useRef(onComplete);

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const isReduced = typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = isReduced ? 180 : TURN_ANNOUNCEMENT_DURATION_MS;
    const timer = window.setTimeout(() => completeRef.current(), duration);

    return () => window.clearTimeout(timer);
  }, [playerId]);

  return (
    <div className={styles.overlay} role="status" aria-live="assertive" data-testid="turn-announcement">
      <div className={styles.content}>
        <span className={styles.sigil} aria-hidden="true">⚔</span>
        <p className={styles.eyebrow}>O DUELO CONTINUA</p>
        <p className={styles.title}>VEZ DO JOGADOR {playerId}</p>
        <span className={styles.energy} aria-hidden="true" />
      </div>
    </div>
  );
}
