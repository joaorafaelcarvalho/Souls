export interface MatchLogProps {
  readonly entries: readonly string[];
}

import styles from './MatchLog.module.css';

export function MatchLog({ entries }: MatchLogProps) {
  const newestFirst = [...entries].reverse();

  return (
    <section className={styles.log} aria-label="Histórico da partida">
      <div className={styles.heading}>
        <h2>Análise da Partida</h2>
        <span>{entries.length}</span>
      </div>
      <ol className={styles.entries} aria-live="polite">
        {newestFirst.map((entry, index) => (
          <li className={styles.entry} key={entry + '-' + index}>
            {entry}
          </li>
        ))}
      </ol>
    </section>
  );
}