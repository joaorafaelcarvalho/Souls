import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useLocalGame } from './useLocalGame';

afterEach(cleanup);

describe('useLocalGame audio integration', () => {
  it('emits only official events after a placement is accepted', () => {
    const onEvents = vi.fn();
    const { result } = renderHook(() => useLocalGame({
      random: { next: () => 0 },
      onEvents
    }));
    const firstView = result.current.view;
    const instanceId = firstView.viewer.hand.find((candidate) => {
      const instance = firstView.visibleCardInstances[candidate];
      return instance !== undefined;
    });

    if (instanceId === undefined) {
      throw new Error('The local fixture must contain a card in the opening hand.');
    }

    const instance = firstView.visibleCardInstances[instanceId];
    if (instance === undefined) throw new Error('The selected card must be visible.');
    const definition = firstView.cardDefinitions[instance.cardDefinitionId];
    if (definition === undefined) throw new Error('The selected card must have a definition.');
    const row = definition.type === 'ranged' ? 5 : 3;

    act(() => {
      result.current.commands.selectCard(instanceId);
    });
    act(() => {
      result.current.commands.placeSelectedCard(row, 0);
    });

    const emittedEvents = onEvents.mock.calls.flatMap(([events]) => events);
    expect(emittedEvents).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: 'card-invoked', instanceId })
    ]));
  });
});
