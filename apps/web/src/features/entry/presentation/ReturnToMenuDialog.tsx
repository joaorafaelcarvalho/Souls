import { useEffect, useRef } from 'react';
import styles from './ReturnToMenuDialog.module.css';

export interface ReturnToMenuDialogProps {
  readonly open: boolean;
  readonly onCancel: () => void;
  readonly onConfirm: () => void;
}

export function ReturnToMenuDialog({ open, onCancel, onConfirm }: ReturnToMenuDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    cancelButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCancel, open]);

  if (!open) {
    return null;
  }

  return (
    <div className={styles.overlay} data-testid="return-to-menu-dialog">
      <section
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="return-to-menu-title"
        aria-describedby="return-to-menu-description"
      >
        <span className={styles.crest} aria-hidden="true">✦</span>
        <span className={styles.eyebrow}>ABANDONAR O DUELO</span>
        <h2 id="return-to-menu-title">Voltar ao menu principal?</h2>
        <p id="return-to-menu-description">A demonstração atual será encerrada e uma nova partida local será preparada quando escolheres JOGAR novamente.</p>
        <div className={styles.actions}>
          <button ref={cancelButtonRef} className={styles.cancel} type="button" onClick={onCancel}>
            Continuar partida
          </button>
          <button className={styles.confirm} type="button" onClick={onConfirm}>
            Voltar ao menu
          </button>
        </div>
      </section>
    </div>
  );
}