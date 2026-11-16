import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DeckBuilderPage } from './DeckBuilderPage';

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe('DeckBuilderPage', () => {
  it('loads the official catalog and creates an editable draft', () => {
    render(<DeckBuilderPage onBack={vi.fn()} onOpenDeckSelection={vi.fn()} />);

    expect(screen.getByTestId('deck-builder-page')).toHaveTextContent('26 ALMAS');
    fireEvent.click(screen.getByRole('button', { name: 'NOVO' }));
    expect(screen.getByRole('textbox', { name: 'Nome do baralho' })).toHaveValue('Novo Baralho 2');
    expect(screen.getByText('0 / 20 CARTAS')).toBeInTheDocument();
  });

  it('adds a card by official definition and updates the composition', () => {
    render(<DeckBuilderPage onBack={vi.fn()} onOpenDeckSelection={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'NOVO' }));
    fireEvent.click(screen.getByRole('button', { name: 'Inspecionar Cavaleiro' }));
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar Cavaleiro' }));

    expect(screen.getByText('1 / 20 CARTAS')).toBeInTheDocument();
    expect(screen.getByText(/1 definições distintas/)).toBeInTheDocument();
  });
});
