import type { AudioCardContext, AudioCombatPlayback, AudioGameEvent } from './audioEvents';
import { audioAssetsForCombatPlayback, audioAssetsForEvents } from './audioEvents';
import {
  AUDIO_ASSET_MANIFEST,
  DEFAULT_AUDIO_MIX,
  getAudioAsset,
  type AudioAssetDefinition,
  type AudioAssetId,
  type AudioAssetStatus,
  type AudioMixSettings
} from './audioManifest';

const AUDIO_SETTINGS_STORAGE_KEY = 'souls.audio.settings.v1';
const DEFAULT_MAX_CONCURRENT_SFX = 8;
const DEFAULT_CROSSFADE_DURATION_MS = 420;
const DEFAULT_DUPLICATE_WINDOW_MS = 70;

export type AudioRuntimeStatus = 'unknown' | 'loading' | 'ready' | 'missing' | 'blocked' | 'error' | 'unsupported';

export interface AudioDiagnostic {
  readonly id: AudioAssetId;
  readonly path: string;
  readonly manifestStatus: AudioAssetStatus;
  readonly status: AudioRuntimeStatus;
  readonly message?: string;
}

export type AudioPlaybackReason = 'played' | 'duplicate' | 'missing' | 'blocked' | 'error' | 'unsupported' | 'limit' | 'invalid';

export interface AudioPlaybackResult {
  readonly id: AudioAssetId;
  readonly played: boolean;
  readonly reason: AudioPlaybackReason;
}

export interface AudioStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}

export interface AudioManagerOptions {
  readonly audioFactory?: () => HTMLAudioElement;
  readonly storage?: AudioStorage;
  readonly diagnosticsEnabled?: boolean;
  readonly logger?: (message: string) => void;
  readonly maxConcurrentSfx?: number;
  readonly crossfadeDurationMs?: number;
  readonly duplicateWindowMs?: number;
  readonly provisionalUiFeedback?: boolean;
}

interface AudioVoice {
  readonly id: AudioAssetId;
  readonly definition: AudioAssetDefinition;
  readonly element: HTMLAudioElement;
  readonly isMusic: boolean;
}

type SfxVoiceAcquisition = AudioVoice | 'limit' | undefined;

function clampVolume(value: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

function isJsdomRuntime(): boolean {
  return typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent);
}

function storageFromEnvironment(): AudioStorage | undefined {
  if (typeof window === 'undefined' || window.localStorage === undefined) {
    return undefined;
  }

  return window.localStorage;
}

function copyMix(settings: AudioMixSettings): AudioMixSettings {
  return { ...settings };
}

function validMixValue(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? clampVolume(value) : fallback;
}

function readStoredMix(storage: AudioStorage | undefined): AudioMixSettings {
  if (storage === undefined) {
    return copyMix(DEFAULT_AUDIO_MIX);
  }

  try {
    const raw = storage.getItem(AUDIO_SETTINGS_STORAGE_KEY);
    if (raw === null) {
      return copyMix(DEFAULT_AUDIO_MIX);
    }

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) {
      return copyMix(DEFAULT_AUDIO_MIX);
    }

    const candidate = parsed as Partial<Record<keyof AudioMixSettings, unknown>>;
    return {
      master: validMixValue(candidate.master, DEFAULT_AUDIO_MIX.master),
      music: validMixValue(candidate.music, DEFAULT_AUDIO_MIX.music),
      sfx: validMixValue(candidate.sfx, DEFAULT_AUDIO_MIX.sfx),
      ui: validMixValue(candidate.ui, DEFAULT_AUDIO_MIX.ui),
      muted: typeof candidate.muted === 'boolean' ? candidate.muted : DEFAULT_AUDIO_MIX.muted
    };
  } catch {
    return copyMix(DEFAULT_AUDIO_MIX);
  }
}

function defaultAudioFactory(): HTMLAudioElement {
  return new Audio();
}

function isUiFeedbackAsset(id: AudioAssetId): boolean {
  return id === 'sfx.ui.hover' || id === 'sfx.ui.click' || id === 'sfx.card.select';
}

