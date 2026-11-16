import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Card } from './Card';

afterEach(cleanup);

const definition = {
  id: '0b4e6d2a-1f83-4c57-8a90-2d6f1b3e4a75',
  name: 'Cavaleiro',
  level: 0 as const,
  type: 'melee' as const,
  attack: 500,
  defense: 500,
  image: '/images/cards/melee/cavaleiro.png'
};

describe('Card', () => {
  it('renders the compact card data in both variants', () => {
    const { rerender } = render(<Card definition={definition} variant="hand" />);

    const handCard = screen.getByTestId('card-variant-hand');
    expect(handCard).toHaveTextContent('Cavaleiro');
    expect(handCard).toHaveTextContent('500');
    expect(handCard).toHaveTextContent('0');
    expect(screen.getByRole('img', { name: 'Cavaleiro' })).toHaveAttribute('src', definition.image);

    rerender(<Card definition={definition} variant="board" />);
    expect(screen.getByTestId('card-variant-board')).toBeInTheDocument();
  });

  it('shows an explicit fallback when the image fails', () => {
    render(<Card definition={definition} variant="hand" />);

    fireEvent.error(screen.getAllByRole('img', { name: 'Cavaleiro' })[0]!);

    expect(screen.getByRole('img', { name: 'Cavaleiro: imagem indisponível' })).toBeInTheDocument();
    expect(screen.getByText('Imagem indisponível')).toBeInTheDocument();
  });
});