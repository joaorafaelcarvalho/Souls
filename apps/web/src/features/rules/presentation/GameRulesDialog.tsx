import { useEffect, useRef, type MouseEvent } from 'react';
import styles from './GameRulesDialog.module.css';

export interface GameRulesDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
}

const boardRows = [
  { player: 'J2', label: 'Longo alcance', tone: 'ranged', side: 'opponentRow' },
  { player: 'J2', label: 'Corpo a corpo', tone: 'melee', side: 'opponentRow' },
  { player: 'J2', label: 'Defesa', tone: 'defense', side: 'opponentRow' },
  { player: 'J1', label: 'Defesa', tone: 'defense', side: 'playerRow' },
  { player: 'J1', label: 'Corpo a corpo', tone: 'melee', side: 'playerRow' },
  { player: 'J1', label: 'Longo alcance', tone: 'ranged', side: 'playerRow' }
] as const;

const phases = [
  { number: '01', title: 'Compra', text: 'A partir da segunda ronda, realizam-se duas tentativas de compra.' },
  { number: '02', title: 'Posicionamento', text: 'Retirada estratégica ou até duas colocações válidas.' },
  { number: '03', title: 'Ataque', text: 'Todas as colunas ofensivas atacam automaticamente.' }
] as const;

const invocationCosts = [
  ['Nível 0', '0 Souls'],
  ['Nível 1', '1 Soul'],
  ['Nível 2', '2 Souls'],
  ['Nível 3', '3 Souls'],
  ['Nível 4', '4 Souls']
] as const;

