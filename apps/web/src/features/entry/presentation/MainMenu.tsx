import { useState } from 'react';
import { GameRulesDialog } from '../../rules/presentation/GameRulesDialog';
import styles from './MainMenu.module.css';

export interface MainMenuProps {
  readonly onOpenModes: () => void;
  readonly onCodex: () => void;
  readonly onDeckBuilder?: () => void;
  readonly transitioning?: boolean;
}

export function MainMenu({ onOpenModes, onCodex, onDeckBuilder, transitioning = false }: MainMenuProps) {
  const [rulesOpen, setRulesOpen] = useState(false);

  return (
    <main className={`${styles.screen} ${transitioning ? styles.leaving : ''}`} data-testid="main-menu" aria-label="Menu principal SOULS">
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.ambient} aria-hidden="true">
        <img className={styles.menuBanner} src="/images/branding/souls-menu-banner.png" alt="" />
        <span className={styles.moonGlow} />
        <span className={styles.spiritGlow} />
      </div>

      <div className={styles.content}>
        <span className={styles.eyebrow}>FASE 0 · PROTÓTIPO TÉCNICO</span>
        <img className={styles.logo} src="/images/branding/souls-logo.png" alt="SOULS" />
        <p className={styles.tagline}>As almas nunca descansam.</p>

        <nav className={styles.menu} aria-label="Menu principal">
          <button className={styles.menuButton} type="button" onClick={onOpenModes}>
            <span>JOGAR</span>
            <small>ESCOLHER MODO</small>
          </button>
          <button className={styles.menuButton} type="button" onClick={onCodex}>
            <span>CÓDICE DAS ALMAS</span>
            <small>CONSULTAR AS CARTAS</small>
          </button>
          {onDeckBuilder === undefined ? null : (
            <button className={styles.menuButton} type="button" onClick={onDeckBuilder}>
              <span>DECK BUILDER</span>
              <small>CONSTRUIR BARALHOS</small>
            </button>
          )}
          <button className={styles.menuButton} type="button" disabled aria-disabled="true">
            <span>CONFIGURAÇÕES</span>
            <small>EM BREVE</small>
          </button>
          <button className={styles.menuButton} type="button" onClick={() => setRulesOpen(true)}>
            <span>REGRAS DO JOGO</span>
            <small>CONSULTAR O CÓDICE</small>
          </button>
        </nav>
      </div>

      <footer className={styles.footer}>SOULS · PROTÓTIPO LOCAL</footer>
      <GameRulesDialog open={rulesOpen} onClose={() => setRulesOpen(false)} />
    </main>
  );
}
