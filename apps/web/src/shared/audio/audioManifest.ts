export type AudioAssetId =
  | 'music.menu'
  | 'music.battle'
  | 'music.victory'
  | 'music.defeat'
  | 'sfx.ui.hover'
  | 'sfx.ui.click'
  | 'sfx.card.select'
  | 'sfx.card.draw'
  | 'sfx.card.place'
  | 'sfx.card.summon'
  | 'sfx.card.draw-failed'
  | 'sfx.combat.melee'
  | 'sfx.combat.ranged'
  | 'sfx.combat.impact'
  | 'sfx.combat.block'
  | 'sfx.combat.destroy'
  | 'sfx.soul.gain'
  | 'sfx.soul.spend'
  | 'sfx.player.damage';

export type AudioAssetKind = 'music' | 'sfx';
export type AudioBus = 'music' | 'sfx' | 'ui';
export type AudioAssetStatus = 'missing' | 'ready';
export type AudioDistributionFormat = 'ogg' | 'mp3' | 'wav';
export type AudioAssetSource = 'to-be-produced' | 'opengameart';
export type AudioAssetLicense = 'pending' | 'CC0' | 'CC-BY-3.0' | 'CC-BY-4.0';

export interface AudioAssetDefinition {
  readonly id: AudioAssetId;
  readonly kind: AudioAssetKind;
  readonly bus: AudioBus;
  /** Browser distribution path for the selected licensed asset. */
  readonly path: `/audio/${string}`;
  /** Master format to request from the audio production workflow. */
  readonly masterFormat: 'wav';
  /** Distribution formats accepted by the Audio Manager. */
  readonly distributionFormats: readonly AudioDistributionFormat[];
  /** Suggested lower and upper duration in milliseconds, not a game rule. */
  readonly suggestedDurationMs: readonly [number, number];
  readonly loop: boolean;
  /** Relative gain before the master/music/SFX bus is applied. */
  readonly gain: number;
  readonly variants: readonly string[];
  readonly status: AudioAssetStatus;
  readonly source: AudioAssetSource;
  readonly license: AudioAssetLicense;
  readonly sourceUrl?: `https://${string}`;
  readonly author?: string;
  readonly licenseUrl?: `https://${string}`;
}

const cc0 = {
  masterFormat: 'wav',
  distributionFormats: ['ogg', 'mp3', 'wav'] as const,
  status: 'ready',
  source: 'opengameart',
  license: 'CC0'
} as const;

const ccBy30 = {
  masterFormat: 'wav',
  distributionFormats: ['ogg', 'mp3', 'wav'] as const,
  status: 'ready',
  source: 'opengameart',
  license: 'CC-BY-3.0'
} as const;

const ccBy40 = {
  masterFormat: 'wav',
  distributionFormats: ['ogg', 'mp3', 'wav'] as const,
  status: 'ready',
  source: 'opengameart',
  license: 'CC-BY-4.0'
} as const;

const CC0_LICENSE_URL = 'https://creativecommons.org/publicdomain/zero/1.0/' as const;
const DARK_PLACE_SOURCE_URL = 'https://opengameart.org/content/dark-place-loop' as const;
const CC_BY_30_LICENSE_URL = 'https://creativecommons.org/licenses/by/3.0/' as const;
const CC_BY_40_LICENSE_URL = 'https://creativecommons.org/licenses/by/4.0/' as const;
const BATTLE_THEME_SOURCE_URL = 'https://opengameart.org/content/dark-souls-type-boss-theme' as const;
const VICTORY_THEME_SOURCE_URL = 'https://opengameart.org/content/the-precipice-of-victory-rpg-orchestral-essentials-battle-results-music' as const;
const DEFEAT_THEME_SOURCE_URL = 'https://opengameart.org/content/the-fallen-rpg-orchestral-essentials-defeated-music' as const;
const SWORD_SOURCE_URL = 'https://opengameart.org/content/20-sword-sound-effects-attacks-and-clashes' as const;
const IMPACT_SOURCE_URL = 'https://opengameart.org/content/10-impactshield-blocks' as const;
const WEAPONS_SOURCE_URL = 'https://opengameart.org/content/fantasy-weapons-and-apparel-sfx-library' as const;
const RPG_SFX_SOURCE_URL = 'https://opengameart.org/content/80-cc0-rpg-sfx' as const;

