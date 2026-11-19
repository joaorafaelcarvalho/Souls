import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { TURN_ANNOUNCEMENT_DURATION_MS } from './features/match/presentation/TurnAnnouncement';
import { TURN_DRAW_ANIMATION_DURATION_MS } from './features/match/presentation/TurnHandoffOverlay';

const fixedRandom = { next: () => 0 };

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function getHandButtons() {
  return screen
    .getAllByRole('button')
    .filter((button) => button.querySelector('[data-card-variant="hand"]'));
}

function getHandButton(name: string) {
  return getHandButtons().find((button) => button.textContent?.includes(name));
}

function renderGame() {
  vi.useFakeTimers();
  render(<App random={fixedRandom} />);
  act(() => vi.advanceTimersByTime(2_000));
  fireEvent.click(screen.getByRole('button', { name: /^JOGAR/ }));
  fireEvent.click(screen.getByRole('button', { name: /pvp local/i }));
  fireEvent.click(screen.getByRole('button', { name: 'INICIAR PARTIDA' }));
  act(() => vi.advanceTimersByTime(500));
  fireEvent.click(screen.getByRole('button', { name: 'Saltar' }));
  fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
  act(() => vi.advanceTimersByTime(TURN_ANNOUNCEMENT_DURATION_MS + 40));
}

