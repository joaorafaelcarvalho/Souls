import type { CardDefinition } from '@souls/game-core';
import { Card } from '../../cards/presentation/Card';
import styles from './TutorialCardAttributePanel.module.css';

export interface TutorialCardAttributePanelProps {
  readonly definition: CardDefinition;
  readonly comparisonDefinition?: CardDefinition;
  readonly onContinue: () => void;
}

export function TutorialCardAttributePanel({ definition, comparisonDefinition, onContinue }: TutorialCardAttributePanelProps) {
  const hasComparison = comparisonDefinition !== undefined;

  return (
    <section className={styles.panel} aria-label={`Atributos de ${definition.name}`} data-testid="tutorial-card-attributes">
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>{hasComparison ? '14 · COMPARAÇÃO DE NÍVEIS' : '03 · ANATOMIA DA CARTA'}</span>
          <h2>{definition.name}</h2>
        </div>
        <span className={styles.badge}>{hasComparison ? 'N3 · N4' : 'PAINEL DE ATRIBUTOS'}</span>
      </header>

      {hasComparison ? (
        <div className={styles.comparisonContent} aria-label="Comparação entre cartas de níveis superiores">
          <div className={styles.comparisonCard}>
            <span className={styles.comparisonLabel}>NÍVEL {definition.level}</span>
            <Card definition={definition} variant="inspection" />
            <strong>{definition.name}</strong>
          </div>
          <div className={styles.comparisonCard}>
            <span className={styles.comparisonLabel}>NÍVEL {comparisonDefinition.level}</span>
            <Card definition={comparisonDefinition} variant="inspection" />
            <strong>{comparisonDefinition.name}</strong>
          </div>
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.cardPreview}>
            <Card definition={definition} variant="inspection" />
          </div>
          <dl className={styles.attributes}>
            <div><dt>TIPO</dt><dd>{definition.type === 'melee' ? 'CORPO A CORPO' : 'LONGO ALCANCE'}</dd></div>
            <div><dt>NÍVEL</dt><dd>{definition.level}</dd></div>
            <div><dt>ATK</dt><dd>{definition.attack}</dd></div>
            <div><dt>DEF</dt><dd>{definition.defense}</dd></div>
            <div className={styles.cost}><dt>CUSTO</dt><dd>{definition.level} SOUL{definition.level === 1 ? '' : 'S'}</dd></div>
          </dl>
        </div>
      )}

      <p className={styles.note}>{hasComparison
        ? 'Cada nível acrescenta uma Soul ao custo de invocação. O tipo continua a determinar as zonas onde a carta pode ser colocada.'
        : 'O tipo define as zonas onde a carta pode ser colocada. O nível determina o custo de invocação.'}</p>
      <button className={styles.continueButton} type="button" onClick={onContinue}>CONTINUAR</button>
    </section>
  );
}