export const AUDIO_ASSET_MANIFEST: readonly AudioAssetDefinition[] = [
  {
    ...cc0,
    id: 'music.menu',
    kind: 'music',
    bus: 'music',
    path: '/audio/music/menu.ogg',
    suggestedDurationMs: [90_000, 150_000],
    loop: true,
    gain: 0.8,
    variants: [],
    sourceUrl: DARK_PLACE_SOURCE_URL,
    author: 'SkyleTheFrench',
    licenseUrl: CC0_LICENSE_URL
  },
  {
    ...ccBy40,
    id: 'music.battle',
    kind: 'music',
    bus: 'music',
    path: '/audio/music/battle-theme.mp3',
    suggestedDurationMs: [240_000, 300_000],
    loop: true,
    gain: 0.85,
    variants: [],
    sourceUrl: BATTLE_THEME_SOURCE_URL,
    author: 'Philémon Weber (ProjectHelmet / Helmet)',
    licenseUrl: CC_BY_40_LICENSE_URL
  },
  {
    ...ccBy30,
    id: 'music.victory',
    kind: 'music',
    bus: 'music',
    path: '/audio/music/victory-theme.mp3',
    suggestedDurationMs: [90_000, 150_000],
    loop: false,
    gain: 0.95,
    variants: [],
    sourceUrl: VICTORY_THEME_SOURCE_URL,
    author: 'Jonathan Shaw (InspectorJ)',
    licenseUrl: CC_BY_30_LICENSE_URL
  },
  {
    ...ccBy30,
    id: 'music.defeat',
    kind: 'music',
    bus: 'music',
    path: '/audio/music/defeat-theme.mp3',
    suggestedDurationMs: [60_000, 90_000],
    loop: false,
    gain: 0.9,
    variants: [],
    sourceUrl: DEFEAT_THEME_SOURCE_URL,
    author: 'Jonathan Shaw (InspectorJ)',
    licenseUrl: CC_BY_30_LICENSE_URL
  },
  {
    ...cc0,
    id: 'sfx.ui.hover',
    kind: 'sfx',
    bus: 'ui',
    path: '/audio/sfx/ui/hover.ogg',
    suggestedDurationMs: [100, 200],
    loop: false,
    gain: 0.5,
    variants: [],
    sourceUrl: RPG_SFX_SOURCE_URL,
    author: 'rubberduck',
    licenseUrl: CC0_LICENSE_URL
  },
  {
    ...cc0,
    id: 'sfx.ui.click',
    kind: 'sfx',
    bus: 'ui',
    path: '/audio/sfx/ui/click.ogg',
    suggestedDurationMs: [100, 300],
    loop: false,
    gain: 0.65,
    variants: [],
    sourceUrl: RPG_SFX_SOURCE_URL,
    author: 'rubberduck',
    licenseUrl: CC0_LICENSE_URL
  },
  {
    ...cc0,
    id: 'sfx.card.select',
    kind: 'sfx',
    bus: 'ui',
    path: '/audio/sfx/card/select.ogg',
    suggestedDurationMs: [200, 400],
    loop: false,
    gain: 0.6,
    variants: [],
    sourceUrl: RPG_SFX_SOURCE_URL,
    author: 'rubberduck',
    licenseUrl: CC0_LICENSE_URL
  },
  {
    ...cc0,
    id: 'sfx.card.draw',
    kind: 'sfx',
    bus: 'sfx',
    path: '/audio/sfx/card/draw.ogg',
    suggestedDurationMs: [300, 700],
    loop: false,
    gain: 0.7,
    variants: [],
    sourceUrl: RPG_SFX_SOURCE_URL,
    author: 'rubberduck',
    licenseUrl: CC0_LICENSE_URL
  },
  {
    ...cc0,
    id: 'sfx.card.place',
    kind: 'sfx',
    bus: 'sfx',
    path: '/audio/sfx/card/place.ogg',
    suggestedDurationMs: [200, 500],
    loop: false,
    gain: 0.7,
    variants: [],
    sourceUrl: RPG_SFX_SOURCE_URL,
    author: 'rubberduck',
    licenseUrl: CC0_LICENSE_URL
  },
  {
    ...cc0,
    id: 'sfx.card.summon',
    kind: 'sfx',
    bus: 'sfx',
    path: '/audio/sfx/card/summon.ogg',
    suggestedDurationMs: [500, 1_200],
    loop: false,
    gain: 0.8,
    variants: [],
    sourceUrl: RPG_SFX_SOURCE_URL,
    author: 'rubberduck',
    licenseUrl: CC0_LICENSE_URL
  },
  {
    ...cc0,
    id: 'sfx.card.draw-failed',
    kind: 'sfx',
    bus: 'sfx',
    path: '/audio/sfx/card/draw-failed.ogg',
    suggestedDurationMs: [300, 800],
    loop: false,
    gain: 0.75,
    variants: [],
    sourceUrl: RPG_SFX_SOURCE_URL,
    author: 'rubberduck',
    licenseUrl: CC0_LICENSE_URL
  },
  {
    ...cc0,
    id: 'sfx.combat.melee',
    kind: 'sfx',
    bus: 'sfx',
    path: '/audio/sfx/combat/melee-01.ogg',
    suggestedDurationMs: [300, 800],
    loop: false,
    gain: 0.9,
    variants: ['/audio/sfx/combat/melee-02.ogg', '/audio/sfx/combat/melee-03.ogg'],
    sourceUrl: SWORD_SOURCE_URL,
    author: 'StarNinjas',
    licenseUrl: CC0_LICENSE_URL
  },
  {
    ...cc0,
    id: 'sfx.combat.ranged',
    kind: 'sfx',
    bus: 'sfx',
    path: '/audio/sfx/combat/ranged-01.wav',
    suggestedDurationMs: [300, 900],
    loop: false,
    gain: 0.85,
    variants: ['/audio/sfx/combat/ranged-02.wav', '/audio/sfx/combat/ranged-03.wav'],
    sourceUrl: WEAPONS_SOURCE_URL,
    author: 'Vehicle',
    licenseUrl: CC0_LICENSE_URL
  },
  {
    ...cc0,
    id: 'sfx.combat.impact',
    kind: 'sfx',
    bus: 'sfx',
    path: '/audio/sfx/combat/impact.ogg',
    suggestedDurationMs: [200, 600],
    loop: false,
    gain: 0.9,
    variants: [],
    sourceUrl: IMPACT_SOURCE_URL,
    author: 'StarNinjas',
    licenseUrl: CC0_LICENSE_URL
  },
  {
    ...cc0,
    id: 'sfx.combat.block',
    kind: 'sfx',
    bus: 'sfx',
    path: '/audio/sfx/combat/block.ogg',
    suggestedDurationMs: [300, 700],
    loop: false,
    gain: 0.85,
    variants: [],
    sourceUrl: SWORD_SOURCE_URL,
    author: 'StarNinjas',
    licenseUrl: CC0_LICENSE_URL
  },
  {
    ...cc0,
    id: 'sfx.combat.destroy',
    kind: 'sfx',
    bus: 'sfx',
    path: '/audio/sfx/combat/destroy.ogg',
    suggestedDurationMs: [800, 1_500],
    loop: false,
    gain: 0.85,
    variants: [],
    sourceUrl: RPG_SFX_SOURCE_URL,
    author: 'rubberduck',
    licenseUrl: CC0_LICENSE_URL
  },
  {
    ...cc0,
    id: 'sfx.soul.gain',
    kind: 'sfx',
    bus: 'sfx',
    path: '/audio/sfx/soul/gain.ogg',
    suggestedDurationMs: [400, 1_000],
    loop: false,
    gain: 0.75,
    variants: [],
    sourceUrl: RPG_SFX_SOURCE_URL,
    author: 'rubberduck',
    licenseUrl: CC0_LICENSE_URL
  },
  {
    ...cc0,
    id: 'sfx.soul.spend',
    kind: 'sfx',
    bus: 'sfx',
    path: '/audio/sfx/soul/spend.ogg',
    suggestedDurationMs: [300, 800],
    loop: false,
    gain: 0.7,
    variants: [],
    sourceUrl: RPG_SFX_SOURCE_URL,
    author: 'rubberduck',
    licenseUrl: CC0_LICENSE_URL
  },
  {
    ...cc0,
    id: 'sfx.player.damage',
    kind: 'sfx',
    bus: 'sfx',
    path: '/audio/sfx/player/damage.ogg',
    suggestedDurationMs: [200, 600],
    loop: false,
    gain: 0.8,
    variants: [],
    sourceUrl: RPG_SFX_SOURCE_URL,
    author: 'rubberduck',
    licenseUrl: CC0_LICENSE_URL
  }
] as const;

