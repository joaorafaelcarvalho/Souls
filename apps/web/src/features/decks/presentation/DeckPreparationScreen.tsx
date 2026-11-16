import { loadBrowserCardCatalog } from '@souls/game-content';
import { useMemo, useState } from 'react';
import { flattenDeckEntries, validateSavedDeck } from '../application/deckValidation';
import { loadSavedDecks } from '../application/deckStorage';
import type { PlayerDeckPair, SavedDeck } from '../application/deckTypes';
import styles from './DeckPreparationScreen.module.css';

export interface DeckPreparationScreenProps {
  readonly onBack: () => void;
  readonly onOpenBuilder: () => void;
  readonly onStart: (decks: PlayerDeckPair) => void;
}

function DeckChoice({ label, decks, selectedId, onChange }: {
  readonly label: string;
  readonly decks: readonly SavedDeck[];
  readonly selectedId: string;
  readonly onChange: (id: string) => void;
}) {
  const selected = decks.find((deck) => deck.id === selectedId);
  return (
    <section className={styles.choice}>
      <div className={styles.choiceHeader}>
        <span>{label}</span>
        <strong>{selected?.name ?? 'Seleciona um baralho'}</strong>
      </div>
      <select aria-label={label} value={selectedId} onChange={(event) => onChange(event.target.value)}>
        {decks.map((deck) => <option key={deck.id} value={deck.id}>{deck.name}</option>)}
      </select>
      <div className={styles.deckPreview}>
        {selected?.cards.slice(0, 5).map((entry) => <span key={entry.cardDefinitionId}>×{entry.quantity}</span>)}
        <small>{selected?.cards.length ?? 0} definições · {selected?.cards.reduce((total, entry) => total + entry.quantity, 0) ?? 0} cartas</small>
      </div>
    </section>
  );
}

export function DeckPreparationScreen({ onBack, onOpenBuilder, onStart }: DeckPreparationScreenProps) {
  const catalog = useMemo(() => loadBrowserCardCatalog(), []);
  const decks = useMemo(() => loadSavedDecks(catalog), [catalog]);
  const firstDeckId = decks[0]?.id ?? '';
  const [playerOneDeckId, setPlayerOneDeckId] = useState(firstDeckId);
  const [playerTwoDeckId, setPlayerTwoDeckId] = useState(firstDeckId);
  const playerOneDeck = decks.find((deck) => deck.id === playerOneDeckId);
  const playerTwoDeck = decks.find((deck) => deck.id === playerTwoDeckId);
  const playerOneValidation = playerOneDeck === undefined ? null : validateSavedDeck(playerOneDeck, catalog);
  const playerTwoValidation = playerTwoDeck === undefined ? null : validateSavedDeck(playerTwoDeck, catalog);
  const valid = playerOneValidation?.valid === true && playerTwoValidation?.valid === true;

  function start() {
    if (!valid || playerOneDeck === undefined || playerTwoDeck === undefined) return;
    onStart([flattenDeckEntries(playerOneDeck.cards), flattenDeckEntries(playerTwoDeck.cards)]);
  }

  return (
    <main className={styles.screen} data-testid="deck-preparation-screen" aria-label="Preparação da partida local">
      <div className={styles.backdrop} aria-hidden="true" />
      <section className={styles.panel}>
        <p className={styles.eyebrow}>SOULS · PREPARAÇÃO DO DUELO</p>
        <h1>ESCOLHE OS BARALHOS</h1>
        <p className={styles.subtitle}>Cada jogador pode escolher uma composição guardada antes de entrar no campo de batalha.</p>

        <div className={styles.choices}>
          <DeckChoice label="BARALHO DO JOGADOR 1" decks={decks} selectedId={playerOneDeckId} onChange={setPlayerOneDeckId} />
          <DeckChoice label="BARALHO DO JOGADOR 2" decks={decks} selectedId={playerTwoDeckId} onChange={setPlayerTwoDeckId} />
        </div>

        <div className={styles.privacy}>
          <span aria-hidden="true">◈</span>
          <p>No PvP Local, confirma a escolha de cada jogador sem revelar a composição durante a partida.</p>
        </div>

        {!valid ? (
          <div className={styles.privacy} role="status">
            <span aria-hidden="true">!</span>
            <p>
              {playerOneValidation?.errors.concat(playerTwoValidation?.errors ?? []).slice(0, 3).join(' ') ?? 'Seleciona dois baralhos válidos.'}
            </p>
          </div>
        ) : null}

        <div className={styles.actions}>
          <button type="button" onClick={onOpenBuilder}>EDITAR BARALHOS</button>
          <button type="button" onClick={onBack}>VOLTAR</button>
          <button className={styles.primary} type="button" disabled={!valid} onClick={start}>INICIAR PARTIDA</button>
        </div>
      </section>
    </main>
  );
}
