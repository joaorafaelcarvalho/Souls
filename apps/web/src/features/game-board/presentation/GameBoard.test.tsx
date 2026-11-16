import { createEmptyBoard, type CardDefinition, type CardInstance } from '@souls/game-core';
import type { CombatPlaybackState } from '../../combat/application/CombatAnimationSequencer';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { GameBoard } from './GameBoard';

afterEach(cleanup);

const testDefinition: CardDefinition = {
  id: '6b5a3a87-3e1c-4d4f-9a25-0b2c1d4e5f60',
  name: 'Cavaleiro',
  level: 0,
  type: 'melee',
  attack: 500,
  defense: 500,
  image: '/images/cards/melee/cavaleiro.svg'
};

const testInstance: CardInstance = {
  instanceId: 'bcecc46e-d2cc-4978-b61b-eb4b793f990f',
  cardDefinitionId: testDefinition.id,
  ownerId: 1
};

describe('GameBoard', () => {
  it('renders the six by four board, hides technical cell labels and keeps vertical cell semantics', () => {
    render(<GameBoard board={createEmptyBoard()} />);

    expect(screen.getByTestId('game-board').children).toHaveLength(24);

    const emptyCell = screen.getByTestId('board-cell-0,0');
    expect(emptyCell).toHaveAttribute('data-cell-type', 'ranged');
    expect(emptyCell).not.toHaveTextContent(/\[0,0\]|DEF|ATK corpo a corpo|ATK longo alcance/);
    expect(screen.getByTestId('board-cell-2,0')).toHaveAttribute('data-cell-type', 'defense');
    expect(screen.getByTestId('board-cell-4,0')).toHaveAttribute('data-cell-type', 'melee');
  });

  it('renders complete card information when a cell is occupied', () => {
    const emptyBoard = createEmptyBoard();
    const board = {
      occupants: { ...emptyBoard.occupants, '3,0': testInstance.instanceId }
    };

    render(
      <GameBoard
        board={board}
        cardDefinitions={{ [testDefinition.id]: testDefinition }}
        cardInstances={{ [testInstance.instanceId]: testInstance }}
      />
    );

    const cell = screen.getByTestId('board-cell-3,0');
    expect(cell).toHaveTextContent('Cavaleiro');
    expect(cell).toHaveTextContent('500');
    expect(cell).toHaveTextContent('500');
    expect(cell).toHaveTextContent('0');
    expect(cell).not.toHaveTextContent(testInstance.instanceId);
  });

  it('mounts the supplied destruction overlay only during consequences', () => {
    const emptyBoard = createEmptyBoard();
    const board = {
      occupants: { ...emptyBoard.occupants, '3,0': testInstance.instanceId }
    };
    const playback: CombatPlaybackState = {
      column: 0,
      columnIndex: 0,
      totalColumns: 1,
      stage: 'consequences',
      stageIndex: 3,
      exchangeIndex: 0,
      exchangeCount: 1,
      attackerIds: [],
      targetIds: [testInstance.instanceId],
      pathTargetIds: [testInstance.instanceId],
      destroyedCardIds: [testInstance.instanceId],
      activeDestroyedCardIds: [testInstance.instanceId],
      outcome: 'offense-attacker-wins',
      exchangeOutcome: 'attacker-wins',
      events: [],
      soulAwards: [],
      hpDamage: 0,
      cumulativeHpDamage: { 1: 0, 2: 0 },
      isCombined: false,
      speed: 1
    };

    render(
      <GameBoard
        board={board}
        cardDefinitions={{ [testDefinition.id]: testDefinition }}
        cardInstances={{ [testInstance.instanceId]: testInstance }}
        combatPlayback={playback}
      />
    );

    const cell = screen.getByTestId('board-cell-3,0');
    expect(screen.getByTestId('card-destruction-overlay')).toBeInTheDocument();
    expect(cell).toHaveAttribute('data-combat-effect', 'destroyed');
    expect(cell).toHaveAttribute('data-destruction-overlay', 'active');
    expect(cell.querySelector('[data-card-variant="board"]')).not.toBeInTheDocument();
  });
});
