import type { CardDefinition } from '@souls/game-core';
import { Card } from './Card';
import styles from './CardInspectionPanel.module.css';

export interface CardInspectionPanelProps {
  readonly definition: CardDefinition | undefined;
}

export function CardInspectionPanel({ definition }: CardInspectionPanelProps) {
  return (
    <section className={styles.panel} aria-label="Inspeção de carta">
      <div className={styles.heading}>
        <h2>Inspeção de Carta</h2>
        {definition === undefined ? null : <span>Detalhes</span>}
      </div>

      {definition === undefined ? (
        <div className={styles.empty}>
          <span className={styles.emblem} aria-hidden="true">◈</span>
          <p>Seleciona uma carta da mão ou do tabuleiro para consultar os seus detalhes.</p>
        </div>
      ) : (
        <div className={styles.cardArea}>
          <Card definition={definition} variant="inspection" />
        </div>
      )}
    </section>
  );
}