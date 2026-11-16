import type { PlayerId } from '@souls/game-core';
import styles from './TurnHandoffOverlay.module.css';

export interface TurnHandoffOverlayProps {
  readonly playerId: PlayerId;
  readonly onContinue: () => void;
}

export function TurnHandoffOverlay({ playerId, onContinue }: TurnHandoffOverlayProps) {
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="turn-handoff-title" data-testid="turn-handoff-overlay">
      <section className={styles.panel}>
        <div className={styles.crest} aria-hidden="true">⚔</div>
        <p className={styles.eyebrow}>PASSAGEM DE TURNO</p>
        <h2 id="turn-handoff-title">Jogador {playerId}</h2>
        <p>Confirma que estás pronto para continuar o duelo.</p>
        <button type="button" autoFocus onClick={onContinue}>Continuar</button>
      </section>
    </div>
  );
}
