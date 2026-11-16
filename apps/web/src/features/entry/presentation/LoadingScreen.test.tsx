import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LoadingScreen } from './LoadingScreen';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('LoadingScreen', () => {
  it('keeps the cinematic introduction for approximately two seconds and completes once', () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    render(<LoadingScreen onComplete={onComplete} />);

    expect(screen.getByRole('img', { name: 'SOULS' })).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Introdução visual do SOULS' })).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1_999));
    expect(onComplete).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});