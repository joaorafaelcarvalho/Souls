# Estilos frontend

## Direção visual

A apresentação segue a identidade [Dark Fantasy Medieval](../visual-identity.md), com tokens semânticos em [tokens.css](../../apps/web/src/shared/styles/tokens.css).

## Composição espacial

A composição principal em [App.module.css](../../apps/web/src/App.module.css) usa três colunas em ecrãs largos:

- estado do jogador 2 no canto superior esquerdo;
- tabuleiro na coluna central, esticada até ao espaço disponível;
- título do jogo e informações da ronda na coluna direita;
- mão e seleção na faixa inferior, com o status do jogador 1 alinhado à direita.

Isto evita um contentor central estreito com espaço morto lateral. Abaixo de 62rem, a composição passa para uma coluna responsiva.

## Tokens

A paleta inclui:

- canvas #0C0E12;
- superfícies #171A20 e #23262F;
- texto marfim;
- dourado antigo e bronze;
- violeta Souls;
- vermelho danger;
- defesa azul-pedra;
- melee castanho-ferro;
- ranged verde-pedra.

Gradientes e sombras criam profundidade sem depender de texturas externas.

## CSS Modules

- [App.module.css](../../apps/web/src/App.module.css): composição de três colunas, HUD e faixa inferior;
- [GameBoard.module.css](../../apps/web/src/features/game-board/presentation/GameBoard.module.css): moldura e dimensionamento;
- [BoardCell.module.css](../../apps/web/src/features/game-board/presentation/BoardCell.module.css): zonas e estados;
- [Card.module.css](../../apps/web/src/features/cards/presentation/Card.module.css): variantes de carta;
- [PlayerStatus.module.css](../../apps/web/src/features/match/presentation/PlayerStatus.module.css): HUD;
- [PlayerHand.module.css](../../apps/web/src/features/match/presentation/PlayerHand.module.css): mão horizontal;
- [global.css](../../apps/web/src/shared/styles/global.css): tokens, canvas e reduced motion.

## Layout compacto de partida

O layout desktop continua ativo acima de 64rem. Entre 48rem e 64rem a interface usa a composição tablet; abaixo de 48rem usa a composição mobile. Os breakpoints dependem da largura efetiva do viewport, não de user-agent.

Nos dois modos compactos:

- a barra superior concentra logo, Regras, Voltar e o controlo de ação existente;
- o `GameBoard` ocupa a área entre a barra e o botão da mão, mantendo o cálculo 6×4 por largura e altura através de `ResizeObserver`;
- J2 e J1 ficam em faixas próprias entre a moldura e a grelha, respetivamente superior esquerda e inferior direita, com HP e Souls condensados;
- o `MatchLog` deixa de reservar espaço, mas continua alimentado no estado da partida;
- a mão permanece fora do fluxo normal, abre em drawer horizontal com scroll e fecha pelo botão ou pelo backdrop;
- inspeção, colocação e Soul Harvest usam os comandos e a validação já existentes.

Os limites verticais usam `dvh` e `safe-area-inset-*`. A abertura do drawer e dos diálogos usa camadas fixas, por isso não altera a caixa nem a posição calculada do tabuleiro. `prefers-reduced-motion` continua a remover as transições através dos estilos globais.

## Regras

- use tokens semânticos;
- mantenha estilos específicos junto do componente;
- não coloque regras de combate em CSS;
- não transforme placeholders em arte final;
- não permita que sombras, hover ou escala alterem o layout;
- preserve legibilidade e foco de teclado;
- mantenha o tabuleiro integralmente visível sem scroll interno.
## Fundo e análise da partida

O fundo global usa o asset local apps/web/public/images/backgrounds/souls-background.png com overlays escuros, sem dependências externas. O painel MatchLog fica no rail esquerdo, por baixo do Jogador 2, com lista cronológica invertida e scroll interno.
## Efeitos de combate

Os estados `combatColumn`, `combatAttacker`, `combatTarget` e `combatDestroyed` vivem no CSS Module de [BoardCell](../../apps/web/src/features/game-board/presentation/BoardCell.module.css). São exclusivamente visuais, não capturam eventos e não alteram dimensões. O pulso é removido quando o sistema pede movimento reduzido.
