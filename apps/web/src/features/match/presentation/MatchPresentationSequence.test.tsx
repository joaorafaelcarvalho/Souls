import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MatchPresentationSequence } from './MatchPresentationSequence';
import { TURN_ANNOUNCEMENT_DURATION_MS } from './TurnAnnouncement';
import { TURN_DRAW_ANIMATION_DURATION_MS } from './TurnHandoffOverlay';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('MatchPresentationSequence', () => {
  it('coordinates coin toss, local handoff and turn announcement without changing state', () => {
    vi.useFakeTimers();

    const { rerender } = render(
      <MatchPresentationSequence
        firstPlayerId={1}
        activePlayerId={1}
        turnPhase="first-round-positioning"
        status="active"
        isResourceAnimating={false}
        onResolveDraw={vi.fn()}
      />
    );

    expect(screen.getByTestId('coin-toss-animation')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Saltar' }));
    expect(screen.getByTestId('turn-handoff-overlay')).toHaveTextContent('Jogador 1');

    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    expect(screen.getByTestId('turn-announcement')).toHaveTextContent('VEZ DO JOGADOR 1');

    act(() => vi.advanceTimersByTime(TURN_ANNOUNCEMENT_DURATION_MS));
    expect(screen.queryByTestId('turn-announcement')).not.toBeInTheDocument();

    rerender(
      <MatchPresentationSequence
        firstPlayerId={1}
        activePlayerId={2}
        turnPhase="first-round-positioning"
        status="active"
        isResourceAnimating={false}
        onResolveDraw={vi.fn()}
      />
    );
    expect(screen.getByTestId('turn-handoff-overlay')).toHaveTextContent('Jogador 2');

    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    expect(screen.getByTestId('turn-announcement')).toHaveTextContent('VEZ DO JOGADOR 2');
  });

  it('keeps the PvE controller blocked until the handoff and announcement finish', () => {
    vi.useFakeTimers();
    const readiness: boolean[] = [];
    const { rerender } = render(
      <MatchPresentationSequence
        firstPlayerId={1}
        activePlayerId={1}
        turnPhase="first-round-positioning"
        status="active"
        isResourceAnimating={false}
        onResolveDraw={vi.fn()}
        onPresentationReady={(ready) => readiness.push(ready)}
      />
    );

    expect(readiness.at(-1)).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: 'Saltar' }));
    expect(readiness.at(-1)).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    expect(readiness.at(-1)).toBe(false);

    act(() => vi.advanceTimersByTime(TURN_ANNOUNCEMENT_DURATION_MS));
    expect(readiness.at(-1)).toBe(true);

    rerender(
      <MatchPresentationSequence
        firstPlayerId={1}
        activePlayerId={2}
        turnPhase="first-round-positioning"
        status="active"
        isResourceAnimating={false}
        onResolveDraw={vi.fn()}
        onPresentationReady={(ready) => readiness.push(ready)}
      />
    );
    expect(readiness.at(-1)).toBe(false);
  });

  it('gives the final result priority over visual sequences', () => {
    render(
      <MatchPresentationSequence
        firstPlayerId={1}
        activePlayerId={1}
        turnPhase="first-round-positioning"
        status="finished"
        isResourceAnimating={false}
        onResolveDraw={vi.fn()}
      />
    );

    expect(screen.queryByTestId('coin-toss-animation')).not.toBeInTheDocument();
    expect(screen.queryByTestId('turn-handoff-overlay')).not.toBeInTheDocument();
    expect(screen.queryByTestId('turn-announcement')).not.toBeInTheDocument();
  });

  it('joins the active player handoff to the two required purchases', () => {
    vi.useFakeTimers();
    const onResolveDraw = vi.fn();
    const { rerender } = render(
      <MatchPresentationSequence
        firstPlayerId={1}
        activePlayerId={1}
        turnPhase="draw"
        status="active"
        isResourceAnimating={false}
        onResolveDraw={onResolveDraw}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Saltar' }));
    expect(screen.getByTestId('turn-handoff-overlay')).toHaveTextContent('Jogador 1');
    expect(screen.getByRole('button', { name: 'Efetuar duas compras' })).toBeInTheDocument();
    expect(screen.getByTestId('turn-draw-visual')).toHaveAttribute('data-animation-state', 'first-frame');

    fireEvent.click(screen.getByRole('button', { name: 'Efetuar duas compras' }));
    expect(onResolveDraw).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('turn-draw-visual')).toHaveAttribute('data-animation-state', 'playing');

    rerender(
      <MatchPresentationSequence
        firstPlayerId={1}
        activePlayerId={1}
        turnPhase="positioning"
        status="active"
        isResourceAnimating={false}
        onResolveDraw={onResolveDraw}
      />
    );
    act(() => vi.advanceTimersByTime(TURN_DRAW_ANIMATION_DURATION_MS));

    expect(screen.queryByTestId('turn-handoff-overlay')).not.toBeInTheDocument();
  });
});
