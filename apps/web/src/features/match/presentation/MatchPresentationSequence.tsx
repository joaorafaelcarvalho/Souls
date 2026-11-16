import type { PlayerId } from '@souls/game-core';
import { useEffect, useRef, useState } from 'react';
import { CoinTossAnimation } from './CoinTossAnimation';
import { TurnAnnouncement } from './TurnAnnouncement';
import { TurnHandoffOverlay } from './TurnHandoffOverlay';

type SequencePhase = 'coin-toss' | 'handoff' | 'announcement' | 'idle';

export interface MatchPresentationSequenceProps {
  readonly firstPlayerId: PlayerId;
  readonly activePlayerId: PlayerId;
  readonly status: 'active' | 'finished';
  readonly onPresentationReady?: (ready: boolean) => void;
}

/**
 * Local-only visual coordinator. It observes official state changes, but never
 * changes them and never decides which player starts.
 */
export function MatchPresentationSequence({ firstPlayerId, activePlayerId, status, onPresentationReady }: MatchPresentationSequenceProps) {
  const [phase, setPhase] = useState<SequencePhase>('coin-toss');
  const [targetPlayerId, setTargetPlayerId] = useState<PlayerId>(firstPlayerId);
  const announcedPlayerRef = useRef(activePlayerId);

  useEffect(() => {
    onPresentationReady?.(status === 'finished' || phase === 'idle');
  }, [onPresentationReady, phase, status]);

  useEffect(() => {
    if (status !== 'active' || phase !== 'idle' || announcedPlayerRef.current === activePlayerId) {
      return;
    }

    announcedPlayerRef.current = activePlayerId;
    onPresentationReady?.(false);
    setTargetPlayerId(activePlayerId);
    setPhase('handoff');
  }, [activePlayerId, onPresentationReady, phase, status]);

  if (status === 'finished') {
    return null;
  }

  if (phase === 'coin-toss') {
    return (
      <CoinTossAnimation
        firstPlayerId={firstPlayerId}
        onComplete={() => {
          setTargetPlayerId(firstPlayerId);
          setPhase('handoff');
        }}
        onSkip={() => {
          setTargetPlayerId(firstPlayerId);
          setPhase('handoff');
        }}
      />
    );
  }

  if (phase === 'handoff') {
    return (
      <TurnHandoffOverlay
        playerId={targetPlayerId}
        onContinue={() => setPhase('announcement')}
      />
    );
  }

  if (phase === 'announcement') {
    return <TurnAnnouncement playerId={targetPlayerId} onComplete={() => setPhase('idle')} />;
  }

  return null;
}