export class AudioManager {
  private readonly audioFactory: () => HTMLAudioElement;
  private readonly storage: AudioStorage | undefined;
  private readonly diagnosticsEnabled: boolean;
  private readonly logger: (message: string) => void;
  private readonly maxConcurrentSfx: number;
  private readonly crossfadeDurationMs: number;
  private readonly duplicateWindowMs: number;
  private readonly provisionalUiFeedback: boolean;
  private readonly musicVoices = new Map<AudioAssetId, AudioVoice>();
  private readonly sfxVoices = new Map<AudioAssetId, AudioVoice[]>();
  private readonly activeSfx = new Set<AudioVoice>();
  private readonly diagnostics = new Map<AudioAssetId, AudioDiagnostic>();
  private readonly settingsListeners = new Set<() => void>();
  private readonly lastSfxAt = new Map<AudioAssetId, number>();
  private settings: AudioMixSettings;
  private currentMusic: AudioVoice | undefined;
  private pendingMusicId: AudioAssetId | undefined;
  private fadeTimer: ReturnType<typeof setInterval> | undefined;
  private transitionToken = 0;
  private provisionalContext: AudioContext | undefined;

  public constructor(options: AudioManagerOptions = {}) {
    this.audioFactory = options.audioFactory ?? defaultAudioFactory;
    this.storage = options.storage ?? storageFromEnvironment();
    this.diagnosticsEnabled = options.diagnosticsEnabled ?? false;
    this.logger = options.logger ?? ((message) => console.warn(message));
    this.maxConcurrentSfx = Math.max(1, Math.floor(options.maxConcurrentSfx ?? DEFAULT_MAX_CONCURRENT_SFX));
    this.crossfadeDurationMs = Math.max(0, options.crossfadeDurationMs ?? DEFAULT_CROSSFADE_DURATION_MS);
    this.duplicateWindowMs = Math.max(0, options.duplicateWindowMs ?? DEFAULT_DUPLICATE_WINDOW_MS);
    this.provisionalUiFeedback = options.provisionalUiFeedback ?? true;
    this.settings = readStoredMix(this.storage);
  }

  public getSettings(): AudioMixSettings {
    return copyMix(this.settings);
  }

  public getCurrentMusicId(): AudioAssetId | undefined {
    return this.currentMusic?.id;
  }

  public getActiveSfxCount(): number {
    return this.activeSfx.size;
  }

  public getDiagnostics(): readonly AudioDiagnostic[] {
    return AUDIO_ASSET_MANIFEST.map((asset) => this.diagnostics.get(asset.id) ?? {
      id: asset.id,
      path: asset.path,
      manifestStatus: asset.status,
      status: 'unknown'
    });
  }

  public subscribeSettings(listener: () => void): () => void {
    this.settingsListeners.add(listener);
    return () => this.settingsListeners.delete(listener);
  }

  public setMasterVolume(value: number): void {
    this.updateSettings({ master: clampVolume(value) });
  }

  public setMusicVolume(value: number): void {
    this.updateSettings({ music: clampVolume(value) });
  }

  public setSfxVolume(value: number): void {
    this.updateSettings({ sfx: clampVolume(value) });
  }

  public setUiVolume(value: number): void {
    this.updateSettings({ ui: clampVolume(value) });
  }

  public setMuted(muted: boolean): void {
    this.updateSettings({ muted });
  }

  public async playMusic(id: AudioAssetId): Promise<AudioPlaybackResult> {
    const definition = getAudioAsset(id);
    if (definition.kind !== 'music') {
      return { id, played: false, reason: 'invalid' };
    }

    const target = this.getMusicVoice(id);
    if (target === undefined) {
      return { id, played: false, reason: this.runtimeReason(id) };
    }

    if (this.currentMusic?.id === id) {
      target.element.loop = definition.loop;
      target.element.volume = this.effectiveVolume(definition);
      this.pendingMusicId = undefined;
      if (!target.element.paused) {
        return { id, played: true, reason: 'played' };
      }
      return this.startVoice(target);
    }

    const previous = this.currentMusic;
    const token = ++this.transitionToken;
    this.clearFadeTimer();
    this.pendingMusicId = id;
    this.currentMusic = target;
    target.element.loop = definition.loop;
    target.element.currentTime = 0;
    target.element.volume = previous === undefined ? this.effectiveVolume(definition) : 0;

    const result = await this.startVoice(target);
    if (!result.played) {
      if (this.currentMusic === target) {
        this.currentMusic = previous;
      }
      if (previous !== undefined) {
        previous.element.volume = this.effectiveVolume(previous.definition);
      }
      return result;
    }

    this.pendingMusicId = undefined;
    if (previous !== undefined) {
      this.crossfade(previous, target, token);
    }

    return result;
  }

