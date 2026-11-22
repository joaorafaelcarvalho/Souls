# Componentes frontend

O índice completo está em [docs/components/README.md](../components/README.md).

## Componentes implementados

| Componente | Localização | Responsabilidade |
| --- | --- | --- |
| [CardInspectionPanel](../components/CardInspectionPanel.md) | [CardInspectionPanel.tsx](../../apps/web/src/features/cards/presentation/CardInspectionPanel.tsx) | inspecionar uma carta no rail direito |
| [CardInspectionDialog](../components/CardInspectionDialog.md) | [CardInspectionDialog.tsx](../../apps/web/src/features/cards/presentation/CardInspectionDialog.tsx) | inspeção responsiva com ações da mão e Soul Harvest |
| [Card](../components/Card.md) | [Card.tsx](../../apps/web/src/features/cards/presentation/Card.tsx) | apresentar ilustração, moldura, nome, tipo, ATK, DEF e nível |
| [GameBoard](../components/GameBoard.md) | [GameBoard.tsx](../../apps/web/src/features/game-board/presentation/GameBoard.tsx) | compor a grelha 6×4 e as cartas em jogo |
| [BoardCell](../components/BoardCell.md) | [BoardCell.tsx](../../apps/web/src/features/game-board/presentation/BoardCell.tsx) | apresentar uma casa vertical vazia ou ocupada |
| [PlayerStatus](../components/PlayerStatus.md) | [PlayerStatus.tsx](../../apps/web/src/features/match/presentation/PlayerStatus.tsx) | apresentar HP, Souls e contadores |
| [PlayerHand](../components/PlayerHand.md) | [PlayerHand.tsx](../../apps/web/src/features/match/presentation/PlayerHand.tsx) | apresentar e selecionar instâncias da mão |
| [MatchLog](../components/MatchLog.md) | [MatchLog.tsx](../../apps/web/src/features/match/presentation/MatchLog.tsx) | apresentar histórico textual da partida |
| CombatAnimationSequencer | [CombatAnimationSequencer.ts](../../apps/web/src/features/combat/application/CombatAnimationSequencer.ts) | sequenciar a apresentação visual de uma resolução real |
| [GameRulesDialog](../components/GameRulesDialog.md) | [GameRulesDialog.tsx](../../apps/web/src/features/rules/presentation/GameRulesDialog.tsx) | consultar o regulamento v0.7 durante a partida |
| [LoadingScreen](../components/LoadingScreen.md) | [LoadingScreen.tsx](../../apps/web/src/features/entry/presentation/LoadingScreen.tsx) | introdução visual temporizada antes do menu |
| [MainMenu](../components/MainMenu.md) | [MainMenu.tsx](../../apps/web/src/features/entry/presentation/MainMenu.tsx) | entrada principal e navegação para a partida existente |
| [ReturnToMenuDialog](../components/ReturnToMenuDialog.md) | [ReturnToMenuDialog.tsx](../../apps/web/src/features/entry/presentation/ReturnToMenuDialog.tsx) | confirmar o abandono da partida sem pop-up nativo |
| [CoinTossAnimation](../components/CoinTossAnimation.md) | [CoinTossAnimation.tsx](../../apps/web/src/features/match/presentation/CoinTossAnimation.tsx) | apresentar o resultado oficial do primeiro jogador |
| [TurnHandoffOverlay](../components/TurnHandoffOverlay.md) | [TurnHandoffOverlay.tsx](../../apps/web/src/features/match/presentation/TurnHandoffOverlay.tsx) | confirmar a passagem local sem alterar o motor |
| [TurnAnnouncement](../components/TurnAnnouncement.md) | [TurnAnnouncement.tsx](../../apps/web/src/features/match/presentation/TurnAnnouncement.tsx) | anunciar visualmente o jogador ativo |
| [TutorialScreen](../tutorial.md) | [TutorialScreen.tsx](../../apps/web/src/features/tutorial/presentation/TutorialScreen.tsx) | compor a sessão tutorial determinística |
| [TutorialInstructionPanel](../tutorial.md) | [TutorialInstructionPanel.tsx](../../apps/web/src/features/tutorial/presentation/TutorialInstructionPanel.tsx) | apresentar objetivos e progresso pedagógico |
| [CodexPage](../codex-of-souls.md) | [CodexPage.tsx](../../apps/web/src/features/codex/presentation/CodexPage.tsx) | explorar o catálogo oficial de cartas |

