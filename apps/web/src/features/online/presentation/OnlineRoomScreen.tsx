import { loadBrowserCardCatalog } from '@souls/game-content';
import { useMemo, useState } from 'react';
import { appConfig } from '../../../app/config/runtime';
import { flattenDeckEntries } from '../../decks/application/deckValidation';
import { loadSavedDecks } from '../../decks/application/deckStorage';
import type { SavedDeck } from '../../decks/application/deckTypes';
import type { OnlineConnectionConfig, OnlineGameSession } from '../application/useOnlineGame';
import styles from './OnlineRoomScreen.module.css';

export interface OnlineRoomScreenProps {
  readonly session: OnlineGameSession;
  readonly onConnected: (config: OnlineConnectionConfig) => void;
  readonly onBack: () => void;
}

function participantLabel(playerId: 1 | 2, selfPlayerId: 1 | 2): string {
  return playerId === selfPlayerId ? 'TU' : 'ADVERSÁRIO';
}

export function OnlineRoomScreen({ session, onConnected, onBack }: OnlineRoomScreenProps) {
  const [joinCode, setJoinCode] = useState('');
  const [pending, setPending] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [selectedDeckId, setSelectedDeckId] = useState('');
  const catalog = useMemo(() => loadBrowserCardCatalog(), []);
  const decks = useMemo(() => loadSavedDecks(catalog), [catalog]);
  const effectiveDeckId = selectedDeckId || decks[0]?.id || '';
  const selectedDeck = decks.find((deck) => deck.id === effectiveDeckId);
  const self = session.room?.participants.find((participant) => participant.playerId === session.room?.selfPlayerId);

  async function createRoom() {
    setPending(true);
    setLocalError(null);
    try {
      const response = await fetch(`${appConfig.apiBaseUrl}/online/rooms`, { method: 'POST' });
      const payload = await response.json() as { room?: { roomId: string }; sessionToken?: string; error?: { message?: string } };
      if (!response.ok || payload.room === undefined || payload.sessionToken === undefined) {
        throw new Error(payload.error?.message ?? 'Não foi possível criar a sala.');
      }
      onConnected({ roomId: payload.room.roomId, sessionToken: payload.sessionToken });
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'Não foi possível criar a sala.');
    } finally {
      setPending(false);
    }
  }

  async function joinRoom() {
    setPending(true);
    setLocalError(null);
    try {
      const response = await fetch(`${appConfig.apiBaseUrl}/online/rooms/join`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ roomCode: joinCode.trim().toUpperCase() })
      });
      const payload = await response.json() as { room?: { roomId: string }; sessionToken?: string; error?: { message?: string } };
      if (!response.ok || payload.room === undefined || payload.sessionToken === undefined) {
        throw new Error(payload.error?.message ?? 'Não foi possível entrar na sala.');
      }
      onConnected({ roomId: payload.room.roomId, sessionToken: payload.sessionToken });
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'Não foi possível entrar na sala.');
    } finally {
      setPending(false);
    }
  }

  function leave() {
    session.commands.reset();
    onBack();
  }

  if (session.room === null) {
    return (
      <main className={styles.screen} data-testid="online-room-screen" aria-label="PvP Online">
        <div className={styles.backdrop} aria-hidden="true" />
        <section className={styles.panel}>
          <p className={styles.eyebrow}>SOULS · PVP ONLINE</p>
          <h1>SALA PRIVADA</h1>
          <p className={styles.subtitle}>Enfrenta outro jogador através de uma ligação autoritativa e de um código de convite.</p>
          <div className={styles.actions}>
            <button className={styles.primary} type="button" disabled={pending} onClick={createRoom}>CRIAR SALA</button>
          </div>
          <div className={styles.joinBox}>
            <label htmlFor="online-room-code">INTRODUZ O CÓDIGO DA SALA</label>
            <input
              id="online-room-code"
              value={joinCode}
              maxLength={6}
              onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
              placeholder="AB7K2Q"
              autoComplete="off"
            />
            <button type="button" disabled={pending || joinCode.trim().length !== 6} onClick={joinRoom}>ENTRAR</button>
          </div>
          {localError === null ? null : <p className={styles.error} role="alert">{localError}</p>}
          <button className={styles.back} type="button" onClick={onBack}>VOLTAR</button>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.screen} data-testid="online-lobby-screen" aria-label="Lobby PvP Online">
      <div className={styles.backdrop} aria-hidden="true" />
      <section className={styles.panel}>
        <p className={styles.eyebrow}>SOULS · SALA PRIVADA</p>
        <h1>{session.room.roomCode}</h1>
        <p className={styles.subtitle}>Partilha este código apenas com o teu adversário.</p>

        <div className={styles.participants}>
          {session.room.participants.map((participant) => (
            <div className={styles.participant} key={participant.playerId}>
              <span>{participantLabel(participant.playerId, session.room!.selfPlayerId)}</span>
              <strong>{participant.connected ? 'LIGADO' : 'A AGUARDAR'}</strong>
              <small>{participant.deckSelected ? 'BARALHO SELECIONADO' : 'A ESCOLHER BARALHO'} · {participant.ready ? 'PREPARADO' : 'NÃO PREPARADO'}</small>
            </div>
          ))}
        </div>

        {session.room.phase === 'lobby' ? (
          <>
            <label className={styles.deckLabel} htmlFor="online-deck">O TEU BARALHO</label>
            <select id="online-deck" value={effectiveDeckId} onChange={(event) => setSelectedDeckId(event.target.value)}>
              {decks.map((deck: SavedDeck) => <option key={deck.id} value={deck.id}>{deck.name}</option>)}
            </select>
            <div className={styles.deckSummary}>
              {selectedDeck === undefined
                ? 'Seleciona um baralho oficial válido.'
                : `${selectedDeck.name} · ${selectedDeck.cards.reduce((total, entry) => total + entry.quantity, 0)} cartas · distribuição 10/4/3/2/1`}
            </div>
            <div className={styles.actions}>
              <button
                type="button"
                disabled={selectedDeck === undefined || session.connectionState !== 'connected'}
                onClick={() => {
                  if (selectedDeck !== undefined) session.selectDeck(flattenDeckEntries(selectedDeck.cards));
                }}
              >
                {self?.deckSelected ? 'ALTERAR BARALHO' : 'SELECIONAR BARALHO'}
              </button>
              <button
                className={styles.primary}
                type="button"
                disabled={!self?.deckSelected || session.connectionState !== 'connected'}
                onClick={() => session.setReady(!self?.ready)}
              >
                {self?.ready ? 'CANCELAR PREPARAÇÃO' : 'PREPARADO'}
              </button>
            </div>
          </>
        ) : (
          <p className={styles.waiting} role="status">A sincronizar a partida…</p>
        )}

        <p className={styles.status} role="status">{session.message}</p>
        <button className={styles.back} type="button" onClick={leave}>SAIR DA SALA</button>
      </section>
    </main>
  );
}
