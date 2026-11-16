import { useEffect } from 'react';
import styles from './LoadingScreen.module.css';

export interface LoadingScreenProps {
  readonly onComplete: () => void;
  readonly durationMs?: number;
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function LoadingScreen({ onComplete, durationMs = 2_000 }: LoadingScreenProps) {
  useEffect(() => {
    if (prefersReducedMotion()) {
      onComplete();
      return;
    }

    const timer = window.setTimeout(onComplete, durationMs);
    return () => window.clearTimeout(timer);
  }, [durationMs, onComplete]);

  return (
    <main className={styles.screen} data-testid="loading-screen" aria-label="Carregamento do SOULS">
      <div className={styles.ambient} aria-hidden="true">
        <span className={`${styles.particle} ${styles.particleOne}`} />
        <span className={`${styles.particle} ${styles.particleTwo}`} />
        <span className={`${styles.particle} ${styles.particleThree}`} />
        <span className={`${styles.particle} ${styles.particleFour}`} />
      </div>

      <div className={styles.content}>
        <div className={styles.logoFrame}>
          <span className={styles.frameCorner} aria-hidden="true" />
          <img className={styles.logo} src="/images/branding/souls-logo.png" alt="SOULS" />
        </div>
        <div className={styles.progressTrack} role="progressbar" aria-label="Introdução visual do SOULS">
          <span className={styles.progressFill} />
        </div>
        <p className={styles.status}>A DESPERTAR AS ALMAS...</p>
      </div>

      <p className={styles.signature} aria-hidden="true">SOULS · PROTÓTIPO LOCAL</p>
    </main>
  );
}