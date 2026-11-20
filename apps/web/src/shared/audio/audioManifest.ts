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

export interface AudioAssetDefinition {
  readonly id: AudioAssetId;
  readonly kind: AudioAssetKind;
  readonly bus: AudioBus;
  /** Browser distribution path reserved for the optimized OGG/MP3 asset. */
  readonly path: `/audio/${string}`;
  /** Master format to request from the audio production workflow. */
  readonly masterFormat: 'wav';
  /** Distribution formats accepted by the future Audio Manager. */
  readonly distributionFormats: readonly ['ogg', 'mp3'];
  /** Suggested lower and upper duration in milliseconds, not a game rule. */
  readonly suggestedDurationMs: readonly [number, number];
  readonly loop: boolean;
  /** Relative gain before the master/music/SFX bus is applied. */
  readonly gain: number;
  readonly variants: readonly string[];
  readonly status: AudioAssetStatus;
  readonly source: 'to-be-produced';
  readonly license: 'pending';
}

const pending = {
  masterFormat: 'wav',
  distributionFormats: ['ogg', 'mp3'] as const,
  status: 'missing',
  source: 'to-be-produced',
  license: 'pending'
} as const;

export const AUDIO_ASSET_MANIFEST: readonly AudioAssetDefinition[] = [
  {
    ...pending,
    id: 'music.menu',
    kind: 'music',
    bus: 'music',
    path: '/audio/music/menu.ogg',
    suggestedDurationMs: [90_000, 150_000],
    loop: true,
    gain: 0.8,
    variants: []
  },
  {
    ...pending,
    id: 'music.battle',
    kind: 'music',
    bus: 'music',
    path: '/audio/music/battle.ogg',
    suggestedDurationMs: [120_000, 180_000],
    loop: true,
    gain: 0.85,
    variants: []
  },
  {
    ...pending,
    id: 'music.victory',
    kind: 'music',
    bus: 'music',
    path: '/audio/music/victory.ogg',
    suggestedDurationMs: [15_000, 30_000],
    loop: false,
    gain: 0.95,
    variants: []
  },
  {
    ...pending,
    id: 'music.defeat',
    kind: 'music',
    bus: 'music',
    path: '/audio/music/defeat.ogg',
    suggestedDurationMs: [15_000, 30_000],
    loop: false,
    gain: 0.9,
    variants: []
  },
  {
    ...pending,
    id: 'sfx.ui.hover',
    kind: 'sfx',
    bus: 'ui',
    path: '/audio/sfx/ui/hover.ogg',
    suggestedDurationMs: [100, 200],
    loop: false,
    gain: 0.5,
    variants: []
  },
  {
    ...pending,
    id: 'sfx.ui.click',
    kind: 'sfx',
    bus: 'ui',
    path: '/audio/sfx/ui/click.ogg',
    suggestedDurationMs: [100, 300],
    loop: false,
    gain: 0.65,
    variants: []
  },
  {
    ...pending,
    id: 'sfx.card.select',
    kind: 'sfx',
    bus: 'ui',
    path: '/audio/sfx/card/select.ogg',
    suggestedDurationMs: [200, 400],
    loop: false,
    gain: 0.6,
    variants: []
  },
  {
    ...pending,
    id: 'sfx.card.draw',
    kind: 'sfx',
    bus: 'sfx',
    path: '/audio/sfx/card/draw.ogg',
    suggestedDurationMs: [300, 700],
    loop: false,
    gain: 0.7,
    variants: []
  },
  {
    ...pending,
    id: 'sfx.card.place',
    kind: 'sfx',
    bus: 'sfx',
    path: '/audio/sfx/card/place.ogg',
    suggestedDurationMs: [200, 500],
    loop: false,
    gain: 0.7,
    variants: []
  },
  {
    ...pending,
    id: 'sfx.card.summon',
    kind: 'sfx',
    bus: 'sfx',
    path: '/audio/sfx/card/summon.ogg',
    suggestedDurationMs: [500, 1_200],
    loop: false,
    gain: 0.8,
    variants: []
  },
  {
    ...pending,
    id: 'sfx.card.draw-failed',
    kind: 'sfx',
    bus: 'sfx',
    path: '/audio/sfx/card/draw-failed.ogg',
    suggestedDurationMs: [300, 800],
    loop: false,
    gain: 0.75,
    variants: []
  },
  {
    ...pending,
    id: 'sfx.combat.melee',
    kind: 'sfx',
    bus: 'sfx',
    path: '/audio/sfx/combat/melee-01.ogg',
    suggestedDurationMs: [300, 800],
    loop: false,
    gain: 0.9,
    variants: ['/audio/sfx/combat/melee-02.ogg', '/audio/sfx/combat/melee-03.ogg']
  },
  {
    ...pending,
    id: 'sfx.combat.ranged',
    kind: 'sfx',
    bus: 'sfx',
    path: '/audio/sfx/combat/ranged-01.ogg',
    suggestedDurationMs: [300, 900],
    loop: false,
    gain: 0.85,
    variants: ['/audio/sfx/combat/ranged-02.ogg']
  },
  {
    ...pending,
    id: 'sfx.combat.impact',
    kind: 'sfx',
    bus: 'sfx',
    path: '/audio/sfx/combat/impact.ogg',
    suggestedDurationMs: [200, 600],
    loop: false,
    gain: 0.9,
    variants: []
  },
  {
    ...pending,
    id: 'sfx.combat.block',
    kind: 'sfx',
    bus: 'sfx',
    path: '/audio/sfx/combat/block.ogg',
    suggestedDurationMs: [300, 700],
    loop: false,
    gain: 0.85,
    variants: []
  },
  {
    ...pending,
    id: 'sfx.combat.destroy',
    kind: 'sfx',
    bus: 'sfx',
    path: '/audio/sfx/combat/destroy.ogg',
    suggestedDurationMs: [800, 1_500],
    loop: false,
    gain: 0.85,
    variants: []
  },
  {
    ...pending,
    id: 'sfx.soul.gain',
    kind: 'sfx',
    bus: 'sfx',
    path: '/audio/sfx/soul/gain.ogg',
    suggestedDurationMs: [400, 1_000],
    loop: false,
    gain: 0.75,
    variants: []
  },
  {
    ...pending,
    id: 'sfx.soul.spend',
    kind: 'sfx',
    bus: 'sfx',
    path: '/audio/sfx/soul/spend.ogg',
    suggestedDurationMs: [300, 800],
    loop: false,
    gain: 0.7,
    variants: []
  },
  {
    ...pending,
    id: 'sfx.player.damage',
    kind: 'sfx',
    bus: 'sfx',
    path: '/audio/sfx/player/damage.ogg',
    suggestedDurationMs: [200, 600],
    loop: false,
    gain: 0.8,
    variants: []
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
  'card-invoked': ['sfx.card.summon'],
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
