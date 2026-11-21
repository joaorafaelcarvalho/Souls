import type { PlayerId } from '@souls/game-core';
import { useState, type SyntheticEvent } from 'react';
import { useAudio } from '../../../shared/audio/AudioProvider';
import styles from './TurnHandoffOverlay.module.css';

export const TURN_DRAW_ANIMATION_DURATION_MS = 3008;

export interface TurnHandoffOverlayProps {
  readonly playerId: PlayerId;
  readonly mode?: 'positioning' | 'draw';
  readonly drawStarted?: boolean;
  readonly canDraw?: boolean;
  readonly onContinue?: () => void;
  readonly onDraw?: () => void;
}

const DRAW_ASSET = '/images/effects/souls_saque_topo_transparente.webp';

function DrawVisual({ playing }: { readonly playing: boolean }) {
  const [firstFrameReady, setFirstFrameReady] = useState(false);

  function captureFirstFrame(event: SyntheticEvent<HTMLImageElement>) {
    const image = event.currentTarget;
    const canvas = image.previousElementSibling;

    if (!(canvas instanceof HTMLCanvasElement)) {
      return;
    }

    const context = canvas.getContext('2d');
    if (context === null) {
      return;
    }

    canvas.width = image.naturalWidth || 480;
    canvas.height = image.naturalHeight || 640;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    setFirstFrameReady(true);
  }

  return (
    <div
      className={styles.drawVisualFrame}
      data-testid="turn-draw-visual"
      data-animation-state={playing ? 'playing' : 'first-frame'}
    >
      {playing ? (
        <img
          className={styles.drawVisual}
          src={`${DRAW_ASSET}?animation=draw`}
          alt="Animação das duas compras"
        />
      ) : (
        <canvas
          className={`${styles.drawVisual} ${firstFrameReady ? styles.drawVisualReady : ''}`}
          width="480"
          height="640"
          role="img"
          aria-label="Baralho preparado para as duas compras"
        />
      )}
      {!playing ? (
        <img
          className={styles.drawPreload}
          src={DRAW_ASSET}
          alt=""
          aria-hidden="true"
          onLoad={captureFirstFrame}
        />
      ) : null}
    </div>
  );
}

export function TurnHandoffOverlay({
  playerId,
  mode = 'positioning',
  drawStarted = false,
  canDraw = true,
  onContinue,
  onDraw
}: TurnHandoffOverlayProps) {
  const isDraw = mode === 'draw';
  const { playSfx } = useAudio();
  const click = (action: (() => void) | undefined) => {
    void playSfx('sfx.ui.click');
    action?.();
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="turn-handoff-title" data-testid="turn-handoff-overlay">
      <section className={styles.panel}>
        <div className={styles.crest} aria-hidden="true">⚔</div>
        <p className={styles.eyebrow}>{isDraw ? 'NOVA RONDA' : 'PASSAGEM DE TURNO'}</p>
        <h2 id="turn-handoff-title">Jogador {playerId}</h2>
        {isDraw ? (
          <>
            <p>
              {canDraw
                ? 'É a tua vez. Efetua as duas compras obrigatórias antes de começares o posicionamento.'
                : `É a vez do Jogador ${playerId}. Aguarda que as duas compras obrigatórias terminem.`}
            </p>
            <DrawVisual playing={canDraw && drawStarted} />
            {canDraw ? (
              <button
                type="button"
                autoFocus={!drawStarted}
                disabled={drawStarted}
                onClick={() => click(onDraw)}
              >
                {drawStarted ? 'Compras em curso…' : 'Efetuar duas compras'}
              </button>
            ) : (
              <p role="status">A aguardar o Jogador {playerId}…</p>
            )}
          </>
        ) : (
          <>
            <p>Confirma que estás pronto para continuar o duelo.</p>
            <button type="button" autoFocus onClick={() => click(onContinue)}>Continuar</button>
          </>
        )}
      </section>
    </div>
  );
}
