import type { PlayerId } from '@souls/game-core';
import { useEffect, useRef } from 'react';
import type { AuthorizedGameView } from '../application/authorizedGameView';
import { useAudio } from '../../../shared/audio/AudioProvider';
import styles from './GameResultOverlay.module.css';

export interface GameResultOverlayProps {
  readonly view: AuthorizedGameView;
  readonly onRematch: () => void;
  readonly onMenu: () => void;
  readonly visible?: boolean;
  readonly playerLabels?: Readonly<Record<PlayerId, string>>;
}

function playerLabel(playerId: PlayerId): string {
  return `Jogador ${playerId}`;
}

export function GameResultOverlay({ view, onRematch, onMenu, visible = true, playerLabels }: GameResultOverlayProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { playSfx } = useAudio();

  useEffect(() => {
    if (visible && view.status === 'finished' && view.winnerId !== undefined) {
      buttonRef.current?.focus();
    }
  }, [view.status, view.winnerId, visible]);

  if (!visible || view.status !== 'finished' || view.winnerId === undefined) {
    return null;
  }

  const winnerId = view.winnerId;
  const loserId: PlayerId = winnerId === 1 ? 2 : 1;
  const winner = view.players[winnerId];
  const loser = view.players[loserId];
  const localVictory = winnerId === view.viewerPlayerId;

  return (
    <div className={`${styles.overlay} ${localVictory ? styles.victory : styles.defeat}`} data-testid="game-result-overlay">
      <section
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-result-title"
        aria-describedby="game-result-subtitle"
      >
        <div className={styles.decor} aria-hidden="true">
          <img className={`${styles.asset} ${styles.frameTop}`} src="/images/result/result-frame-top.png" alt="" />
          <img className={`${styles.asset} ${styles.swordCrest}`} src="/images/result/result-sword-crest.png" alt="" />
          <img className={`${styles.asset} ${styles.statueLeft}`} src="/images/result/result-statue-left.png" alt="" />
          <img className={`${styles.asset} ${styles.statueRight}`} src="/images/result/result-statue-right.png" alt="" />
          <img className={`${styles.asset} ${styles.bannerLeft}`} src="/images/result/result-banner-left.png" alt="" />
          <img className={`${styles.asset} ${styles.bannerRight}`} src="/images/result/result-banner-right.png" alt="" />
          <img className={`${styles.asset} ${styles.architectureLeft}`} src="/images/result/result-architecture-left.png" alt="" />
          <img className={`${styles.asset} ${styles.architectureRight}`} src="/images/result/result-architecture-right.png" alt="" />
          <img className={`${styles.asset} ${styles.frameBottom}`} src="/images/result/result-frame-bottom.png" alt="" />
          <img className={`${styles.asset} ${styles.spiritBase}`} src="/images/result/result-spirit-base.png" alt="" />
        </div>

        <div className={styles.panelContent}>
          <p className={styles.eyebrow}>FIM DA PARTIDA</p>
          <h2 id="game-result-title">{localVictory ? 'VITÓRIA' : 'DERROTA'}</h2>
          <p id="game-result-subtitle" className={styles.subtitle}>O duelo chegou ao fim.</p>

          <div className={styles.winnerBanner}>
            <span>{playerLabels?.[winnerId] ?? playerLabel(winnerId)} venceu</span>
          </div>

          <dl className={styles.summary}>
            <div>
              <dt><span className={styles.summaryIcon} aria-hidden="true">⚔</span> Jogador derrotado:</dt>
              <dd>{playerLabels?.[loserId] ?? playerLabel(loserId)}</dd>
            </div>
            <div>
              <dt><span className={styles.summaryIcon} aria-hidden="true">♥</span> HP final:</dt>
              <dd>{winner.hp.toLocaleString('pt-PT')}</dd>
            </div>
            <div>
              <dt><span className={styles.summaryIcon} aria-hidden="true">⌛</span> Ronda final:</dt>
              <dd>{view.turn.round}</dd>
            </div>
            <div>
              <dt><span className={styles.summaryIcon} aria-hidden="true">♨</span> Souls finais:</dt>
              <dd>{winner.souls}</dd>
            </div>
            <div className={styles.secondarySoulRow}>
              <dt>Souls · {playerLabels?.[loserId] ?? playerLabel(loserId)}:</dt>
              <dd>{loser.souls}</dd>
            </div>
          </dl>

          <div className={styles.actions}>
            <button ref={buttonRef} className={`${styles.action} ${styles.rematch}`} type="button" onClick={() => {
              void playSfx('sfx.ui.click');
              onRematch();
            }}>
              Revanche
            </button>
            <button className={`${styles.action} ${styles.close}`} type="button" onClick={() => {
              void playSfx('sfx.ui.click');
              onMenu();
            }}>
              Menu Principal
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
