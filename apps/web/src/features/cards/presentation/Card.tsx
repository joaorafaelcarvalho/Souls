import { useEffect, useState, type CSSProperties } from 'react';
import type { CardDefinition } from '@souls/game-core';
import styles from './Card.module.css';

export interface CardProps {
  readonly definition: CardDefinition;
  readonly variant: 'hand' | 'board' | 'inspection' | 'codex-faction' | 'deck-builder';
  readonly selected?: boolean;
}

type CardStyle = CSSProperties & {
  '--card-image': string;
};

export function Card({ definition, variant, selected = false }: CardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [definition.image]);

  const typeLabel = definition.type === 'melee' ? '' : '';
  const typeIcon = definition.type === 'melee' ? '⚔' : '➶';
  const artworkOnly = variant === 'codex-faction' || variant === 'deck-builder';
  const cardStyle: CardStyle = {
    '--card-image': 'url("' + definition.image + '")'
  };

  return (
    <article
      className={[
        styles.card,
        styles[variant],
        styles[definition.type],
        selected ? styles.selected : ''
      ].join(' ')}
      data-card-id={definition.id}
      data-card-variant={variant}
      data-testid={'card-variant-' + variant}
      style={imageFailed ? undefined : cardStyle}
    >
      {artworkOnly ? null : (
        <header className={styles.header}>
          <span className={styles.type}>
            <span className={styles.typeIcon} aria-hidden="true">{typeIcon}</span>
            {typeLabel}
          </span>
          <span className={styles.level}>{definition.level}</span>
        </header>
      )}

      {artworkOnly ? null : <h3 className={styles.name}>{definition.name}</h3>}

      {imageFailed ? (
        <div
          className={styles.imageFallback}
          role="img"
          aria-label={definition.name + ': imagem indisponível'}
        >
          Imagem indisponível
        </div>
      ) : (
        <img
          className={styles.imageProbe}
          src={definition.image}
          alt={definition.name}
          onError={() => setImageFailed(true)}
        />
      )}

      {artworkOnly ? null : (
        <div className={styles.stats}>
          <span className={styles.stat}>
            <span className={styles.statIcon} aria-hidden="true">⚔</span>
            <span> {definition.attack}</span>
          </span>
          <span className={styles.stat}>
            <span className={styles.statIcon} aria-hidden="true">🛡</span>
            <span> {definition.defense}</span>
          </span>
        </div>
      )}
    </article>
  );
}
