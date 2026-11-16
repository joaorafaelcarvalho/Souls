import styles from './CardDestructionOverlay.module.css';

export interface CardDestructionOverlayProps {
  readonly active: boolean;
}

export function CardDestructionOverlay({ active }: CardDestructionOverlayProps) {
  if (!active) {
    return null;
  }

  return (
    <img
      className={styles.overlay}
      src="/images/effects/souls_destruction_overlay.webp"
      alt=""
      aria-hidden="true"
      data-testid="card-destruction-overlay"
    />
  );
}