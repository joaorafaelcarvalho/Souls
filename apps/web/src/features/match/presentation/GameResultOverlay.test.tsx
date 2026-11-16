import { createDemoGame } from '../../../mocks/match';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createAuthorizedGameView } from '../application/authorizedGameView';
import { GameResultOverlay } from './GameResultOverlay';

afterEach(cleanup);

describe('GameResultOverlay', () => {
  it('shows the real winner summary and supports a rematch', () => {
    const initial = createDemoGame();
    const state = {
      ...initial,
      status: 'finished' as const,
      winnerId: 1 as const,
      players: {
        ...initial.players,
        1: { ...initial.players[1], hp: 7_500, souls: 2 },
        2: { ...initial.players[2], hp: 0, souls: 1 }
      },
      turn: { ...initial.turn, round: 3 }
    };
    const onRematch = vi.fn();
    const onMenu = vi.fn();

    render(<GameResultOverlay view={createAuthorizedGameView(state, 1)} onRematch={onRematch} onMenu={onMenu} />);

    expect(screen.getByTestId('game-result-overlay')).toHaveTextContent('VITÓRIA');
    expect(screen.getByTestId('game-result-overlay')).toHaveTextContent('Jogador 1');
    expect(screen.getByTestId('game-result-overlay')).toHaveTextContent(/7500/);
    expect(screen.getByTestId('game-result-overlay')).toHaveTextContent('3');

    fireEvent.click(screen.getByRole('button', { name: 'Revanche' }));
    expect(onRematch).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('button', { name: 'Menu Principal' }));
    expect(onMenu).toHaveBeenCalledOnce();
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('does not render before the official game-over state exists', () => {
    const state = createDemoGame();

    render(<GameResultOverlay view={createAuthorizedGameView(state, 1)} onRematch={vi.fn()} onMenu={vi.fn()} />);

    expect(screen.queryByTestId('game-result-overlay')).not.toBeInTheDocument();
  });
});
