import { afterEach, describe, expect, it, vi } from 'vitest';
import { AudioManager, AUDIO_SETTINGS_STORAGE_KEY, type AudioStorage } from './audioManager';

type Listener = (event: Event) => void;

class FakeAudioElement {
  public src = '';
  public volume = 1;
  public loop = false;
  public preload = '';
  public currentTime = 0;
  public paused = true;
  public playCalls = 0;
  public pauseCalls = 0;
  public shouldRejectPlay = false;
  public playError: Error | undefined;
  private readonly listeners = new Map<string, Set<Listener>>();

  public play(): Promise<void> {
    this.playCalls += 1;
    if (this.shouldRejectPlay || this.playError !== undefined) {
      return Promise.reject(this.playError ?? new Error('file missing'));
    }
    this.paused = false;
    return Promise.resolve();
  }

  public pause(): void {
    this.pauseCalls += 1;
    this.paused = true;
  }

  public load(): void {
    this.emit('loadeddata');
  }

  public addEventListener(type: string, listener: Listener): void {
    const listeners = this.listeners.get(type) ?? new Set<Listener>();
    listeners.add(listener);
    this.listeners.set(type, listeners);
  }

  public removeEventListener(type: string, listener: Listener): void {
    this.listeners.get(type)?.delete(listener);
  }

  public emit(type: string): void {
    for (const listener of this.listeners.get(type) ?? []) listener(new Event(type));
  }
}

function createStorage(initial: Record<string, string> = {}): AudioStorage {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value)
  };
}

function createManager(
  options: Partial<ConstructorParameters<typeof AudioManager>[0]> = {}
): { readonly manager: AudioManager; readonly elements: FakeAudioElement[] } {
  const elements: FakeAudioElement[] = [];
  const manager = new AudioManager({
    audioFactory: () => {
      const element = new FakeAudioElement();
      elements.push(element);
      return element as unknown as HTMLAudioElement;
    },
    crossfadeDurationMs: 100,
    ...options
  });
  return { manager, elements };
}

afterEach(() => {
  vi.useRealTimers();
});

describe('AudioManager', () => {
  it('loads persisted mix settings and applies mute without changing volumes', () => {
    const storage = createStorage({
      [AUDIO_SETTINGS_STORAGE_KEY]: JSON.stringify({ master: 0.8, music: 0.5, sfx: 0.6, ui: 0.4, muted: false })
    });
    const { manager, elements } = createManager({ storage });

    manager.setMusicVolume(0.5);
    void manager.playMusic('music.menu');

    return Promise.resolve().then(() => {
      expect(manager.getSettings().master).toBe(0.8);
      expect(elements[0]?.volume).toBeCloseTo(0.32);
      manager.setMuted(true);
      expect(elements[0]?.volume).toBe(0);
      manager.setMuted(false);
      expect(elements[0]?.volume).toBeCloseTo(0.32);
      expect(JSON.parse(storage.getItem(AUDIO_SETTINGS_STORAGE_KEY) ?? '{}')).toMatchObject({ muted: false });
    });
  });

  it('reuses a music element and crossfades to a new context', async () => {
    vi.useFakeTimers();
    const { manager, elements } = createManager();

    await manager.playMusic('music.menu');
    await manager.playMusic('music.menu');
    expect(elements).toHaveLength(1);
    expect(elements[0]?.playCalls).toBe(1);
    await manager.playMusic('music.battle');
    expect(elements).toHaveLength(2);
    expect(manager.getCurrentMusicId()).toBe('music.battle');

    vi.advanceTimersByTime(120);
    expect(elements[0]?.pauseCalls).toBe(1);
    expect(elements[1]?.volume).toBeCloseTo(0.85 * 0.35);
  });

  it('plays each official result track once and keeps result music non-looping', async () => {
    const { manager, elements } = createManager();

    await manager.playMusic('music.battle');
    await manager.playMusic('music.victory');
    await manager.playMusic('music.victory');

    expect(elements).toHaveLength(2);
    expect(elements[0]?.loop).toBe(true);
    expect(elements[1]?.loop).toBe(false);
    expect(elements[1]?.playCalls).toBe(1);
    expect(manager.getCurrentMusicId()).toBe('music.victory');

    await manager.playMusic('music.defeat');

    expect(elements).toHaveLength(3);
    expect(elements[2]?.loop).toBe(false);
    expect(elements[2]?.playCalls).toBe(1);
    expect(manager.getCurrentMusicId()).toBe('music.defeat');
  });

  it('reports an unavailable asset once and keeps the game-facing call non-fatal', async () => {
    const logger = vi.fn();
    const { manager, elements } = createManager({ diagnosticsEnabled: true, logger });
    const result = await manager.playMusic('music.menu');
    expect(result.played).toBe(true);

    const element = elements[0];
    if (element === undefined) throw new Error('Expected a music element.');
    logger.mockClear();
    element.shouldRejectPlay = true;
    element.emit('error');
    element.emit('error');

    expect(manager.getDiagnostics().find((diagnostic) => diagnostic.id === 'music.menu')).toMatchObject({ status: 'missing' });
    expect(logger).toHaveBeenCalledTimes(1);
  });

  it('keeps a blocked music request pending until the first user interaction resumes it', async () => {
    const { manager, elements } = createManager();
    const autoplayError = new Error('user gesture required');
    Object.defineProperty(autoplayError, 'name', { value: 'NotAllowedError' });
    manager.preload(['music.menu']);
    const element = elements[0];
    if (element === undefined) throw new Error('Expected a music element.');
    element.playError = autoplayError;
    const blocked = await manager.playMusic('music.menu');
    const blockedRetry = await manager.resumePendingAudio();

    expect(blocked).toMatchObject({ played: false, reason: 'blocked' });
    expect(blockedRetry).toMatchObject({ played: false, reason: 'blocked' });

    element.playError = undefined;
    const resumed = await manager.resumePendingAudio();
    expect(resumed).toMatchObject({ played: true });
  });

  it('limits simultaneous effects and suppresses duplicate calls', async () => {
    const { manager } = createManager({ maxConcurrentSfx: 1, duplicateWindowMs: 1_000 });
    const first = await manager.playSfx('sfx.ui.click');
    const duplicate = await manager.playSfx('sfx.ui.click');
    const limited = await manager.playSfx('sfx.ui.hover');

    expect(first).toMatchObject({ played: true, reason: 'played' });
    expect(duplicate).toMatchObject({ played: false, reason: 'duplicate' });
    expect(limited).toMatchObject({ played: false, reason: 'limit' });
    expect(manager.getActiveSfxCount()).toBe(1);
    manager.stopAllSfx();
    expect(manager.getActiveSfxCount()).toBe(0);
  });
});