  public pauseMusic(): void {
    this.currentMusic?.element.pause();
  }

  public async resumeMusic(): Promise<AudioPlaybackResult | undefined> {
    const current = this.currentMusic;
    if (current === undefined) {
      return undefined;
    }

    this.pendingMusicId = undefined;
    return this.startVoice(current);
  }

  public async resumePendingAudio(): Promise<AudioPlaybackResult | undefined> {
    if (this.pendingMusicId !== undefined) {
      return this.playMusic(this.pendingMusicId);
    }

    if (this.currentMusic !== undefined && this.currentMusic.element.paused) {
      return this.resumeMusic();
    }

    return undefined;
  }

  public stopMusic(fade = true): void {
    const current = this.currentMusic;
    if (current === undefined) {
      return;
    }

    ++this.transitionToken;
    this.pendingMusicId = undefined;
    this.currentMusic = undefined;
    this.clearFadeTimer();

    if (!fade || this.crossfadeDurationMs === 0) {
      current.element.pause();
      current.element.currentTime = 0;
      current.element.volume = this.effectiveVolume(current.definition);
      return;
    }

    const startVolume = current.element.volume;
    const startedAt = Date.now();
    this.fadeTimer = setInterval(() => {
      const progress = Math.min(1, (Date.now() - startedAt) / this.crossfadeDurationMs);
      current.element.volume = startVolume * (1 - progress);
      if (progress >= 1) {
        this.clearFadeTimer();
        current.element.pause();
        current.element.currentTime = 0;
        current.element.volume = this.effectiveVolume(current.definition);
      }
    }, 50);
  }

  public async playSfx(id: AudioAssetId): Promise<AudioPlaybackResult> {
    const definition = getAudioAsset(id);
    if (definition.kind !== 'sfx') {
      return { id, played: false, reason: 'invalid' };
    }

    const now = Date.now();
    const lastPlayedAt = this.lastSfxAt.get(id);
    if (lastPlayedAt !== undefined && now - lastPlayedAt < this.duplicateWindowMs) {
      return { id, played: false, reason: 'duplicate' };
    }
    this.lastSfxAt.set(id, now);

    const voice = this.acquireSfxVoice(id);
    if (voice === 'limit') {
      return { id, played: false, reason: 'limit' };
    }
    if (voice === undefined) {
      this.playProvisionalUiFeedback(id);
      return { id, played: false, reason: this.runtimeReason(id) };
    }

    voice.element.currentTime = 0;
    voice.element.loop = false;
    voice.element.volume = this.effectiveVolume(definition);
    this.activeSfx.add(voice);
    const result = await this.startVoice(voice);

    if (!result.played) {
      this.activeSfx.delete(voice);
      this.playProvisionalUiFeedback(id);
    }

    return result;
  }

  public stopAllSfx(): void {
    for (const voice of this.activeSfx) {
      voice.element.pause();
      voice.element.currentTime = 0;
    }
    this.activeSfx.clear();
  }

  public preload(ids: readonly AudioAssetId[] = AUDIO_ASSET_MANIFEST.map((asset) => asset.id)): void {
    for (const id of ids) {
      const definition = getAudioAsset(id);
      const voice = definition.kind === 'music' ? this.getMusicVoice(id) : this.getPreloadSfxVoice(id);
      if (voice === undefined) {
        continue;
      }

      this.updateDiagnostic(id, 'loading');
      try {
        voice.element.load();
      } catch (error) {
        this.handleVoiceError(voice, error);
      }
    }
  }

  public playGameEvents(events: readonly AudioGameEvent[]): void {
    for (const id of audioAssetsForEvents(events)) {
      void this.playSfx(id);
    }
  }

  public playCombatPlayback(playback: AudioCombatPlayback, context: AudioCardContext): void {
    for (const id of audioAssetsForCombatPlayback(playback, context)) {
      void this.playSfx(id);
    }
  }

  public dispose(): void {
    this.stopMusic(false);
    this.stopAllSfx();
    this.clearFadeTimer();
    this.settingsListeners.clear();
    if (this.provisionalContext !== undefined) {
      void this.provisionalContext.close();
      this.provisionalContext = undefined;
    }
  }