O controlador [useLocalGame](../../apps/web/src/features/match/application/useLocalGame.ts) coordena operações do game-core, mas não é componente visual. Expõe à árvore React apenas a [AuthorizedGameView](./authorized-match-view.md) e [MatchCommands](../../apps/web/src/features/match/application/MatchCommands.ts); não entrega o `GameState` completo nem as mãos privadas dos dois jogadores.

## Composição do ecrã

Em ecrãs largos, [App.tsx](../../apps/web/src/App.tsx) usa uma grelha de três zonas:

- esquerda: estado resumido do jogador 2;
- centro: área principal do tabuleiro;
- direita: identidade do SOULS e informação da ronda;
- coluna direita inferior: estado do jogador 1, seleção e mão do jogador 1 em sequência vertical.

A coluna central cresce com o espaço disponível. O GameBoard continua a limitar o tamanho das casas pela largura e altura reais da sua área, mantendo as 24 casas visíveis. Em ecrãs estreitos as zonas passam para uma coluna vertical.

A mão é renderizada depois do tabuleiro e usa scroll horizontal. O tabuleiro usa a variante board de [Card](../components/Card.md), sem expor IDs, coordenadas ou nomes técnicos das casas.

Em viewports até 64rem, [App.tsx](../../apps/web/src/App.tsx) passa para uma composição específica de espaço compacto: a barra de partida fica fixa no topo, J2 e J1 ocupam faixas entre a moldura e o tabuleiro — superior esquerda e inferior direita —, o histórico é apenas ocultado visualmente e a mão usa o mesmo `PlayerHand` dentro de um drawer overlay. O `CardInspectionDialog` substitui o rail de inspeção nessa faixa sem criar um segundo fluxo de jogo. A partir de 48rem, o layout aproveita a largura adicional de tablet, mantendo o mesmo modelo de interação.
## Recursos de cartas

A imagem é sempre recebida através de CardDefinition.image. Para adicionar uma nova carta, basta criar a definição UUID, colocar a ilustração normalizada em apps/web/public/images/cards e associar esse caminho no JSON; não é necessário alterar Card, GameBoard ou PlayerHand.
## Reprodução de combate

O [useLocalGame](../../apps/web/src/features/match/application/useLocalGame.ts) mantém o resultado oficial calculado pelo game-core separado da publicação visual. O [CombatAnimationSequencer](../../apps/web/src/features/combat/application/CombatAnimationSequencer.ts) controla etapas, velocidade, salto, reduced motion e cancelamento. O [GameBoard](../components/GameBoard.md) recebe o estado de reprodução apenas para aplicar efeitos às casas; consulte [Animações de combate](../combat-animations.md).
## Combat VFX

A camada [LightningAttackEffect](../../apps/web/src/features/combat/presentation/LightningAttackEffect.tsx) e os estados CSS de `BoardCell` recebem o `CombatPlaybackState`. Não calculam combate e não devem ser usados fora do `GameBoard` sem um contentor de referência.
## Encerramento da partida

O [GameResultOverlay](../components/GameResultOverlay.md) aparece apenas quando a visão autorizada indica `status: 'finished'` e `winnerId` está definido. Aguarda a conclusão do [CombatAnimationSequencer](../../apps/web/src/features/combat/application/CombatAnimationSequencer.ts) porque o `useLocalGame` só publica o estado final depois do golpe decisivo. A ação `Revanche` reutiliza o comando `reset()` existente.

## Sequência inicial e passagem de turno

O [MatchPresentationSequence](../../apps/web/src/features/match/presentation/MatchPresentationSequence.tsx) é local à camada React. Na entrada de uma partida apresenta a moeda com `turn.firstPlayerId`, a confirmação de [TurnHandoffOverlay](../components/TurnHandoffOverlay.md) e [TurnAnnouncement](../components/TurnAnnouncement.md). Depois de um combate, observa a mudança oficial de `activePlayerId` e repete apenas o handoff/anúncio. Nenhum destes componentes chama operações do motor.
