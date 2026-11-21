import type { OnlineGameEvent } from '@souls/game-online';
import type { GameEvent } from '@souls/game-core';
import {
  AUDIO_EVENT_BINDINGS,
  AUDIO_TIMELINE_BINDINGS,
  type AudioAssetId
} from './audioManifest';

export type AudioGameEvent = GameEvent | OnlineGameEvent;

export interface AudioCardContext {
  readonly cardInstances: Readonly<Record<string, { readonly cardDefinitionId: string }>>;
  readonly cardDefinitions: Readonly<Record<string, { readonly type: 'melee' | 'ranged' }>>;
}

/** Minimal playback contract consumed by audio; it deliberately avoids a combat-module dependency. */
export interface AudioCombatPlayback {
  readonly stage: 'highlight' | 'attack' | 'impact' | 'consequences' | 'transition';
  readonly attackerIds: readonly string[];
  readonly exchangeOutcome: string;
  readonly activeDestroyedCardIds: readonly string[];
  readonly soulAwards: readonly { readonly playerId: 1 | 2; readonly amount: number }[];
  readonly hpDamage: number;
}

function assetsForEvent(event: AudioGameEvent): readonly AudioAssetId[] {
  switch (event.type) {
    case 'card-drawn':
      return AUDIO_EVENT_BINDINGS['card-drawn'];
    case 'card-invoked':
      return AUDIO_EVENT_BINDINGS['card-invoked'];
    case 'card-retired':
      return AUDIO_EVENT_BINDINGS['card-retired'];
    case 'draw-failed':
      return AUDIO_EVENT_BINDINGS['draw-failed'];
    case 'card-destroyed':
      return AUDIO_EVENT_BINDINGS['card-destroyed'];
    case 'souls-gained':
      return AUDIO_EVENT_BINDINGS['souls-gained'];
    case 'souls-spent':
      return event.reason === 'invocation'
        ? [...AUDIO_EVENT_BINDINGS['souls-spent'], 'sfx.card.summon']
        : AUDIO_EVENT_BINDINGS['souls-spent'];
    case 'damage-dealt':
      return AUDIO_EVENT_BINDINGS['damage-dealt'];
    case 'turn-started':
    case 'game-ended':
      return [];
  }
}

export function audioAssetsForEvent(event: AudioGameEvent): readonly AudioAssetId[] {
  return assetsForEvent(event);
}

export function audioAssetsForEvents(events: readonly AudioGameEvent[]): readonly AudioAssetId[] {
  return events.flatMap(audioAssetsForEvent);
}

function cardTypeFor(instanceId: string, context: AudioCardContext): 'melee' | 'ranged' | undefined {
  const instance = context.cardInstances[instanceId];
  return instance === undefined
    ? undefined
    : context.cardDefinitions[instance.cardDefinitionId]?.type;
}

export function audioAssetsForCombatPlayback(
  playback: AudioCombatPlayback,
  context: AudioCardContext
): readonly AudioAssetId[] {
  if (playback.stage === 'attack') {
    return playback.attackerIds.map((instanceId) => (
      cardTypeFor(instanceId, context) === 'ranged'
        ? AUDIO_TIMELINE_BINDINGS.rangedLaunch
        : AUDIO_TIMELINE_BINDINGS.meleeSwing
    ));
  }

  if (playback.stage === 'impact') {
    return playback.exchangeOutcome === 'blocked'
      ? [AUDIO_TIMELINE_BINDINGS.combatBlocked]
      : [AUDIO_TIMELINE_BINDINGS.combatImpact];
  }

  if (playback.stage === 'consequences') {
    const consequenceAssets: AudioAssetId[] = [];
    if (playback.activeDestroyedCardIds.length > 0) {
      consequenceAssets.push(AUDIO_EVENT_BINDINGS['card-destroyed'][0]!);
    }
    if (playback.soulAwards.length > 0) {
      consequenceAssets.push(AUDIO_EVENT_BINDINGS['souls-gained'][0]!);
    }
    if (playback.hpDamage > 0) {
      consequenceAssets.push(AUDIO_EVENT_BINDINGS['damage-dealt'][0]!);
    }
    return consequenceAssets;
  }

  return [];
}
