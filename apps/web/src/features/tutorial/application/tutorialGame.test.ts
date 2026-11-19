import { resolveAttackPhase, retireCard } from '@souls/game-core';
import { describe, expect, it } from 'vitest';
import { cardInHandFor, createCombatScenario, createDrawScenario, createRetirementScenario, createSoulInvocationScenario, createTutorialGame } from './tutorialGame';

describe('tutorial scenarios', () => {
  it('creates the same official opening hand and first player every time', () => {
    const first = createTutorialGame();
    const second = createTutorialGame();

    expect(first.turn.firstPlayerId).toBe(1);
    expect(first.turn.activePlayerId).toBe(1);
    expect(first.players[1].hand.map((id) => first.cardInstances[id]?.cardDefinitionId)).toEqual(
      second.players[1].hand.map((id) => second.cardInstances[id]?.cardDefinitionId)
    );
    expect(() => cardInHandFor(first, 1, 'cavaleiro')).not.toThrow();
    expect(() => cardInHandFor(first, 1, 'defensor')).not.toThrow();
    expect(() => cardInHandFor(first, 1, 'arqueiro')).not.toThrow();
  });

  it('reaches the official draw phase through real first-round transitions', () => {
    const state = createDrawScenario();

    expect(state.turn.round).toBe(2);
    expect(state.turn.activePlayerId).toBe(1);
    expect(state.turn.phase).toBe('draw');
  });

  it('builds a legal combat scenario and preserves the combined attack rules', () => {
    const state = createCombatScenario(true);
    const result = resolveAttackPhase(state);

    expect(state.turn.phase).toBe('attack');
    expect(result.state.players[2].hp).toBe(9_500);
    expect(result.state.players[2].souls).toBe(1);
    expect(result.events.some((event) => event.type === 'card-destroyed')).toBe(true);
    expect(result.combatTrace?.columns[0]?.attackerIds).toHaveLength(2);
  });

  it('presents a legal positioning phase for a paid level-two invocation', () => {
    const state = createSoulInvocationScenario();

    expect(state.turn.phase).toBe('positioning');
    expect(state.turn.activePlayerId).toBe(1);
    expect(state.players[1].souls).toBe(2);
    expect(() => cardInHandFor(state, 1, 'cacadora-lua-palida')).not.toThrow();
  });

  it('builds a real v0.7 Soul Harvest scenario', () => {
    const state = createRetirementScenario();
    const boardCard = Object.values(state.board.occupants).find((instanceId) => instanceId !== null);

    if (boardCard === undefined || boardCard === null) throw new Error('The retirement tutorial fixture is empty.');

    const result = retireCard(state, { playerId: 1, instanceId: boardCard });
    expect(result.state.turn.placementsMade).toBe(1);
    expect(result.state.players[1].souls).toBe(1);
    expect(result.events.some((event) => event.type === 'souls-gained' && event.reason === 'retirement')).toBe(true);
  });
});
