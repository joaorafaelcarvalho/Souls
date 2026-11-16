import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CoinTossAnimation, COIN_TOSS_DURATION_MS, COIN_TOSS_REVEAL_DELAY_MS } from './CoinTossAnimation';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('CoinTossAnimation', () => {
  it('reveals the official player two result without generating a result itself', () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();

    render(<CoinTossAnimation firstPlayerId={2} onComplete={onComplete} onSkip={vi.fn()} />);

    expect(screen.getByTestId('coin-toss-animation')).toHaveTextContent('QUEM COMEÇA O DUELO?');
    expect(screen.getByTestId('coin-toss-animation')).toHaveTextContent('Jogador 2 começa');
    expect(screen.getByTestId('coin-toss-animation').querySelectorAll('img')).toHaveLength(1);
    expect(screen.getByTestId('coin-toss-animation').querySelector('img[src$="souls_coin_player_two_animada.webp"]')).not.toBeNull();
    expect(onComplete).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(COIN_TOSS_REVEAL_DELAY_MS - 1));
    expect(onComplete).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByTestId('coin-toss-animation')).toHaveTextContent('Jogador 2 começa');

    act(() => vi.advanceTimersByTime(COIN_TOSS_DURATION_MS - COIN_TOSS_REVEAL_DELAY_MS));
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('skips the presentation without changing the supplied result', () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    const onSkip = vi.fn();

    render(<CoinTossAnimation firstPlayerId={1} onComplete={onComplete} onSkip={onSkip} />);
    expect(screen.getByTestId('coin-toss-animation').querySelector('img[src$="souls_coin_player_one_animada.webp"]')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Saltar' }));

    expect(onSkip).toHaveBeenCalledOnce();
    expect(onComplete).not.toHaveBeenCalled();
  });
});
