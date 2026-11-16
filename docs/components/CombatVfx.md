# Combat VFX

## Componentes

A camada VFX vive em `apps/web` e não participa da resolução de regras:

- [LightningAttackEffect](../../apps/web/src/features/combat/presentation/LightningAttackEffect.tsx) desenha raios SVG sobre a área do tabuleiro;
- os estilos de [BoardCell](../../apps/web/src/features/game-board/presentation/BoardCell.module.css) fornecem carga do atacante, impacto e o marcador X de destruição;
- [CombatResourceFeedback](../../apps/web/src/features/match/presentation/CombatResourceFeedback.tsx) mostra dano de HP e ganho/consumo de Souls.

O [GameBoard](../../apps/web/src/features/game-board/presentation/GameBoard.tsx) monta a camada SVG dentro do `boardShell`, com `pointer-events: none`. As casas expõem âncoras DOM técnicas (`data-occupant-id`) para que as posições sejam medidas a partir dos elementos reais.

## Raios SVG

O raio é calculado a partir dos centros das cartas atacantes e do primeiro alvo relevante da troca. Quando não existe alvo, termina na extremidade correspondente ao lado adversário. O proprietário do atacante determina a direção, permitindo ataques do Jogador 1 e do Jogador 2 sem coordenadas fixas.

Ataques combinados criam ramos que convergem numa descarga única. Cada feixe tem vários fios finos, arcos secundários e amarelo elétrico, com `stroke-dashoffset`, brilho controlado e movimento progressivo.

## Destruição

A destruição visual usa o marcador X em [BoardCell.module.css](../../apps/web/src/features/game-board/presentation/BoardCell.module.css). Assim que o sequenciador identifica a destruição, o `BoardCell` deixa de montar a carta para ela não permanecer visível durante o combate. Durante `consequences`, [CardDestructionOverlay](../../apps/web/src/features/combat/presentation/CardDestructionOverlay.tsx) ocupa a casa destruída; o estado oficial continua a ser publicado apenas no fim da resolução.

## Assets de ataque

Durante as etapas `attack` e `impact`, [LightningAttackEffect](../../apps/web/src/features/combat/presentation/LightningAttackEffect.tsx) resolve o tipo da carta através de `CardInstance` e `CardDefinition` e escolhe uma única variante por coluna/troca:

- variante principal ranged: [souls_ranged_golden_lightning.webp](../../apps/web/public/images/effects/souls_ranged_golden_lightning.webp);
- variante alternativa ranged: [souls_ranged_impact.webp](../../apps/web/public/images/effects/souls_ranged_impact.webp);
- variante principal melee: [souls_melee_attack_alt.webp](../../apps/web/public/images/effects/souls_melee_attack_alt.webp);
- variante alternativa melee: [souls_melee_impact.webp](../../apps/web/public/images/effects/souls_melee_impact.webp);

Os WebP são decorativos, não recebem cliques e são sincronizados com a coluna/troca atual. Apenas uma variante é renderizada por vez; a trajetória SVG só funciona como fallback quando não existe uma definição visual conhecida.

## Recursos e ritmo

A configuração central está em [combatVfxTiming.ts](../../apps/web/src/features/combat/combatVfxTiming.ts). A velocidade 2× é propagada ao SVG, CSS e HUD; o salto conclui a apresentação e sincroniza com o estado oficial.

O HUD mostra uma barra compacta de HP, dano flutuante vermelho e valores de Souls. Estes valores vêm do trace/eventos oficiais; não são calculados pelo frontend.

## Movimento reduzido e performance

As camadas são limitadas ao `boardShell`, não capturam a página inteira e não recebem eventos de ponteiro. Com `prefers-reduced-motion`, CSS remove pulsação/viagem e mantém o feedback essencial.