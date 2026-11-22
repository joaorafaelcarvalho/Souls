import type { CardDefinition } from '@souls/game-core';
import { summonCost } from '@souls/game-core';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Card } from './Card';
import styles from './CardInspectionDialog.module.css';

const COMPACT_VIEWPORT_QUERY = '(max-width: 64rem)';

export type CardInspectionSource = 'hand' | 'board';

export interface CardInspectionDialogProps {
  readonly open: boolean;
  readonly definition: CardDefinition | undefined;
  readonly source: CardInspectionSource;
  readonly canPlace: boolean;
  readonly canRetire: boolean;
  readonly showRetireAction: boolean;
  readonly retirementLabel: string;
  readonly retirementDisabledReason?: string;
  readonly onClose: () => void;
  readonly onPlace: () => void;
  readonly onRetire: () => void;
}

function useCompactViewport(): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }

    return window.matchMedia(COMPACT_VIEWPORT_QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mediaQuery = window.matchMedia(COMPACT_VIEWPORT_QUERY);
    const updateMatches = () => setMatches(mediaQuery.matches);
    updateMatches();
    mediaQuery.addEventListener?.('change', updateMatches);

    return () => {
      mediaQuery.removeEventListener?.('change', updateMatches);
    };
  }, []);

  return matches;
}

export function CardInspectionDialog({
  open,
  definition,
  source,
  canPlace,
  canRetire,
  showRetireAction,
  retirementLabel,
  retirementDisabledReason,
  onClose,
  onPlace,
  onRetire
}: CardInspectionDialogProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const isCompactViewport = useCompactViewport();

  useEffect(() => {
    if (!open || !isCompactViewport) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedRef.current?.focus();
      previouslyFocusedRef.current = null;
    };
  }, [isCompactViewport, onClose, open]);

  if (!open || !isCompactViewport || definition === undefined) {
    return null;
  }

  function handleBackdropMouseDown(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  const category = definition.type === 'melee' ? 'Corpo a corpo (melee)' : 'Longo alcance (ranged)';
  const placeHint = canPlace
    ? 'Depois de colocar, escolhe uma casa válida no tabuleiro.'
    : 'Indisponível nesta fase ou sem uma casa válida para esta carta.';
  const retireHint = canRetire
    ? 'A retirada consome uma ação de posicionamento.'
    : retirementDisabledReason ?? 'A retirada não está disponível neste momento.';

  return (
    <div className={styles.overlay} data-testid="card-inspection-dialog" onMouseDown={handleBackdropMouseDown}>
      <section
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="card-inspection-title"
      >
        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>{source === 'hand' ? 'Carta na mão' : 'Carta no campo'}</span>
            <h2 id="card-inspection-title">{definition.name}</h2>
          </div>
          <button
            ref={closeButtonRef}
            className={styles.closeButton}
            type="button"
            aria-label="Voltar à partida"
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className={styles.scrollArea}>
          <div className={styles.overview}>
            <div className={styles.cardPreview}>
              <Card definition={definition} variant="inspection" />
            </div>

            <div className={styles.details}>
              <dl className={styles.attributes}>
                <div><dt>Categoria</dt><dd>{category}</dd></div>
                <div><dt>Nível</dt><dd>{definition.level}</dd></div>
                <div><dt>ATK</dt><dd>{definition.attack}</dd></div>
                <div><dt>DEF</dt><dd>{definition.defense}</dd></div>
                <div><dt>Custo</dt><dd>{summonCost(definition.level)} Souls</dd></div>
              </dl>
            </div>
          </div>
        </div>

        <footer className={styles.footer}>
          <div className={styles.actionHints} aria-live="polite">
            {source === 'hand' ? <span>{placeHint}</span> : null}
            {showRetireAction ? <span>{retireHint}</span> : null}
          </div>
          <div className={styles.actions}>
            <button className={styles.secondaryAction} type="button" onClick={onClose}>Voltar</button>
            {source === 'hand' ? (
              <button
                className={styles.primaryAction}
                type="button"
                disabled={!canPlace}
                onClick={onPlace}
              >
                Colocar carta
              </button>
            ) : null}
            {showRetireAction ? (
              <button
                className={styles.retireAction}
                type="button"
                disabled={!canRetire}
                onClick={onRetire}
              >
                {retirementLabel}
              </button>
            ) : null}
          </div>
        </footer>
      </section>
    </div>
  );
}
