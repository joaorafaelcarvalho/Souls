import type { CardDefinition, CardInstance, CardInstanceId } from '@souls/game-core';
import { useEffect, useRef } from 'react';
import { Card } from '../../cards/presentation/Card';
import styles from './PlayerHand.module.css';

export interface PlayerHandProps {
  readonly cardIds: readonly CardInstanceId[];
  readonly cardInstances: Readonly<Record<CardInstanceId, CardInstance>>;
  readonly cardDefinitions: Readonly<Record<string, CardDefinition>>;
  readonly selectedCardId: CardInstanceId | null;
  readonly onSelect: (cardId: CardInstanceId) => void;
  readonly disabled?: boolean;
}

export function PlayerHand({
  cardIds,
  cardInstances,
  cardDefinitions,
  selectedCardId,
  onSelect,
  disabled = false
}: PlayerHandProps) {
  const cardsRef = useRef<HTMLDivElement>(null);

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
    <section className={styles.hand}>
      <div className={styles.heading}>
      </div>
      <div ref={cardsRef} className={styles.cards}>
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
              onClick={() => onSelect(instanceId)}
            >
              <Card definition={definition} selected={isSelected} variant="hand" />
            </button>
          );
        })}
      </div>
    </section>
  );
}