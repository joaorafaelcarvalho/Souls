import { loadBrowserCardCatalog } from '@souls/game-content';
import type { AiDifficulty } from '@souls/game-ai';
import { useMemo, useState } from 'react';
import { flattenDeckEntries, validateSavedDeck } from '../../decks/application/deckValidation';
import { createPrototypeDeck, loadSavedDecks } from '../../decks/application/deckStorage';
import type { PlayerDeckPair, SavedDeck } from '../../decks/application/deckTypes';
import styles from '../../decks/presentation/DeckPreparationScreen.module.css';

export interface PvePreparationScreenProps {
  readonly onBack: () => void;
  readonly onOpenBuilder: () => void;
  readonly onStart: (decks: PlayerDeckPair, difficulty: AiDifficulty) => void;
}

const difficultyCopy: Readonly<Record<AiDifficulty, { readonly title: string; readonly description: string }>> = {
  easy: { title: 'FÁCIL · APRENDIZ', description: 'Escolhe ações legais simples, com alguma variabilidade e foco nas oportunidades evidentes.' },
  normal: { title: 'NORMAL · GUERREIRO', description: 'Avalia ataque, defesa, Souls, colunas vulneráveis e progressão de cartas.' },
  hard: { title: 'DIFÍCIL · SENHOR DAS ALMAS', description: 'Compara ameaças, pressão imediata e preparação de invocações com avaliação mais exigente.' }
};

function DeckChoice({ decks, selectedId, onChange }: {
  readonly decks: readonly SavedDeck[];
  readonly selectedId: string;
  readonly onChange: (id: string) => void;
}) {
  const selected = decks.find((deck) => deck.id === selectedId);
  return (
    <section className={styles.choice}>
      <div className={styles.choiceHeader}>
        <span>BARALHO DO JOGADOR</span>
        <strong>{selected?.name ?? 'Seleciona um baralho'}</strong>
      </div>
      <select aria-label="BARALHO DO JOGADOR" value={selectedId} onChange={(event) => onChange(event.target.value)}>
        {decks.map((deck) => <option key={deck.id} value={deck.id}>{deck.name}</option>)}
      </select>
      <div className={styles.deckPreview}>
        {selected?.cards.slice(0, 5).map((entry) => <span key={entry.cardDefinitionId}>×{entry.quantity}</span>)}
        <small>{selected?.cards.reduce((total, entry) => total + entry.quantity, 0) ?? 0} cartas · distribuição oficial 10/4/3/2/1</small>
      </div>
    </section>
  );
}

export function PvePreparationScreen({ onBack, onOpenBuilder, onStart }: PvePreparationScreenProps) {
  const catalog = useMemo(() => loadBrowserCardCatalog(), []);
  const decks = useMemo(() => loadSavedDecks(catalog), [catalog]);
  const aiDeck = useMemo(() => createPrototypeDeck(catalog), [catalog]);
  const firstDeckId = decks[0]?.id ?? '';
  const [selectedDeckId, setSelectedDeckId] = useState(firstDeckId);
  const [difficulty, setDifficulty] = useState<AiDifficulty>('normal');
  const selectedDeck = decks.find((deck) => deck.id === selectedDeckId);
  const validation = selectedDeck === undefined ? null : validateSavedDeck(selectedDeck, catalog);
  const valid = validation?.valid === true;

  return (
    <main className={styles.screen} data-testid="pve-preparation-screen" aria-label="Preparação Jogador vs IA">
      <div className={styles.backdrop} aria-hidden="true" />
      <section className={styles.panel}>
        <p className={styles.eyebrow}>SOULS · JOGADOR VS IA</p>
        <h1>PREPARA O DUELO</h1>
        <p className={styles.subtitle}>Escolhe um baralho válido e enfrenta um adversário que respeita as mesmas regras.</p>

        <div className={styles.choices}>
          <DeckChoice decks={decks} selectedId={selectedDeckId} onChange={setSelectedDeckId} />
          <section className={styles.choice}>
            <div className={styles.choiceHeader}>
              <span>BARALHO DA IA</span>
              <strong>{aiDeck.name}</strong>
            </div>
            <p className={styles.subtitle}>Baralho equilibrado oficial · 20 cartas · N0 10 / N1 4 / N2 3 / N3 2 / N4 1</p>
          </section>
        </div>

        <div className={styles.choice} aria-label="Dificuldade da IA">
          <div className={styles.choiceHeader}>
            <span>DIFICULDADE</span>
            <strong>{difficultyCopy[difficulty].title}</strong>
          </div>
          <div className={styles.actions}>
            {(['easy', 'normal', 'hard'] as const).map((level) => (
              <button
                key={level}
                type="button"
                aria-pressed={difficulty === level}
                onClick={() => setDifficulty(level)}
              >
                {difficultyCopy[level].title}
              </button>
            ))}
          </div>
          <p className={styles.subtitle}>{difficultyCopy[difficulty].description}</p>
        </div>

        {!valid ? (
          <div className={styles.privacy} role="status">
            <span aria-hidden="true">!</span>
            <p>{validation?.errors.slice(0, 3).join(' ') ?? 'Cria ou seleciona um baralho válido no Deck Builder.'}</p>
          </div>
        ) : null}

        <div className={styles.actions}>
          <button type="button" onClick={onOpenBuilder}>EDITAR BARALHOS</button>
          <button type="button" onClick={onBack}>VOLTAR</button>
          <button
            className={styles.primary}
            type="button"
            disabled={!valid || selectedDeck === undefined}
            onClick={() => {
              if (selectedDeck !== undefined && valid) onStart([flattenDeckEntries(selectedDeck.cards), flattenDeckEntries(aiDeck.cards)], difficulty);
            }}
          >
            INICIAR JOGADOR VS IA
          </button>
        </div>
      </section>
    </main>
  );
}
