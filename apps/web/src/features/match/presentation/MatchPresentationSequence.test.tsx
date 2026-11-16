import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MatchPresentationSequence } from './MatchPresentationSequence';
import { TURN_ANNOUNCEMENT_DURATION_MS } from './TurnAnnouncement';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('MatchPresentationSequence', () => {
  it('coordinates coin toss, local handoff and turn announcement without changing state', () => {
    vi.useFakeTimers();

    const { rerender } = render(
      <MatchPresentationSequence firstPlayerId={1} activePlayerId={1} status="active" />
    );

    expect(screen.getByTestId('coin-toss-animation')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Saltar' }));
    expect(screen.getByTestId('turn-handoff-overlay')).toHaveTextContent('Jogador 1');

    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    expect(screen.getByTestId('turn-announcement')).toHaveTextContent('VEZ DO JOGADOR 1');

    act(() => vi.advanceTimersByTime(TURN_ANNOUNCEMENT_DURATION_MS));
    expect(screen.queryByTestId('turn-announcement')).not.toBeInTheDocument();

    rerender(<MatchPresentationSequence firstPlayerId={1} activePlayerId={2} status="active" />);
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
        status="active"
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
        status="active"
        onPresentationReady={(ready) => readiness.push(ready)}
      />
    );
    expect(readiness.at(-1)).toBe(false);
  });

  it('gives the final result priority over visual sequences', () => {
    render(<MatchPresentationSequence firstPlayerId={1} activePlayerId={1} status="finished" />);

    expect(screen.queryByTestId('coin-toss-animation')).not.toBeInTheDocument();
    expect(screen.queryByTestId('turn-handoff-overlay')).not.toBeInTheDocument();
    expect(screen.queryByTestId('turn-announcement')).not.toBeInTheDocument();
  });
});
