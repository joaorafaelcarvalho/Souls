import { createDemoGame } from '../../../mocks/match';
import { describe, expect, it } from 'vitest';
import { createAuthorizedGameView } from './authorizedGameView';

describe('createAuthorizedGameView', () => {
  it('keeps active player and viewer identity separate', () => {
    const state = createDemoGame();
    const activePlayerState = { ...state.turn, activePlayerId: 2 as const };
    const view = createAuthorizedGameView({ ...state, turn: activePlayerState }, 1);

    expect(view.activePlayerId).toBe(2);
    expect(view.viewerPlayerId).toBe(1);
    expect(view.viewer.hand).toEqual(state.players[1].hand);
    expect(view.players[2].hand).toBeNull();
    expect(view.players[2].handCount).toBe(state.players[2].hand.length);
  });

  it('does not expose the other player hand or its private card instances', () => {
    const state = createDemoGame();
    const view = createAuthorizedGameView(state, 1);
    const opponentHandId = state.players[2].hand[0];

    expect(opponentHandId).toBeDefined();
    if (opponentHandId !== undefined) {
      expect(view.visibleCardInstances[opponentHandId]).toBeUndefined();
    }
    expect(view.players[1].hand).toEqual(state.players[1].hand);
  });

  it('authorizes the matching hand when the viewer changes', () => {
    const state = createDemoGame();
    const view = createAuthorizedGameView(state, 2);

    expect(view.viewer.hand).toEqual(state.players[2].hand);
    expect(view.players[1].hand).toBeNull();
    const opponentHandId = state.players[1].hand[0];
    expect(opponentHandId).toBeDefined();
    if (opponentHandId !== undefined) {
      expect(view.visibleCardInstances[opponentHandId]).toBeUndefined();
    }
  });
});
