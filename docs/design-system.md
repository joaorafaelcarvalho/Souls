# Design system

## Tokens

Os tokens semânticos estão em [tokens.css](../apps/web/src/shared/styles/tokens.css).

### Estrutura

- `--souls-color-bg`: canvas principal;
- `--souls-color-surface`: painéis;
- `--souls-color-surface-elevated`: superfícies elevadas e cartas;
- `--souls-color-text-primary` e `--souls-color-text-secondary`;
- `--souls-color-accent-gold` e `--souls-color-accent-bronze`;
- `--souls-color-accent-soul`;
- `--souls-color-accent-danger`;
- `--souls-color-cell-defense`, `--souls-color-cell-melee`, `--souls-color-cell-ranged`;
- gradientes de canvas, painel, ferro e dourado;
- sombras de painel, tabuleiro e brilho;
- tipografia, espaçamento, raios e transições.

Aliases de compatibilidade mantêm os CSS Modules existentes coesos sem duplicar valores.

## Componentes

- [Card](./components/Card.md): variantes `hand` e `board`;
- [GameBoard](./components/GameBoard.md): tabuleiro dimensionado pela largura e altura;
- [BoardCell](./components/BoardCell.md): estados `valid`, `invalid` e `inactive`;
- [PlayerStatus](./components/PlayerStatus.md): HUD compacto;
- [PlayerHand](./components/PlayerHand.md): fila horizontal.
- [CardInspectionDialog](./components/CardInspectionDialog.md): inspeção responsiva e ações condicionais.

## Design visual das cartas

O componente Card usa uma moldura reutilizável de ferro negro, bronze e dourado antigo, com cinco áreas estáveis:

1. cabeçalho com tipo, ícone e nível;
2. ilustração com object-fit e sem distorção;
3. nome da carta;
4. atributos ATK e DEF com ícones;
5. moldura interna e profundidade visual.

Cartas melee usam vermelho escuro e bronze. Cartas ranged usam azul-petróleo, verde envelhecido e dourado. Mago continua a ser ranged; não existe um terceiro tipo visual ou de domínio.

As variantes hand e board usam a mesma estrutura. A variante board mantém as dimensões da casa e reduz a tipografia através de CSS; o conteúdo da carta nunca aumenta o tabuleiro. Quando a imagem falha, o Card apresenta o texto acessível Imagem indisponível em vez de trocar a ilustração.
## Estados e movimento

- transições curtas usam `--souls-transition-fast` e `--souls-transition-normal`;
- efeitos não alteram dimensões da grelha;
- `prefers-reduced-motion` remove transições e animações;
- foco de teclado permanece visível;
- casas inválidas ficam atenuadas e desativadas.

## Dimensionamento do tabuleiro

Para quatro colunas, seis linhas e casas 2:3:

```text
boardWidth = 4w + 3g
boardHeight = 9w + 5g
```

[GameBoard.tsx](../apps/web/src/features/game-board/presentation/GameBoard.tsx) mede a área disponível com `ResizeObserver` e usa o menor limite entre largura e altura. O conteúdo das cartas não define o tamanho da grelha.
## Camada visual da carta

A imagem da definição é usada como background da carta, com uma camada de contraste para manter o nome, o nível e os valores legíveis. No desktop, a mão usa cartas maiores no rail direito inferior e o status do jogador 1 fica acima da mão. Esta composição não altera a grelha nem as regras.
## Painel de histórico e fundo

O MatchLog usa o mesmo tratamento de painel de ferro/pedra dos restantes elementos e aparece por baixo do Jogador 2. O fundo global usa o asset local em apps/web/public/images/backgrounds/souls-background.png, com overlays escuros e violeta para manter o centro legível.
## Movimento e combate

Os efeitos de combate usam realces, opacidade e sombras sem alterar o layout. A coluna ativa, o atacante, o alvo e a destruição são estados semânticos do `BoardCell`; não há crescimento da grelha nem reposicionamento de cartas. A sequência e os tempos estão documentados em [combat-animations.md](./combat-animations.md).

A apresentação reduzida respeita `prefers-reduced-motion: reduce`, removendo pulso e espera temporal. A informação equivalente continua disponível no indicador do tabuleiro e no histórico da partida.

## Partida em mobile e tablet

O `App.module.css` define a composição compacta até 64rem e diferencia mobile abaixo de 48rem. O tabuleiro não é escalado por uma largura fixa: o `GameBoard` mede a área central disponível e mantém a proporção das casas. Os HUDs ocupam faixas reservadas na moldura; apenas a mão e os modais usam overlays com safe-area, sem layout shift.
## Combat VFX

A linguagem visual de combate usa dourado/bronze para carga e raios, azul-violeta para Souls, vermelho-brasa para dano e marcadores X e sombras profundas para destruição. O SVG fica numa camada absoluta dentro do tabuleiro, com `pointer-events: none`, sem alterar casas, cartas ou layout. Os tempos são centralizados em [combatVfxTiming.ts](../apps/web/src/features/combat/combatVfxTiming.ts).
## Entrada e menu principal

O [LoadingScreen](./components/LoadingScreen.md) reutiliza o fundo e o logo oficiais, usa bronze/dourado envelhecido com Souls violeta e dura aproximadamente 2 000 ms apenas como introdução visual. O [MainMenu](./components/MainMenu.md) usa botões ornamentais em ferro escurecido; CÓDICE DAS ALMAS abre o arquivo de cartas e CONFIGURAÇÕES mantém-se desativado.
## Transição e controlos da partida

O menu e os controlos do jogo partilham a linguagem de placas de ferro/bronze, recortes laterais, sombra interna e foco dourado. O cabeçalho da partida mantém o logo sobre fundo transparente; Voltar e Regras ficam agrupados à direita. A transição menu→jogo usa uma saída curta do menu e uma entrada suave do shell, com reduced motion sem espera decorativa.
## Resultado da partida

O `GameResultOverlay` usa o mesmo ferro negro, bronze, dourado antigo e Souls violeta do jogo. Vitória usa calor dourado; derrota usa vermelho profundo. A camada escurece o tabuleiro sem o remover, mantém o resultado legível e concentra a ação primária na Revanche.
## Assets do resultado

A composição do resultado final combina componentes funcionais com assets transparentes locais em `apps/web/public/images/result`. A espada, estátuas, estandartes, arquitetura, moldura inferior e bases de velas são camadas decorativas; títulos, métricas e ações não estão gravados nas imagens.

## Tutorial

O tutorial usa o mesmo ferro escuro, bronze, dourado envelhecido e violeta espiritual através de [TutorialInstructionPanel](../apps/web/src/features/tutorial/presentation/TutorialInstructionPanel.tsx). As linhas guiadas recebem apenas um contorno e pulso de baixa intensidade em [BoardCell.module.css](../apps/web/src/features/game-board/presentation/BoardCell.module.css); o destaque não altera dimensões, cliques ou regras do tabuleiro. Até 64rem, o tutorial usa instruções compactas, mão em drawer e uma composição específica para landscape sem overflow horizontal.