describe('application entry and local match prototype', () => {
  it('shows the loading introduction and then enters the existing game through JOGAR', () => {
    vi.useFakeTimers();
    render(<App random={fixedRandom} />);

    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1_999));
    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByTestId('main-menu')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /códice das almas/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /configurações/i })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: /^JOGAR/ }));
    fireEvent.click(screen.getByRole('button', { name: /pvp local/i }));
    fireEvent.click(screen.getByRole('button', { name: 'INICIAR PARTIDA' }));

    act(() => vi.advanceTimersByTime(500));
  act(() => vi.advanceTimersByTime(500));

    expect(screen.queryByTestId('main-menu')).not.toBeInTheDocument();
    expect(getHandButtons()).toHaveLength(5);
  });

  it('disables invalid cells for a ranged card', () => {
    renderGame();

    fireEvent.click(getHandButton('Arqueiro')!);

    expect(screen.getByTestId('board-cell-3,0')).toBeDisabled();
    expect(screen.getByTestId('board-cell-4,0')).toBeDisabled();
    expect(screen.getByTestId('board-cell-5,0')).not.toBeDisabled();
  });

  it('lets the active player select a melee card and place it on the board', () => {
    renderGame();

    const meleeCard = getHandButton('Cavaleiro')!;
    fireEvent.click(meleeCard);
    fireEvent.click(screen.getByTestId('board-cell-3,0'));

    const boardCell = screen.getByTestId('board-cell-3,0');

    expect(screen.getByRole('status')).toHaveTextContent('Carta colocada no tabuleiro.');
    expect(screen.getByRole('region', { name: 'Histórico da partida' })).toHaveTextContent('Jogador 1 invocou Cavaleiro.');
    expect(boardCell).toHaveTextContent('Cavaleiro');
    expect(boardCell).toHaveTextContent('500');
    expect(boardCell).toHaveTextContent('0');
    expect(getHandButtons()).toHaveLength(4);
    expect(getHandButtons()).not.toContain(meleeCard);
  });

  it('keeps own board cards selectable for Soul Harvest after selecting a hand card', () => {
    renderGame();

    fireEvent.click(getHandButton('Defensor')!);
    fireEvent.click(screen.getByTestId('board-cell-3,0'));
    fireEvent.click(screen.getByRole('button', { name: /terminar posicionamento/i }));

    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    act(() => vi.advanceTimersByTime(TURN_ANNOUNCEMENT_DURATION_MS));

    fireEvent.click(getHandButton('Cavaleiro')!);
    fireEvent.click(screen.getByTestId('board-cell-1,0'));
    fireEvent.click(screen.getByRole('button', { name: /terminar posicionamento/i }));

    fireEvent.click(within(screen.getByTestId('turn-handoff-overlay')).getByRole('button', { name: 'Efetuar duas compras' }));
    act(() => vi.advanceTimersByTime(TURN_DRAW_ANIMATION_DURATION_MS));

    fireEvent.click(getHandButton('Cavaleiro')!);
    const occupiedCell = screen.getByTestId('board-cell-3,0');
    expect(occupiedCell).not.toBeDisabled();
    fireEvent.click(occupiedCell);

    expect(screen.getByRole('region', { name: 'Estado do jogador ativo' })).toHaveTextContent('Carta no campo selecionada.');
    fireEvent.click(screen.getByRole('button', { name: /retirar carta/i }));

    expect(occupiedCell).not.toHaveTextContent('Defensor');
    expect(screen.getByRole('status')).toHaveTextContent('Carta retirada: recebeste 1 Soul');
  });

  it('can confirm returning to the main menu', () => {
    renderGame();

    fireEvent.click(screen.getByRole('button', { name: 'Voltar' }));

    expect(screen.getByRole('dialog')).toHaveTextContent('Voltar ao menu principal?');
    fireEvent.click(screen.getByRole('button', { name: 'Voltar ao menu' }));
    expect(screen.getByTestId('main-menu')).toBeInTheDocument();
  });

  it('keeps the match open when returning to the menu is cancelled', () => {
    renderGame();

    fireEvent.click(screen.getByRole('button', { name: 'Voltar' }));

    expect(screen.getByRole('dialog')).toHaveTextContent('Voltar ao menu principal?');
    fireEvent.click(screen.getByRole('button', { name: 'Continuar partida' }));

    expect(screen.getByRole('region', { name: 'Área central do tabuleiro' })).toBeInTheDocument();
  });

  it('opens the rules codex without changing the match', () => {
    renderGame();

    fireEvent.click(screen.getByRole('button', { name: 'Consultar regras do jogo' }));

    expect(screen.getByRole('dialog')).toHaveTextContent('Regras do jogo');
    expect(screen.getByTestId('game-rules-dialog')).toHaveTextContent('ATK > DEF');
    expect(screen.getByTestId('game-rules-dialog')).toHaveTextContent('Atributos da carta');
    expect(screen.getByTestId('game-rules-dialog')).toHaveTextContent('DEF');
    expect(screen.getByTestId('game-rules-dialog')).toHaveTextContent('Regulamento oficial SOULS v0.7');

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the independent tutorial mode from the main menu', () => {
    vi.useFakeTimers();
    render(<App random={fixedRandom} />);
    act(() => vi.advanceTimersByTime(2_000));

    fireEvent.click(screen.getByRole('button', { name: /^JOGAR/ }));
    fireEvent.click(screen.getByRole('button', { name: /tutorial/i }));
    act(() => vi.advanceTimersByTime(500));

    expect(screen.getByTestId('tutorial-intro')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'COMEÇAR TUTORIAL' }));
    expect(screen.getByTestId('tutorial-screen')).toBeInTheDocument();
  });

  it('opens a secondary mode menu and can return to the main menu', () => {
    vi.useFakeTimers();
    render(<App random={fixedRandom} />);
    act(() => vi.advanceTimersByTime(2_000));

    fireEvent.click(screen.getByRole('button', { name: /^JOGAR/ }));
    expect(screen.getByTestId('game-mode-menu')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'VOLTAR' }));
    expect(screen.getByTestId('main-menu')).toBeInTheDocument();
  });

  it('opens the Player vs AI preparation screen and starts with a selected difficulty', () => {
    vi.useFakeTimers();
    render(<App random={fixedRandom} />);
    act(() => vi.advanceTimersByTime(2_000));

    fireEvent.click(screen.getByRole('button', { name: /^JOGAR/ }));
    fireEvent.click(screen.getByRole('button', { name: /jogador vs ia/i }));

    expect(screen.getByTestId('pve-preparation-screen')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /difícil/i }));
    expect(screen.getByRole('button', { name: /difícil/i })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: /iniciar jogador vs ia/i }));
    act(() => vi.advanceTimersByTime(500));

    expect(screen.getByRole('region', { name: 'Área central do tabuleiro' })).toBeInTheDocument();

    fireEvent.click(getHandButton('Cavaleiro')!);
    fireEvent.click(screen.getByTestId('board-cell-3,0'));
    fireEvent.click(getHandButton('Arqueiro')!);
    fireEvent.click(screen.getByTestId('board-cell-5,0'));
    fireEvent.click(screen.getByRole('button', { name: /terminar posicionamento/i }));
    act(() => vi.advanceTimersByTime(2_000));

    expect(screen.getByTestId('game-board')).toBeInTheDocument();
    expect(screen.getByRole('complementary', { name: 'Informações da ronda' })).toBeInTheDocument();
  });
});
