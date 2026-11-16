import type { TutorialStep, TutorialZone } from '../application/tutorialSteps';
import styles from './TutorialInstructionPanel.module.css';

export interface TutorialInstructionPanelProps {
  readonly step: TutorialStep;
  readonly stepIndex: number;
  readonly totalSteps: number;
  readonly message: string;
  readonly stepCompleted: boolean;
  readonly canAdvance: boolean;
  readonly isCombatAnimating: boolean;
  readonly exploredZones: ReadonlySet<TutorialZone>;
  readonly highlightedZone: TutorialZone | null;
  readonly onExploreZone: (zone: TutorialZone) => void;
  readonly onAction: () => void;
  readonly onAdvance: () => void;
  readonly onExit: () => void;
}

export function TutorialInstructionPanel({
  step,
  stepIndex,
  totalSteps,
  message,
  stepCompleted,
  canAdvance,
  isCombatAnimating,
  exploredZones,
  highlightedZone,
  onExploreZone,
  onAction,
  onAdvance,
  onExit
}: TutorialInstructionPanelProps) {
  const showAction = !stepCompleted && !isCombatAnimating && ['draw', 'combat', 'retirement'].includes(step.kind);
  const showAdvance = stepCompleted || canAdvance;

  return (
    <section className={styles.panel} aria-label="Instruções do tutorial" data-testid="tutorial-instructions">
      <div className={styles.topline}>
        <span>ETAPA {String(stepIndex + 1).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}</span>
        <span className={stepCompleted ? styles.complete : ''}>{stepCompleted ? 'CONCLUÍDA' : 'EM CURSO'}</span>
      </div>
      <progress className={styles.progress} value={stepIndex + (stepCompleted ? 1 : 0)} max={totalSteps} aria-label="Progresso do tutorial" />
      <p className={styles.eyebrow}>SOULS · TUTORIAL INTERATIVO</p>
      <h2>{step.title}</h2>
      <p className={styles.description}>{step.description}</p>
      <div className={styles.objective}>
        <span className={styles.objectiveLabel}>OBJETIVO</span>
        <strong>{step.objective}</strong>
      </div>

      {step.id === 'board' ? (
        <div className={styles.zoneButtons} aria-label="Explorar zonas do tabuleiro">
          {(['defense', 'melee', 'ranged'] as const).map((zone) => (
            <button
              className={[exploredZones.has(zone) ? styles.zoneVisited : '', highlightedZone === zone ? styles.zoneActive : ''].filter(Boolean).join(' ')}
              key={zone}
              type="button"
              onClick={() => onExploreZone(zone)}
            >
              {zone === 'defense' ? 'DEFESA' : zone.toUpperCase()}
            </button>
          ))}
        </div>
      ) : null}

      {step.id === 'turns' ? (
        <div className={styles.turnOrder} aria-label="Esquema da ordem dos turnos">
          <div className={styles.firstRound}>
            <span>RONDA 1</span>
            <strong>POSICIONAMENTO</strong>
          </div>
          <div className={styles.turnFlow}>
            <span><b>01</b> COMPRA</span>
            <i aria-hidden="true">›</i>
            <span><b>02</b> POSICIONAMENTO</span>
            <i aria-hidden="true">›</i>
            <span><b>03</b> ATAQUE</span>
          </div>
          <small>Depois da primeira ronda, cada jogador percorre estas três fases pela mesma ordem.</small>
        </div>
      ) : null}

      <p className={`${styles.message} ${stepCompleted ? styles.success : ''}`} role="status">{message}</p>

      <div className={styles.actions}>
        {showAction ? (
          <button className={styles.primary} type="button" onClick={onAction}>
            {step.kind === 'draw' ? 'Efetuar duas compras' : step.kind === 'retirement' ? 'Retirar carta · +1 Soul' : 'Resolver ataque'}
          </button>
        ) : null}
        {showAdvance ? (
          <button className={styles.primary} type="button" onClick={onAdvance}>Continuar</button>
        ) : null}
        <button className={styles.secondary} type="button" onClick={onExit}>Voltar ao menu</button>
      </div>
    </section>
  );
}
