import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { CardInspectionDialog } from './CardInspectionDialog';

afterEach(() => {
  cleanup();
  Reflect.deleteProperty(window, 'matchMedia');
});

const definition = {
  id: '0b4e6d2a-1f83-4c57-8a90-2d6f1b3e4a75',
  name: 'Cavaleiro',
  level: 0 as const,
  type: 'melee' as const,
  attack: 500,
  defense: 500,
  image: '/images/cards/melee/cavaleiro.png'
};

function enableCompactViewport() {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: () => ({
      matches: true,
      media: '(max-width: 64rem)',
      addEventListener: () => undefined,
      removeEventListener: () => undefined
    })
  });
}

describe('CardInspectionDialog', () => {
  it('shows catalogued attributes and keeps placement explicit', async () => {
    enableCompactViewport();
    const onPlace = () => undefined;
    render(
      <CardInspectionDialog
        open
        definition={definition}
        source="hand"
        canPlace
        canRetire={false}
        showRetireAction={false}
        retirementLabel="Retirar carta"
        onClose={() => undefined}
        onPlace={onPlace}
        onRetire={() => undefined}
      />
    );

    expect(await screen.findByRole('dialog')).toHaveTextContent('Categoria');
    expect(screen.getByRole('dialog')).toHaveTextContent('Corpo a corpo (melee)');
    expect(screen.getByRole('dialog')).not.toHaveTextContent('Descrição');
    expect(screen.getByRole('dialog')).not.toHaveTextContent('História');
    expect(screen.getByRole('button', { name: 'Colocar carta' })).toBeEnabled();
  });

  it('disables placement when the official adapter reports no valid cell', async () => {
    enableCompactViewport();
    render(
      <CardInspectionDialog
        open
        definition={definition}
        source="hand"
        canPlace={false}
        canRetire={false}
        showRetireAction={false}
        retirementLabel="Retirar carta"
        onClose={() => undefined}
        onPlace={() => undefined}
        onRetire={() => undefined}
      />
    );

    await waitFor(() => expect(screen.getByRole('button', { name: 'Colocar carta' })).toBeDisabled());
    expect(screen.getByRole('dialog')).toHaveTextContent('sem uma casa válida');
  });

  it('exposes Soul Harvest only for the owned board-card action', async () => {
    enableCompactViewport();
    const onRetire = () => undefined;
    render(
      <CardInspectionDialog
        open
        definition={definition}
        source="board"
        canPlace={false}
        canRetire
        showRetireAction
        retirementLabel="Retirar carta · +1 Soul"
        onClose={() => undefined}
        onPlace={() => undefined}
        onRetire={onRetire}
      />
    );

    expect(await screen.findByRole('button', { name: /Retirar carta/ })).toBeEnabled();
    fireEvent.click(screen.getByRole('button', { name: /Retirar carta/ }));
  });
});
