import styles from './GameModeMenu.module.css';

export interface GameModeMenuProps {
  readonly onLocalGame: () => void;
  readonly onPve: () => void;
  readonly onOnline?: () => void;
  readonly onTutorial: () => void;
  readonly onBack: () => void;
}

export function GameModeMenu({ onLocalGame, onPve, onOnline, onTutorial, onBack }: GameModeMenuProps) {
  return (
    <main className={styles.screen} data-testid="game-mode-menu" aria-label="Escolher modo de jogo">
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.content}>
        <p className={styles.eyebrow}>SOULS · MODOS DE JOGO</p>
        <img className={styles.logo} src="/images/branding/souls-logo.png" alt="SOULS" />
        <h1>ESCOLHE O TEU DUELO</h1>
        <p className={styles.subtitle}>Seleciona a forma como queres entrar no campo de batalha.</p>
        <nav className={styles.menu} aria-label="Modos de jogo">
          <button className={styles.button} type="button" onClick={onLocalGame}>
            <span>PVP LOCAL</span>
            <small>PARTIDA NORMAL</small>
          </button>
          <button className={styles.button} type="button" onClick={onPve}>
            <span>JOGADOR VS IA</span>
            <small>ENFRENTAR A INTELIGÊNCIA ARTIFICIAL</small>
          </button>
          {onOnline === undefined ? null : (
            <button className={styles.button} type="button" onClick={onOnline}>
              <span>PVP ONLINE</span>
              <small>SALA PRIVADA EM TEMPO REAL</small>
            </button>
          )}
          <button className={styles.button} type="button" onClick={onTutorial}>
            <span>TUTORIAL</span>
            <small>APRENDER A JOGAR</small>
          </button>
          <button className={styles.button} type="button" onClick={onBack}>VOLTAR</button>
        </nav>
      </div>
      <footer className={styles.footer}>SOULS · PROTÓTIPO LOCAL</footer>
    </main>
  );
}
