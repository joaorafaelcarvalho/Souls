import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CodexPage } from './CodexPage';

afterEach(cleanup);

describe('CodexPage', () => {
  it('loads official cards and filters them by search', () => {
    render(<CodexPage onBack={vi.fn()} />);

    expect(screen.getByTestId('codex-page')).toHaveTextContent('26 de 26 almas encontradas');
    fireEvent.change(screen.getByPlaceholderText('Nome da carta...'), { target: { value: 'mago' } });

    expect(screen.getByTestId('codex-page')).toHaveTextContent('2 de 26 almas encontradas');
    expect(screen.getByRole('button', { name: 'Selecionar Mago' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Selecionar Cavaleiro' })).not.toBeInTheDocument();
  });

  it('updates the details panel when a different official card is selected', () => {
    render(<CodexPage onBack={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Selecionar Cavaleiro Negro' }));

    expect(screen.getByRole('complementary', { name: 'Detalhes da carta selecionada' })).toHaveTextContent('Cavaleiro Negro');
    expect(screen.getByRole('complementary', { name: 'Detalhes da carta selecionada' })).toHaveTextContent('700');
  });

  it('opens the faction section and presents its associated cards', () => {
    render(<CodexPage onBack={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'FACÇÕES' }));
    expect(screen.getByRole('button', { name: /Ordem da Última Vigília/ })).toBeInTheDocument();
    expect(screen.getByText('CARTAS ASSOCIADAS · 7')).toBeInTheDocument();
    expect(screen.getByText('Enquanto a última chama arder, permaneceremos.')).toBeInTheDocument();
  });
});
