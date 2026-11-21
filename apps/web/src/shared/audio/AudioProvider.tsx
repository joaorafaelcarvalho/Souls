import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import type { AudioCardContext, AudioCombatPlayback, AudioGameEvent } from './audioEvents';
import {
  AudioManager,
  type AudioManagerOptions,
  type AudioPlaybackResult
} from './audioManager';
import type { AudioAssetId, AudioMixSettings } from './audioManifest';

export interface AudioContextValue {
  readonly settings: AudioMixSettings;
  readonly diagnostics: ReturnType<AudioManager['getDiagnostics']>;
  readonly playSfx: (id: AudioAssetId) => Promise<AudioPlaybackResult>;
  readonly playMusic: (id: AudioAssetId) => Promise<AudioPlaybackResult>;
  readonly pauseMusic: () => void;
  readonly resumeMusic: () => Promise<AudioPlaybackResult | undefined>;
  readonly stopMusic: (fade?: boolean) => void;
  readonly stopAllSfx: () => void;
  readonly preload: (ids?: readonly AudioAssetId[]) => void;
  readonly playGameEvents: (events: readonly AudioGameEvent[]) => void;
  readonly playCombatPlayback: (playback: AudioCombatPlayback, context: AudioCardContext) => void;
  readonly setMasterVolume: (value: number) => void;
  readonly setMusicVolume: (value: number) => void;
  readonly setSfxVolume: (value: number) => void;
  readonly setUiVolume: (value: number) => void;
  readonly setMuted: (muted: boolean) => void;
}

function createValue(manager: AudioManager, settings: AudioMixSettings): AudioContextValue {
  return {
    settings,
    diagnostics: manager.getDiagnostics(),
    playSfx: (id) => manager.playSfx(id),
    playMusic: (id) => manager.playMusic(id),
    pauseMusic: () => manager.pauseMusic(),
    resumeMusic: () => manager.resumeMusic(),
    stopMusic: (fade) => manager.stopMusic(fade),
    stopAllSfx: () => manager.stopAllSfx(),
    preload: (ids) => manager.preload(ids),
    playGameEvents: (events) => manager.playGameEvents(events),
    playCombatPlayback: (playback, context) => manager.playCombatPlayback(playback, context),
    setMasterVolume: (value) => manager.setMasterVolume(value),
    setMusicVolume: (value) => manager.setMusicVolume(value),
    setSfxVolume: (value) => manager.setSfxVolume(value),
    setUiVolume: (value) => manager.setUiVolume(value),
    setMuted: (muted) => manager.setMuted(muted)
  };
}

const defaultAudioManager = new AudioManager({
  diagnosticsEnabled: false,
  provisionalUiFeedback: false
});

const AudioContext = createContext<AudioContextValue>(
  createValue(defaultAudioManager, defaultAudioManager.getSettings())
);

export interface AudioProviderProps extends PropsWithChildren {
  readonly manager?: AudioManager;
  readonly managerOptions?: AudioManagerOptions;
}

export function AudioProvider({ children, manager, managerOptions }: AudioProviderProps) {
  const [audioManager] = useState(() => manager ?? new AudioManager({
    diagnosticsEnabled: import.meta.env.DEV
      && (typeof navigator === 'undefined' || !/jsdom/i.test(navigator.userAgent)),
    provisionalUiFeedback: true,
    ...managerOptions
  }));
  const [settings, setSettings] = useState(() => audioManager.getSettings());

  useEffect(() => audioManager.subscribeSettings(() => setSettings(audioManager.getSettings())), [audioManager]);

  useEffect(() => {
    const resume = () => {
      void audioManager.resumePendingAudio();
    };
    document.addEventListener('pointerdown', resume, { passive: true });
    document.addEventListener('keydown', resume);
    document.addEventListener('touchstart', resume, { passive: true });

    return () => {
      document.removeEventListener('pointerdown', resume);
      document.removeEventListener('keydown', resume);
      document.removeEventListener('touchstart', resume);
    };
  }, [audioManager]);

  const value = useMemo(() => createValue(audioManager, settings), [audioManager, settings]);
  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudio(): AudioContextValue {
  return useContext(AudioContext);
}

export function useAudioClick(handler: () => void): () => void {
  const { playSfx } = useAudio();
  return useCallback(() => {
    void playSfx('sfx.ui.click');
    handler();
  }, [handler, playSfx]);
}