export function GameRulesDialog({ open, onClose }: GameRulesDialogProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className={styles.overlay}
      data-testid="game-rules-dialog"
      onMouseDown={handleBackdropClick}
    >
      <section
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-rules-title"
        aria-describedby="game-rules-intro"
      >
        <div className={styles.ambient} aria-hidden="true">
          <img src="/images/result/result-sword-crest.png" alt="" />
        </div>

        <header className={styles.header}>
          <div className={styles.brandMark} aria-hidden="true">✦</div>
          <div className={styles.headingCopy}>
            <span className={styles.eyebrow}>CÓDICE DE BATALHA · v0.7</span>
            <h2 id="game-rules-title">Regras do jogo</h2>
            <p id="game-rules-intro">Consulta rápida das regras oficiais de SOULS durante a partida.</p>
          </div>
          <button
            ref={closeButtonRef}
            className={styles.closeButton}
            type="button"
            aria-label="Fechar regras"
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className={styles.scrollArea}>
          <section className={`${styles.heroCard} ${styles.ruleSection}`}>
            <div className={styles.heroIcon} aria-hidden="true">⚔</div>
            <div>
              <span className={styles.sectionKicker}>O propósito do duelo</span>
              <h3>Reduz o HP adversário a zero.</h3>
              <p>Cada jogador começa com 10 000 HP, um baralho de 20 cartas, cinco cartas na mão e zero Souls.</p>
            </div>
            <div className={styles.heroStats} aria-label="Recursos iniciais de cada jogador">
              <span><strong>10 000</strong><small>HP inicial</small></span>
              <span><strong>20</strong><small>cartas no baralho</small></span>
              <span><strong>5</strong><small>cartas na mão</small></span>
            </div>
          </section>

          <div className={styles.ruleGrid}>
            <section className={`${styles.ruleCard} ${styles.boardCard}`}>
              <div className={styles.cardHeading}>
                <span className={styles.sectionKicker}>01 · território</span>
                <h3>O tabuleiro</h3>
              </div>
              <p>São seis linhas por quatro colunas. Cada coluna é independente e um ataque só atinge a coluna adversária correspondente.</p>
              <div className={styles.boardMap} aria-label="Mapa das zonas do tabuleiro">
                <div className={styles.boardLabels} aria-hidden="true">
                  <span>J2</span><span>J1</span>
                </div>
                <div className={styles.boardRows}>
                  {boardRows.map((row) => (
                    <div className={`${styles.boardRow} ${styles[row.side]}`} key={`${row.player}-${row.label}`}>
                      <span className={styles.rowLabel}>{row.player} · {row.label}</span>
                      <div className={styles.boardCells} aria-hidden="true">
                        {[0, 1, 2, 3].map((column) => <span className={styles[row.tone]} key={column} />)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.legend}>
                <span><i className={styles.defense} /> Defesa</span>
                <span><i className={styles.melee} /> Corpo a corpo</span>
                <span><i className={styles.ranged} /> Longo alcance</span>
              </div>
            </section>

            <section className={`${styles.ruleCard} ${styles.attributeCard}`}>
              <div className={styles.cardHeading}>
                <span className={styles.sectionKicker}>02 · anatomia</span>
                <h3>Atributos da carta</h3>
              </div>
              <div className={styles.attributeLayout}>
              <div className={styles.cardPreview} aria-hidden="true">
                <div className={styles.previewTop}><span>MELEE / RANGED</span><b>LVL 0–4</b></div>
                <div className={styles.previewImage}>✦</div>
                <strong className={styles.previewName}>NOME DA CARTA</strong>
                <div className={styles.previewStats}><span>⚔ <b>ATK</b></span><span>🛡 <b>DEF</b></span></div>
              </div>
              <dl className={styles.attributeList}>
                <div><dt>Nome</dt><dd>Identifica a carta e a sua instância no duelo.</dd></div>
                <div><dt>Tipo</dt><dd><strong>melee</strong> ou <strong>ranged</strong>; determina as casas que pode ocupar.</dd></div>
                <div><dt>Nível</dt><dd>Define o custo de invocação: do nível 0 ao 4, custa o mesmo número de Souls.</dd></div>
                <div><dt>ATK</dt><dd>Usado quando a carta está numa posição ofensiva; dois atacantes podem somar o ATK na coluna.</dd></div>
                <div><dt>DEF</dt><dd>Usado quando uma carta corpo a corpo ocupa uma casa de defesa.</dd></div>
              </dl>
              </div>
            </section>

            <section className={`${styles.ruleCard} ${styles.phaseCard}`}>
              <div className={styles.cardHeading}>
                <span className={styles.sectionKicker}>03 · ritmo</span>
                <h3>Fases do turno</h3>
              </div>
              <div className={styles.phaseList}>
                {phases.map((phase) => (
                  <div className={styles.phase} key={phase.number}>
                    <span className={styles.phaseNumber}>{phase.number}</span>
                    <div><strong>{phase.title}</strong><p>{phase.text}</p></div>
                  </div>
                ))}
              </div>
              <p className={styles.note}>A primeira ronda é exclusivamente de posicionamento: não há compra nem ataque. Se o baralho estiver vazio, cada compra falhada custa 1 Soul ou 500 HP quando não houver Souls. Não existe limite máximo de cartas na mão.</p>
            </section>

            <section className={`${styles.ruleCard} ${styles.placementCard}`}>
              <div className={styles.cardHeading}>
                <span className={styles.sectionKicker}>04 · invocação</span>
                <h3>Colocar cartas</h3>
              </div>
              <ul className={styles.ruleList}>
                <li>Uma carta <strong>melee</strong> pode ocupar defesa ou ataque corpo a corpo.</li>
                <li>Uma carta <strong>ranged</strong> só pode ocupar ataque de longo alcance.</li>
                <li>Sem retirada: no máximo uma colocação defensiva e uma ofensiva.</li>
                <li>Uma retirada voluntária consome uma ação e deixa apenas uma colocação disponível.</li>
                <li>A ordem das colocações é livre, mas as casas têm de estar vazias.</li>
                <li>O custo de invocação corresponde ao nível da carta.</li>
              </ul>
              <div className={styles.costList} aria-label="Custos de invocação por nível">
                {invocationCosts.map(([level, cost]) => <span key={level}><b>{level.replace('Nível ', '')}</b>{cost}</span>)}
              </div>
            </section>

            <section className={`${styles.ruleCard} ${styles.wideCard} ${styles.combatCard}`}>
              <div className={styles.cardHeading}>
                <span className={styles.sectionKicker}>05 · resolução automática</span>
                <h3>Como uma coluna combate</h3>
              </div>
              <div className={styles.combatFlow} aria-label="Ordem de resolução de uma coluna">
                <span><b>1</b> Defesa</span><i aria-hidden="true">›</i>
                <span><b>2</b> Corpo a corpo</span><i aria-hidden="true">›</i>
                <span><b>3</b> Longo alcance</span>
              </div>
              <div className={styles.comparisonGrid}>
                <article><strong>ATK &gt; DEF</strong><p>Defesa destruída. O ataque continua com o poder restante.</p></article>
                <article><strong>DEF &gt; ATK</strong><p>Ataque bloqueado. Nenhuma carta é destruída e não há perda de Souls ou HP.</p></article>
                <article><strong>ATK = DEF</strong><p>Empate: nenhuma carta é destruída e não há penalização.</p></article>
                <article><strong>ATK contra ATK</strong><p>Compara-se o ataque combinado com o ATK individual. A diferença causa HP; num ataque perdido, apenas o melee é destruído quando existem dois atacantes.</p></article>
              </div>
              <p className={styles.note}>Todas as colunas ofensivas atacam obrigatoriamente pela ordem 0, 1, 2 e 3. Sem defensores na coluna, o poder restante causa dano direto.</p>
            </section>

            <section className={`${styles.ruleCard} ${styles.resourceCard}`}>
              <div className={styles.cardHeading}>
                <span className={styles.sectionKicker}>06 · recurso espiritual</span>
                <h3>Souls e descarte</h3>
              </div>
              <ul className={styles.ruleList}>
                <li>O máximo acumulado é de <strong>5 Souls</strong>.</li>
                <li>Cada carta destruída em combate concede 1 Soul ao seu proprietário, respeitando o limite.</li>
                <li>Souls servem para invocar e absorver penalizações de compras falhadas.</li>
                <li>Cartas destruídas ou retiradas vão para o descarte e não regressam à mão ou ao baralho.</li>
                <li>Uma retirada voluntária concede 1 Soul, respeitando o máximo de 5.</li>
              </ul>
            </section>

            <section className={`${styles.ruleCard} ${styles.victoryCard}`}>
              <div className={styles.cardHeading}>
                <span className={styles.sectionKicker}>07 · retirada e vitória</span>
                <h3>Últimos momentos</h3>
              </div>
              <ul className={styles.ruleList}>
                <li>É possível retirar uma carta sua por turno, antes de qualquer colocação.</li>
                <li>A retirada é definitiva, concede 1 Soul e deixa apenas uma colocação disponível.</li>
                <li>A partida termina imediatamente quando um jogador chega a zero ou menos HP.</li>
                <li>Todas as ações e ataques pendentes são cancelados.</li>
              </ul>
              <div className={styles.victorySeal} aria-hidden="true"><span>SOULS</span><small>duelo até ao fim</small></div>
            </section>
          </div>
        </div>

        <footer className={styles.footer}>
          <span>Regulamento oficial SOULS v0.7</span>
          <button className={styles.footerButton} type="button" onClick={onClose}>Fechar códice</button>
        </footer>
      </section>
    </div>
  );
}
