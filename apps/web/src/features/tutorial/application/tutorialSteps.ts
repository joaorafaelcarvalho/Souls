export type TutorialCardKey =
  | 'cavaleiro'
  | 'defensor'
  | 'arqueiro'
  | 'mago'
  | 'cavaleiro-negro'
  | 'cacadora-lua-palida'
  | 'matriarca-selos'
  | 'rei-exilado';
export type TutorialZone = 'defense' | 'melee' | 'ranged';

export type TutorialStepKind = 'zones' | 'card-selection' | 'placement' | 'retirement' | 'explain' | 'draw' | 'combat' | 'challenge';

export interface TutorialStep {
  readonly id: string;
  readonly number: number;
  readonly title: string;
  readonly description: string;
  readonly objective: string;
  readonly kind: TutorialStepKind;
  readonly targetCard?: TutorialCardKey;
  readonly targetRow?: 3 | 4 | 5;
}

export const TUTORIAL_STEPS: readonly TutorialStep[] = [
  {
    id: 'welcome',
    number: 1,
    title: 'Bem-vindo ao SOULS',
    description: 'Cada carta é um guerreiro. Cada decisão pode determinar o destino da batalha.',
    objective: 'Conhecer o objetivo do tutorial.',
    kind: 'explain'
  },
  {
    id: 'board',
    number: 2,
    title: 'Conhece o tabuleiro',
    description: 'Explora as zonas de defesa, combate corpo a corpo e longo alcance.',
    objective: 'Selecionar as três zonas do tabuleiro.',
    kind: 'zones'
  },
  {
    id: 'cards',
    number: 3,
    title: 'Conhece as cartas',
    description: 'Seleciona o Cavaleiro para abrir um painel dedicado com os seus atributos e compreender a anatomia de uma carta.',
    objective: 'Selecionar o Cavaleiro e consultar o painel de atributos.',
    kind: 'card-selection',
    targetCard: 'cavaleiro'
  },
  {
    id: 'melee-placement',
    number: 4,
    title: 'Posiciona uma carta melee',
    description: 'Seleciona o Cavaleiro e coloca-o numa célula de combate corpo a corpo.',
    objective: 'Posicionar 1 carta melee na linha melee.',
    kind: 'placement',
    targetCard: 'cavaleiro',
    targetRow: 4
  },
  {
    id: 'defense',
    number: 5,
    title: 'Prepara a defesa',
    description: 'Coloca o Defensor numa posição defensiva para proteger a tua coluna.',
    objective: 'Posicionar 1 carta na linha de defesa.',
    kind: 'placement',
    targetCard: 'defensor',
    targetRow: 3
  },
  {
    id: 'ranged-placement',
    number: 6,
    title: 'Prepara um ataque à distância',
    description: 'Seleciona o Arqueiro e posiciona-o na tua linha ranged.',
    objective: 'Posicionar 1 carta ranged na linha ranged.',
    kind: 'placement',
    targetCard: 'arqueiro',
    targetRow: 5
  },
  {
    id: 'turns',
    number: 7,
    title: 'Compreende os turnos',
    description: 'A primeira ronda é dedicada ao posicionamento. Nas rondas seguintes, cada turno segue uma ordem fixa.',
    objective: 'Reconhecer a ordem das fases.',
    kind: 'explain'
  },
  {
    id: 'draw',
    number: 8,
    title: 'Compra normal',
    description: 'A partir da segunda ronda, o jogador ativo realiza obrigatoriamente duas tentativas de compra.',
    objective: 'Efetuar as duas compras oficiais.',
    kind: 'draw'
  },
  {
    id: 'draw-failed',
    number: 9,
    title: 'Baralho esgotado',
    description: 'Quando não há cartas nem Souls, cada tentativa de compra falhada custa 500 HP. Observa as duas penalizações separadamente.',
    objective: 'Observar duas compras falhadas e duas atualizações de -500 HP.',
    kind: 'draw'
  },
  {
    id: 'draw-soul',
    number: 10,
    title: 'Soul antes de HP',
    description: 'Uma Soul disponível absorve a primeira falha de compra. A segunda falha, já sem Souls, custa 500 HP.',
    objective: 'Observar o consumo automático da Soul e a penalização seguinte.',
    kind: 'draw'
  },
  {
    id: 'combat',
    number: 11,
    title: 'Observa o combate',
    description: 'Os ataques são resolvidos automaticamente por colunas, começando pela defesa adversária.',
    objective: 'Resolver um combate através do motor oficial.',
    kind: 'combat'
  },
  {
    id: 'combined',
    number: 12,
    title: 'Ataques combinados',
    description: 'Uma carta melee e uma carta ranged na mesma coluna somam o seu ATK num único ataque contra um Cavaleiro adversário.',
    objective: 'Observar o Cavaleiro adversário ser destruído e o HP adversário diminuir.',
    kind: 'combat'
  },
  {
    id: 'souls',
    number: 13,
    title: 'Invoca com Souls',
    description: 'O custo de invocação corresponde ao nível. Neste cenário de treino tens 2 Souls para invocar uma carta oficial de nível 2.',
    objective: 'Invocar a Caçadora da Lua Pálida e observar o custo de 2 Souls.',
    kind: 'placement',
    targetCard: 'cacadora-lua-palida',
    targetRow: 5
  },
  {
    id: 'levels',
    number: 14,
    title: 'Conhece os níveis superiores',
    description: 'Compara uma carta N3 e uma N4. Níveis maiores exigem mais Souls, mas permitem preparar cartas mais poderosas para fases posteriores.',
    objective: 'Inspecionar a Matriarca dos Selos N3 e comparar o Rei Exilado N4.',
    kind: 'card-selection',
    targetCard: 'matriarca-selos'
  },
  {
    id: 'retirement',
    number: 15,
    title: 'Soul Harvest',
    description: 'Podes retirar uma carta própria do campo antes das colocações. A retirada consome uma ação, concede 1 Soul e deixa apenas uma colocação disponível.',
    objective: 'Selecionar a carta no campo e executar uma retirada estratégica.',
    kind: 'retirement',
    targetRow: 4
  },
  {
    id: 'victory',
    number: 16,
    title: 'Duelo final',
    description: 'Aplica o que aprendeste: escolhe cartas, posiciona um ataque legal, termina o posicionamento e resolve a coluna contra um defensor adversário.',
    objective: 'Posicionar pelo menos um atacante e resolver o duelo final pelo motor oficial.',
    kind: 'challenge'
  }
];
