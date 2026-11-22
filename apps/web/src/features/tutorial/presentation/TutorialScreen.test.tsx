import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TutorialScreen } from './TutorialScreen';

afterEach(cleanup);

describe('TutorialScreen', () => {
  it('starts with a dedicated welcome screen and enters the real guided board', () => {
    const onExit = vi.fn();
    const onPlayNow = vi.fn();

    render(<TutorialScreen onExit={onExit} onPlayNow={onPlayNow} />);

    expect(screen.getByTestId('tutorial-intro')).toHaveTextContent('BEM-VINDO AO SOULS');
    fireEvent.click(screen.getByRole('button', { name: 'COMEÇAR TUTORIAL' }));

    expect(screen.getByTestId('tutorial-screen')).toBeInTheDocument();
    expect(screen.getByTestId('tutorial-instructions')).toHaveTextContent('Conhece o tabuleiro');
    expect(screen.getByTestId('game-board')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'DEFESA' })).toBeInTheDocument();
  });

  it('keeps the tutorial hand in an independent overlay control', () => {
    render(<TutorialScreen onExit={vi.fn()} onPlayNow={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'COMEÇAR TUTORIAL' }));

    const handToggle = screen.getByRole('button', { name: 'Abrir mão do tutorial' });
    expect(handToggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(handToggle);

    expect(screen.getAllByRole('button', { name: 'Fechar mão do tutorial' }).some((button) => button.getAttribute('aria-expanded') === 'true')).toBe(true);
    expect(screen.getByTestId('game-board')).toBeInTheDocument();
  });
});