  private updateSettings(changes: Partial<AudioMixSettings>): void {
    this.settings = { ...this.settings, ...changes };
    this.persistSettings();
    this.applyVolumes();
    for (const listener of this.settingsListeners) {
      listener();
    }
  }

  private persistSettings(): void {
    if (this.storage === undefined) {
      return;
    }

    try {
      this.storage.setItem(AUDIO_SETTINGS_STORAGE_KEY, JSON.stringify(this.settings));
    } catch {
      // Preferences are best-effort when storage is disabled or unavailable.
    }
  }

  private effectiveVolume(definition: AudioAssetDefinition): number {
    if (this.settings.muted) {
      return 0;
    }

    const busVolume = definition.bus === 'music'
      ? this.settings.music
      : definition.bus === 'ui'
        ? this.settings.ui
        : this.settings.sfx;

    return clampVolume(this.settings.master * busVolume * definition.gain);
  }

  private applyVolumes(): void {
    if (this.currentMusic !== undefined) {
      this.currentMusic.element.volume = this.effectiveVolume(this.currentMusic.definition);
    }
    for (const voice of this.activeSfx) {
      voice.element.volume = this.effectiveVolume(voice.definition);
    }
  }

  private canUseAudio(): boolean {
    if (this.audioFactory !== defaultAudioFactory) {
      return true;
    }

    return typeof window !== 'undefined' && typeof window.Audio === 'function' && !isJsdomRuntime();
  }

  private getMusicVoice(id: AudioAssetId): AudioVoice | undefined {
    const existing = this.musicVoices.get(id);
    if (existing !== undefined) {
      return existing;
    }

    const voice = this.createVoice(id, true);
    if (voice !== undefined) {
      this.musicVoices.set(id, voice);
    }
    return voice;
  }

  private getPreloadSfxVoice(id: AudioAssetId): AudioVoice | undefined {
    const voices = this.sfxVoices.get(id);
    const existing = voices?.[0];
    if (existing !== undefined) {
      return existing;
    }

    const voice = this.createVoice(id, false);
    if (voice !== undefined) {
      this.sfxVoices.set(id, [voice]);
    }
    return voice;
  }

  private acquireSfxVoice(id: AudioAssetId): SfxVoiceAcquisition {
    const voices = this.sfxVoices.get(id) ?? [];
    const available = voices.find((voice) => !this.activeSfx.has(voice));
    if (available !== undefined) {
      return available;
    }

    if (this.activeSfx.size >= this.maxConcurrentSfx) {
      this.updateDiagnostic(id, 'ready', 'Efeito ignorado: limite de sons simultâneos atingido.');
      return 'limit';
    }

    const voice = this.createVoice(id, false);
    if (voice === undefined) {
      return undefined;
    }

    voices.push(voice);
    this.sfxVoices.set(id, voices);
    return voice;
  }

  private createVoice(id: AudioAssetId, isMusic: boolean): AudioVoice | undefined {
    const definition = getAudioAsset(id);
    if (!this.canUseAudio()) {
      this.updateDiagnostic(id, 'unsupported', 'A API de áudio não está disponível neste ambiente.');
      return undefined;
    }

    try {
      const element = this.audioFactory();
      element.preload = 'auto';
      element.src = definition.path;
      element.loop = definition.loop;
      element.volume = this.effectiveVolume(definition);
      const voice: AudioVoice = { id, definition, element, isMusic };
      element.addEventListener('canplaythrough', () => this.updateDiagnostic(id, 'ready'));
      element.addEventListener('loadeddata', () => this.updateDiagnostic(id, 'ready'));
      element.addEventListener('ended', () => this.activeSfx.delete(voice));
      element.addEventListener('error', (event) => this.handleVoiceError(voice, event));
      this.updateDiagnostic(id, 'loading');
      return voice;
    } catch (error) {
      this.updateDiagnostic(id, 'error', this.errorMessage(error));
      return undefined;
    }
  }

  private async startVoice(voice: AudioVoice): Promise<AudioPlaybackResult> {
    try {
      const playResult = voice.element.play();
      await Promise.resolve(playResult);
      this.updateDiagnostic(voice.id, 'ready');
      return { id: voice.id, played: true, reason: 'played' };
    } catch (error) {
      const reason = this.handleVoiceError(voice, error);
      return { id: voice.id, played: false, reason };
    }
  }