export type AudioContextId = 'menu' | 'lobby' | 'tutorial' | 'battle' | 'victory' | 'defeat';

export const AUDIO_CONTEXT_MUSIC: Readonly<Record<AudioContextId, AudioAssetId>> = {
  menu: 'music.menu',
  lobby: 'music.menu',
  tutorial: 'music.menu',
  battle: 'music.battle',
  victory: 'music.victory',
  defeat: 'music.defeat'
};

/** Official game events that can be bound once an Audio Manager exists. */
export const AUDIO_EVENT_BINDINGS = {
  'card-drawn': ['sfx.card.draw'],
  'card-invoked': ['sfx.card.place'],
  'card-retired': ['sfx.card.place'],
  'draw-failed': ['sfx.card.draw-failed'],
  'card-destroyed': ['sfx.combat.destroy'],
  'souls-gained': ['sfx.soul.gain'],
  'souls-spent': ['sfx.soul.spend'],
  'damage-dealt': ['sfx.player.damage']
} as const satisfies Readonly<Record<string, readonly AudioAssetId[]>>;

/** Visual timeline markers not yet emitted by game-core as domain events. */
export const AUDIO_TIMELINE_BINDINGS = {
  meleeSwing: 'sfx.combat.melee',
  rangedLaunch: 'sfx.combat.ranged',
  combatImpact: 'sfx.combat.impact',
  combatBlocked: 'sfx.combat.block',
  uiHover: 'sfx.ui.hover',
  uiClick: 'sfx.ui.click',
  cardSelect: 'sfx.card.select'
} as const satisfies Readonly<Record<string, AudioAssetId>>;

export interface AudioMixSettings {
  readonly master: number;
  readonly music: number;
  readonly sfx: number;
  readonly ui: number;
  readonly muted: boolean;
}

export const DEFAULT_AUDIO_MIX: AudioMixSettings = {
  master: 1,
  music: 0.35,
  sfx: 0.8,
  ui: 0.65,
  muted: false
};

export function getAudioAsset(id: AudioAssetId): AudioAssetDefinition {
  const asset = AUDIO_ASSET_MANIFEST.find((candidate) => candidate.id === id);
  if (asset === undefined) {
    throw new Error(`Unknown SOULS audio asset "${id}".`);
  }

  return asset;
}
