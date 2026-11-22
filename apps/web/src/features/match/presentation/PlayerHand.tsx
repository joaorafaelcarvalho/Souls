import type { CardDefinition, CardInstance, CardInstanceId } from '@souls/game-core';
import { useEffect, useRef } from 'react';
import { Card } from '../../cards/presentation/Card';
import { useAudio } from '../../../shared/audio/AudioProvider';
import styles from './PlayerHand.module.css';

export interface PlayerHandProps {
  readonly cardIds: readonly CardInstanceId[];
  readonly cardInstances: Readonly<Record<CardInstanceId, CardInstance>>;
  readonly cardDefinitions: Readonly<Record<string, CardDefinition>>;
  readonly selectedCardId: CardInstanceId | null;
  readonly onSelect: (cardId: CardInstanceId) => void;
  readonly disabled?: boolean;
  readonly showHeading?: boolean;
  readonly id?: string;
  readonly className?: string;
}

export function PlayerHand({
  cardIds,
  cardInstances,
  cardDefinitions,
  selectedCardId,
  onSelect,
  disabled = false,
  showHeading = false,
  id,
  className
}: PlayerHandProps) {
  const cardsRef = useRef<HTMLDivElement>(null);
  const { playSfx } = useAudio();

  useEffect(() => {
    const scrollContainer = cardsRef.current;

    if (scrollContainer === null) {
      return;
    }

    function handleWheel(event: WheelEvent) {
      if (scrollContainer!.scrollWidth <= scrollContainer!.clientWidth) {
        return;
      }

      const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX)
        ? event.deltaY
        : event.deltaX;

      if (delta === 0) {
        return;
      }

      event.preventDefault();
      scrollContainer!.scrollLeft += delta;
    }

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      scrollContainer.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <section className={`${styles.hand} ${className ?? ''}`} aria-label="Mão do jogador" {...(id === undefined ? {} : { id })}>
      <div className={styles.heading} data-hand-heading>
        {showHeading ? (
          <>
            <h2>Mão do jogador</h2>
            <span>{cardIds.length} cartas</span>
          </>
        ) : null}
      </div>
      <div ref={cardsRef} className={styles.cards} data-hand-cards>
        {cardIds.map((instanceId) => {
          const instance = cardInstances[instanceId];
          const definition = instance === undefined ? undefined : cardDefinitions[instance.cardDefinitionId];

          if (definition === undefined) {
            return null;
          }

          const isSelected = selectedCardId === instanceId;

          return (
            <button
              className={styles.card + ' ' + (isSelected ? styles.selected : '') + ' ' + (disabled ? styles.disabled : '')}
              key={instanceId}
              type="button"
              disabled={disabled}
              onClick={() => {
                void playSfx('sfx.card.select');
                onSelect(instanceId);
              }}
            >
              <Card definition={definition} selected={isSelected} variant="hand" />
            </button>
          );
        })}
      </div>
    </section>
  );
}
