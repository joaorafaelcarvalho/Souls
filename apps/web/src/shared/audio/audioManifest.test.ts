import { describe, expect, it } from 'vitest';
import {
  AUDIO_ASSET_MANIFEST,
  AUDIO_CONTEXT_MUSIC,
  AUDIO_EVENT_BINDINGS,
  AUDIO_TIMELINE_BINDINGS,
  getAudioAsset
} from './audioManifest';

describe('SOULS audio manifest', () => {
  it('keeps IDs unique and records the current licensed asset availability', () => {
    const ids = AUDIO_ASSET_MANIFEST.map((asset) => asset.id);
    const readyAssets = AUDIO_ASSET_MANIFEST.filter((asset) => asset.status === 'ready');
    const missingAssets = AUDIO_ASSET_MANIFEST.filter((asset) => asset.status === 'missing');

    expect(new Set(ids).size).toBe(ids.length);
    expect(AUDIO_ASSET_MANIFEST).toHaveLength(19);
    expect(AUDIO_ASSET_MANIFEST.every((asset) => asset.path.startsWith('/audio/'))).toBe(true);
    expect(readyAssets).toHaveLength(19);
    expect(missingAssets).toHaveLength(0);
    expect(readyAssets.every((asset) => asset.license !== 'pending')).toBe(true);
    expect(readyAssets.every((asset) => asset.source === 'opengameart')).toBe(true);
    expect(readyAssets.every((asset) => asset.sourceUrl !== undefined && asset.author !== undefined && asset.licenseUrl !== undefined)).toBe(true);
  });

  it('maps contexts and official events only to declared asset IDs', () => {
    const declaredIds = new Set(AUDIO_ASSET_MANIFEST.map((asset) => asset.id));
    const contextIds = Object.values(AUDIO_CONTEXT_MUSIC);
    const eventIds = Object.values(AUDIO_EVENT_BINDINGS).flat();
    const timelineIds = Object.values(AUDIO_TIMELINE_BINDINGS);

    expect([...contextIds, ...eventIds, ...timelineIds].every((id) => declaredIds.has(id))).toBe(true);
    expect(getAudioAsset('music.menu').loop).toBe(true);
    expect(getAudioAsset('music.menu')).toMatchObject({
      path: '/audio/music/menu.ogg',
      loop: true,
      license: 'CC0',
      author: 'SkyleTheFrench'
    });
    expect(getAudioAsset('music.battle')).toMatchObject({
      path: '/audio/music/battle-theme.mp3',
      loop: true,
      license: 'CC-BY-4.0'
    });
    expect(getAudioAsset('music.victory')).toMatchObject({
      path: '/audio/music/victory-theme.mp3',
      loop: false,
      license: 'CC-BY-3.0'
    });
    expect(getAudioAsset('music.defeat')).toMatchObject({
      path: '/audio/music/defeat-theme.mp3',
      loop: false,
      license: 'CC-BY-3.0'
    });
    expect(getAudioAsset('sfx.combat.melee').variants).toHaveLength(2);
  });
});
