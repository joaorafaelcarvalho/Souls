import type { PlayerId } from '@souls/game-core';
import { useEffect, useRef, useState } from 'react';
import { useAudio } from '../../../shared/audio/AudioProvider';
import styles from './CoinTossAnimation.module.css';

export const COIN_TOSS_REVEAL_DELAY_MS = 1_950;
export const COIN_TOSS_DURATION_MS = 3_000;
export const COIN_TOSS_REDUCED_DURATION_MS = 560;

export interface CoinTossAnimationProps {
  readonly firstPlayerId: PlayerId;
  readonly onComplete: () => void;
  readonly onSkip: () => void;
}

function reducedMotion(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function CoinTossAnimation({ firstPlayerId, onComplete, onSkip }: CoinTossAnimationProps) {
  const [revealed, setRevealed] = useState(false);
  const completeRef = useRef(onComplete);
  const { playSfx } = useAudio();

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const isReduced = reducedMotion();
    const revealDelay = isReduced ? 180 : COIN_TOSS_REVEAL_DELAY_MS;
    const totalDuration = isReduced ? COIN_TOSS_REDUCED_DURATION_MS : COIN_TOSS_DURATION_MS;
    setRevealed(false);

    const revealTimer = window.setTimeout(() => setRevealed(true), revealDelay);
    const completeTimer = window.setTimeout(() => completeRef.current(), totalDuration);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(completeTimer);
    };
  }, [firstPlayerId]);

  const playerLabel = `Jogador ${firstPlayerId}`;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="coin-toss-title" data-testid="coin-toss-animation">
      <section className={styles.content}>
        <p className={styles.eyebrow}>CERIMÓNIA DE ABERTURA</p>
        <h2 id="coin-toss-title">QUEM COMEÇA O DUELO?</h2>

        <div className={styles.coinStage} aria-hidden="true">
          <div className={styles.coin}>
            <img
              className={styles.coinAnimation}
              src={firstPlayerId === 1
                ? '/images/effects/souls_coin_player_one_animada.webp'
                : '/images/effects/souls_coin_player_two_animada.webp'}
              alt=""
            />
          </div>
          <span className={`${styles.energy} ${styles.energyOne}`} />
          <span className={`${styles.energy} ${styles.energyTwo}`} />
          <span className={`${styles.energy} ${styles.energyThree}`} />
        </div>

        <p className={`${styles.result} ${revealed ? styles.resultVisible : ''}`} aria-live="assertive">
          {playerLabel} começa
        </p>
        <p className={styles.hint}>O destino da partida já foi decidido pelo motor.</p>
        <button className={styles.skip} type="button" autoFocus onClick={() => {
          void playSfx('sfx.ui.click');
          onSkip();
        }}>Saltar</button>
      </section>
    </div>
  );
}
