import { useAudio } from './AudioProvider';
import styles from './AudioSettingsPanel.module.css';

export interface AudioSettingsPanelProps {
  readonly open: boolean;
  readonly onClose: () => void;
}

function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function AudioSettingsPanel({ open, onClose }: AudioSettingsPanelProps) {
  const {
    settings,
    setMasterVolume,
    setMusicVolume,
    setSfxVolume,
    setMuted,
    playSfx
  } = useAudio();

  if (!open) {
    return null;
  }

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className={styles.panel} role="dialog" aria-modal="true" aria-labelledby="audio-settings-title">
        <p className={styles.eyebrow}>SOULS · ÁUDIO</p>
        <h2 className={styles.title} id="audio-settings-title">Definições de áudio</h2>
        <div className={styles.controls}>
          <label className={styles.control}>
            <span className={styles.label}><span>Volume geral</span><output>{percent(settings.master)}</output></span>
            <input
              className={styles.range}
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.master}
              aria-label="Volume geral"
              onChange={(event) => setMasterVolume(Number(event.target.value))}
            />
          </label>
          <label className={styles.control}>
            <span className={styles.label}><span>Música</span><output>{percent(settings.music)}</output></span>
            <input
              className={styles.range}
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.music}
              aria-label="Volume da música"
              onChange={(event) => setMusicVolume(Number(event.target.value))}
            />
          </label>
          <label className={styles.control}>
            <span className={styles.label}><span>Efeitos</span><output>{percent(settings.sfx)}</output></span>
            <input
              className={styles.range}
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.sfx}
              aria-label="Volume dos efeitos"
              onChange={(event) => setSfxVolume(Number(event.target.value))}
            />
          </label>
          <label className={styles.mute}>
            <input
              type="checkbox"
              checked={settings.muted}
              aria-label="Silenciar todo o áudio"
              onChange={(event) => setMuted(event.target.checked)}
            />
            <span>Silenciar todo o áudio</span>
          </label>
        </div>
        <div className={styles.actions}>
          <button className={styles.button} type="button" onClick={() => {
            void playSfx('sfx.ui.click');
            onClose();
          }}>
            Fechar
          </button>
        </div>
      </section>
    </div>
  );
}
