import type { CardDefinition, CardInstance } from '@souls/game-core';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useRef } from 'react';
import type { CombatPlaybackState } from '../application/CombatAnimationSequencer';
import { LightningAttackEffect } from './LightningAttackEffect';

const definitionId = '6b5a3a87-3e1c-4d4f-9a25-0b2c1d4e5f60';
const instanceId = 'bcecc46e-d2cc-4978-b61b-eb4b793f990f';
const targetId = 'target-instance';

const instance: CardInstance = {
  instanceId,
  cardDefinitionId: definitionId,
  ownerId: 1
};

const playback: CombatPlaybackState = {
  column: 0,
  columnIndex: 0,
  totalColumns: 1,
  stage: 'attack',
  stageIndex: 1,
  exchangeIndex: 0,
  exchangeCount: 1,
  attackerIds: [instanceId],
  targetIds: [targetId],
  pathTargetIds: [targetId],
  destroyedCardIds: [],
  activeDestroyedCardIds: [],
  outcome: 'direct-damage',
  exchangeOutcome: 'direct-damage',
  events: [],
  soulAwards: [],
  hpDamage: 0,
  cumulativeHpDamage: { 1: 0, 2: 0 },
  isCombined: false,
  speed: 1
};

function rectangle(left: number, top: number, width: number, height: number): DOMRect {
  return {
    bottom: top + height,
    height,
    left,
    right: left + width,
    top,
    width,
    x: left,
    y: top,
    toJSON: () => ({})
  } as DOMRect;
}

function EffectHarness({
  kind,
  alternate = false
}: {
  readonly kind: CardDefinition['type'];
  readonly alternate?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentPlayback: CombatPlaybackState = alternate
    ? { ...playback, columnIndex: 1 }
    : playback;
  const definition: CardDefinition = {
    id: definitionId,
    name: kind === 'melee' ? 'Cavaleiro' : 'Arqueiro',
    level: 0,
    type: kind,
    attack: 500,
    defense: 500,
    image: '/images/cards/test.webp'
  };

  return (
    <div
      ref={(element) => {
        if (element !== null) {
          Object.defineProperties(element, {
            clientHeight: { configurable: true, value: 600 },
            clientWidth: { configurable: true, value: 800 }
          });
        }
        containerRef.current = element;
      }}
    >
      <button type="button" data-occupant-id={instanceId} />
      <button type="button" data-occupant-id={targetId} />
      <LightningAttackEffect
        cardDefinitions={{ [definitionId]: definition }}
        cardInstances={{ [instanceId]: instance }}
        containerRef={containerRef}
        playback={currentPlayback}
      />
    </div>
  );
}

function mockGeometry() {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    if (this.dataset.occupantId === instanceId) {
      return rectangle(100, 100, 100, 150);
    }

    if (this.dataset.occupantId === targetId) {
      return rectangle(500, 100, 100, 150);
    }

    return rectangle(0, 0, 800, 600);
  });
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('LightningAttackEffect', () => {
  it('uses only the existing ranged animation in the primary variant', async () => {
    mockGeometry();
    render(<EffectHarness kind="ranged" />);

    await waitFor(() => {
      const effect = screen.getByTestId('lightning-attack-effect');
      expect(effect.querySelector('img')).toHaveAttribute('src', '/images/effects/souls_ranged_golden_lightning.webp');
      expect(effect.querySelectorAll('path')).toHaveLength(0);
    });
  });

  it('uses only the large ranged impact animation in the alternate variant', async () => {
    mockGeometry();
    render(<EffectHarness kind="ranged" alternate />);

    await waitFor(() => {
      const effect = screen.getByTestId('lightning-attack-effect');
      expect(effect.querySelector('img')).toHaveAttribute('src', '/images/effects/souls_ranged_impact.webp');
      expect(effect.querySelectorAll('path')).toHaveLength(0);
    });
  });

  it('uses only the existing melee animation in the primary variant', async () => {
    mockGeometry();
    render(<EffectHarness kind="melee" />);

    await waitFor(() => {
      const effect = screen.getByTestId('lightning-attack-effect');
      expect(effect.querySelector('img')).toHaveAttribute('src', '/images/effects/souls_melee_attack_alt.webp');
      expect(effect.querySelectorAll('path')).toHaveLength(0);
    });
  });

  it('uses only the large melee impact animation in the alternate variant', async () => {
    mockGeometry();
    render(<EffectHarness kind="melee" alternate />);

    await waitFor(() => {
      const effect = screen.getByTestId('lightning-attack-effect');
      expect(effect.querySelector('img')).toHaveAttribute('src', '/images/effects/souls_melee_impact.webp');
      expect(effect.querySelectorAll('path')).toHaveLength(0);
    });
  });
});