  private handleVoiceError(voice: AudioVoice, error: unknown): AudioPlaybackReason {
    const blocked = this.isAutoplayError(error);
    this.updateDiagnostic(voice.id, blocked ? 'blocked' : 'missing', this.errorMessage(error));
    if (blocked && voice.isMusic) {
      this.pendingMusicId = voice.id;
    }

    return blocked ? 'blocked' : 'missing';
  }

  private runtimeReason(id: AudioAssetId): AudioPlaybackReason {
    const status = this.diagnostics.get(id)?.status;
    return status === 'blocked'
      ? 'blocked'
      : status === 'missing' || status === 'error'
        ? 'missing'
        : status === 'unsupported'
          ? 'unsupported'
          : 'error';
  }

  private updateDiagnostic(id: AudioAssetId, status: AudioRuntimeStatus, message?: string): void {
    const definition = getAudioAsset(id);
    const previous = this.diagnostics.get(id);
    const diagnostic: AudioDiagnostic = {
      id,
      path: definition.path,
      manifestStatus: definition.status,
      status,
      ...(message === undefined ? {} : { message })
    };
    this.diagnostics.set(id, diagnostic);

    if (
      this.diagnosticsEnabled
      && (previous?.status !== status || previous?.message !== message)
    ) {
      this.logger(`[SOULS audio] ${id} (${definition.path}): ${message ?? status}.`);
    }
  }

  private errorMessage(error: unknown): string {
    if (error instanceof Error && error.message.length > 0) {
      return error.message;
    }
    return 'O ficheiro de áudio não pôde ser carregado ou reproduzido.';
  }

  private isAutoplayError(error: unknown): boolean {
    if (error instanceof DOMException) {
      return error.name === 'NotAllowedError' || error.name === 'AbortError';
    }
    return typeof error === 'object'
      && error !== null
      && 'name' in error
      && ((error as { readonly name?: unknown }).name === 'NotAllowedError'
        || (error as { readonly name?: unknown }).name === 'AbortError');
  }

  private crossfade(previous: AudioVoice, target: AudioVoice, token: number): void {
    if (this.crossfadeDurationMs === 0) {
      previous.element.pause();
      previous.element.currentTime = 0;
      target.element.volume = this.effectiveVolume(target.definition);
      return;
    }

    const previousVolume = previous.element.volume;
    const targetVolume = this.effectiveVolume(target.definition);
    const startedAt = Date.now();
    this.fadeTimer = setInterval(() => {
      if (token !== this.transitionToken) {
        this.clearFadeTimer();
        return;
      }

      const progress = Math.min(1, (Date.now() - startedAt) / this.crossfadeDurationMs);
      previous.element.volume = previousVolume * (1 - progress);
      target.element.volume = targetVolume * progress;
      if (progress >= 1) {
        this.clearFadeTimer();
        previous.element.pause();
        previous.element.currentTime = 0;
        target.element.volume = this.effectiveVolume(target.definition);
      }
    }, 50);
  }

  private clearFadeTimer(): void {
    if (this.fadeTimer !== undefined) {
      clearInterval(this.fadeTimer);
      this.fadeTimer = undefined;
    }
  }

  private playProvisionalUiFeedback(id: AudioAssetId): void {
    if (!this.provisionalUiFeedback || !isUiFeedbackAsset(id) || typeof window === 'undefined') {
      return;
    }

    const AudioContextConstructor = window.AudioContext;
    if (typeof AudioContextConstructor !== 'function') {
      return;
    }

    try {
      this.provisionalContext ??= new AudioContextConstructor();
      const context = this.provisionalContext;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const now = context.currentTime;
      const frequency = id === 'sfx.ui.hover' ? 360 : id === 'sfx.card.select' ? 620 : 480;
      const duration = id === 'sfx.ui.hover' ? 0.045 : 0.08;

      oscillator.type = id === 'sfx.ui.click' ? 'square' : 'sine';
      oscillator.frequency.setValueAtTime(frequency, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, this.effectiveVolume(getAudioAsset(id))), now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + duration);
      void context.resume();
    } catch {
      // Provisional feedback is optional and must never affect the game.
    }
  }
}

export { AUDIO_SETTINGS_STORAGE_KEY };
