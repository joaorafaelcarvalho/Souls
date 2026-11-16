import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MainMenu } from './MainMenu';

afterEach(cleanup);

describe('MainMenu', () => {
  it('presents the official logo, enables JOGAR and keeps future features disabled', () => {
    const onOpenModes = vi.fn();
    const onCodex = vi.fn();
    render(<MainMenu onOpenModes={onOpenModes} onCodex={onCodex} />);

    expect(screen.getByRole('img', { name: 'SOULS' })).toBeInTheDocument();
    expect(screen.getByTestId('main-menu').querySelector('img[src*="souls-menu-banner"]')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^JOGAR/ })).toBeEnabled();
    expect(screen.getByRole('button', { name: /códice das almas/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /configurações/i })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: /^JOGAR/ }));
    expect(onOpenModes).toHaveBeenCalledOnce();

    fireEvent.click(screen.getByRole('button', { name: /códice das almas/i }));
    expect(onCodex).toHaveBeenCalledOnce();

    fireEvent.click(screen.getByRole('button', { name: /regras do jogo/i }));
    expect(screen.getByRole('dialog')).toHaveTextContent('Regras do jogo');
    fireEvent.click(screen.getByRole('button', { name: 'Fechar regras' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

  });
});
