import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createRetirementScenario } from '../application/tutorialGame';
import { TUTORIAL_STEPS } from '../application/tutorialSteps';
import { createAuthorizedGameView } from '../../match/application/authorizedGameView';
import { useTutorialGame, type TutorialSession } from '../application/useTutorialGame';
import { TutorialScreen } from './TutorialScreen';

vi.mock('../application/useTutorialGame', () => ({
  useTutorialGame: vi.fn()
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('TutorialScreen retirement step', () => {
  it('keeps an occupied board cell clickable during Soul Harvest', () => {
    const state = createRetirementScenario();
    const view = createAuthorizedGameView(state, 1);
    const boardCardId = Object.values(state.board.occupants).find((instanceId) => instanceId !== null);
    const retirementStep = TUTORIAL_STEPS.find((step) => step.id === 'retirement');

    if (boardCardId === undefined || boardCardId === null || retirementStep === undefined) {
      throw new Error('The retirement fixture must contain a board card and its tutorial step.');
    }

    const selectBoardCard = vi.fn();
    const retireSelectedCard = vi.fn();
    const session = {
      phase: 'active' as const,
      step: retirementStep,
      stepIndex: 14,
      totalSteps: TUTORIAL_STEPS.length,
      state,
      view,
      selectedCardId: null,
      highlightedCardId: null,
      message: 'Seleciona a carta no campo.',
      matchLog: [],
      stepCompleted: false,
      exploredZones: new Set(),
      highlightedZone: null,
      highlightedRows: [4],
      combatPlayback: null,
      combatSpeed: 1 as const,
      isCombatAnimating: false,
      isResourceAnimating: false,
      resourceDamageByPlayer: null,
      resourceSoulDeltaByPlayer: null,
      resourcePlaybackKey: undefined,
      canAdvance: false,
      canPlaceSelectedCard: () => false,
      getCellState: () => 'invalid' as const,
      commands: {
        start: vi.fn(),
        reset: vi.fn(),
        restartStep: vi.fn(),
        advanceStep: vi.fn(),
        exploreZone: vi.fn(),
        selectCard: vi.fn(),
        selectBoardCard,
        placeSelectedCard: vi.fn(),
        retireSelectedCard,
        resolveDraw: vi.fn(),
        finishPositioning: vi.fn(),
        resolveAttack: vi.fn(),
        setCombatSpeed: vi.fn(),
        skipCombat: vi.fn()
      }
    } satisfies TutorialSession;

    vi.mocked(useTutorialGame).mockReturnValue(session);
    render(<TutorialScreen onExit={vi.fn()} onPlayNow={vi.fn()} />);

    const boardCell = screen.getByTestId('board-cell-4,0');
    expect(boardCell).not.toBeDisabled();

    fireEvent.click(boardCell);
    expect(selectBoardCard).toHaveBeenCalledWith(boardCardId);

    fireEvent.click(screen.getByRole('button', { name: /retirar carta/i }));
    expect(retireSelectedCard).toHaveBeenCalledTimes(1);
  });
});
