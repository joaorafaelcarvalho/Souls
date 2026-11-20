import { describe, expect, it } from 'vitest';
import {
  AUDIO_ASSET_MANIFEST,
  AUDIO_CONTEXT_MUSIC,
  AUDIO_EVENT_BINDINGS,
  AUDIO_TIMELINE_BINDINGS,
  getAudioAsset
} from './audioManifest';

describe('SOULS audio manifest', () => {
  it('keeps IDs unique and paths reserved for future original assets', () => {
    const ids = AUDIO_ASSET_MANIFEST.map((asset) => asset.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(AUDIO_ASSET_MANIFEST).toHaveLength(19);
    expect(AUDIO_ASSET_MANIFEST.every((asset) => asset.path.startsWith('/audio/'))).toBe(true);
    expect(AUDIO_ASSET_MANIFEST.every((asset) => asset.status === 'missing')).toBe(true);
    expect(AUDIO_ASSET_MANIFEST.every((asset) => asset.license === 'pending')).toBe(true);
  });

  it('maps contexts and official events only to declared asset IDs', () => {
    const declaredIds = new Set(AUDIO_ASSET_MANIFEST.map((asset) => asset.id));
    const contextIds = Object.values(AUDIO_CONTEXT_MUSIC);
    const eventIds = Object.values(AUDIO_EVENT_BINDINGS).flat();
    const timelineIds = Object.values(AUDIO_TIMELINE_BINDINGS);

    expect([...contextIds, ...eventIds, ...timelineIds].every((id) => declaredIds.has(id))).toBe(true);
    expect(getAudioAsset('music.menu').loop).toBe(true);
    expect(getAudioAsset('sfx.combat.melee').variants).toHaveLength(2);
  });
});
