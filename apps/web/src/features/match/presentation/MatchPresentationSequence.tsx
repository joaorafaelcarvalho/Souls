import type { PlayerId, TurnPhase } from '@souls/game-core';
import { useEffect, useRef, useState } from 'react';
import { CoinTossAnimation } from './CoinTossAnimation';
import { TurnAnnouncement } from './TurnAnnouncement';
import { TURN_DRAW_ANIMATION_DURATION_MS, TurnHandoffOverlay } from './TurnHandoffOverlay';

type SequencePhase = 'coin-toss' | 'handoff' | 'draw' | 'announcement' | 'idle';

export interface MatchPresentationSequenceProps {
  readonly firstPlayerId: PlayerId;
  readonly activePlayerId: PlayerId;
  readonly turnPhase: TurnPhase;
  readonly status: 'active' | 'finished';
  readonly isResourceAnimating: boolean;
  readonly viewerPlayerId?: PlayerId;
  readonly onResolveDraw: () => void;
  readonly onPresentationReady?: (ready: boolean) => void;
}

function handoffPhaseFor(turnPhase: TurnPhase): 'handoff' | 'draw' {
  return turnPhase === 'draw' ? 'draw' : 'handoff';
}

/**
 * Shared visual coordinator for local and online sessions. It observes
 * official state changes, but never changes them and never decides which
 * player starts.
 */
export function MatchPresentationSequence({
  firstPlayerId,
  activePlayerId,
  turnPhase,
  status,
  isResourceAnimating,
  viewerPlayerId,
  onResolveDraw,
  onPresentationReady
}: MatchPresentationSequenceProps) {
  const [phase, setPhase] = useState<SequencePhase>('coin-toss');
  const [targetPlayerId, setTargetPlayerId] = useState<PlayerId>(firstPlayerId);
  const [drawStarted, setDrawStarted] = useState(false);
  const [drawAnimationComplete, setDrawAnimationComplete] = useState(false);
  const announcedPlayerRef = useRef(activePlayerId);
  const canResolveDraw = viewerPlayerId === undefined || viewerPlayerId === activePlayerId;

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
    setDrawStarted(false);
    setDrawAnimationComplete(false);
    setPhase(handoffPhaseFor(turnPhase));
  }, [activePlayerId, onPresentationReady, phase, status, turnPhase]);

  useEffect(() => {
    if (phase === 'draw' && !canResolveDraw && turnPhase !== 'draw') {
      setPhase('idle');
    }
  }, [canResolveDraw, phase, turnPhase]);

  useEffect(() => {
    if (phase !== 'draw' || !drawStarted) {
      return;
    }

    const isReduced = typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = isReduced ? 180 : TURN_DRAW_ANIMATION_DURATION_MS;
    const timer = window.setTimeout(() => setDrawAnimationComplete(true), duration);

    return () => window.clearTimeout(timer);
  }, [drawStarted, phase, targetPlayerId]);

  useEffect(() => {
    if (
      phase !== 'draw'
      || !drawStarted
      || !drawAnimationComplete
      || isResourceAnimating
      || turnPhase !== 'positioning'
    ) {
      return;
    }

    setPhase('idle');
  }, [drawAnimationComplete, drawStarted, isResourceAnimating, phase, turnPhase]);

  function startDraw() {
    if (drawStarted || !canResolveDraw) {
      return;
    }

    setDrawStarted(true);
    onResolveDraw();
  }

  function showInitialHandoff() {
    setTargetPlayerId(firstPlayerId);
    setDrawStarted(false);
    setDrawAnimationComplete(false);
    setPhase(handoffPhaseFor(turnPhase));
  }

  if (status === 'finished') {
    return null;
  }

  if (phase === 'coin-toss') {
    return (
      <CoinTossAnimation
        firstPlayerId={firstPlayerId}
        onComplete={showInitialHandoff}
        onSkip={showInitialHandoff}
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

  if (phase === 'draw') {
    return (
      <TurnHandoffOverlay
        playerId={targetPlayerId}
        mode="draw"
        drawStarted={drawStarted}
        canDraw={canResolveDraw}
        onDraw={startDraw}
      />
    );
  }

  if (phase === 'announcement') {
    return <TurnAnnouncement playerId={targetPlayerId} onComplete={() => setPhase('idle')} />;
  }

  return null;
}
