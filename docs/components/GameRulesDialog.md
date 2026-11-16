# GameRulesDialog

## Responsabilidade

Apresentar uma consulta visual e acessível do regulamento oficial SOULS v0.7 durante a partida. O componente é apenas de apresentação: não altera o estado, as fases, os custos ou o motor de combate.

## Props

```ts
interface GameRulesDialogProps {
  open: boolean;
  onClose: () => void;
}
```

## Conteúdo

O códice resume, sem criar regras novas:

- objetivo e recursos iniciais;
- mapa das seis linhas e quatro colunas;
- leitura dos atributos de uma carta: nome, tipo, nível, ATK e DEF;
- carta-modelo vertical em proporção 2:3, com as explicações organizadas na coluna adjacente;
- categorias e zonas válidas;
- fases do turno e primeira ronda;
- custos de invocação por nível;
- ordem de resolução e comparações ATK/DEF;
- Souls, descarte, retirada voluntária e vitória.

A fonte normativa continua a ser [docs/game-rules.md](../game-rules.md).

## Integração

O botão `Regras` é renderizado no cabeçalho superior esquerdo, ao lado de `Voltar`, durante a partida, e também no [MainMenu](./MainMenu.md). O painel usa [GameRulesDialog.module.css](../../apps/web/src/features/rules/presentation/GameRulesDialog.module.css), tem scroll interno para ecrãs pequenos e reutiliza o crest visual local do resultado final como detalhe atmosférico.

O modal pode ser fechado pelo botão `×`, pelo botão `Fechar códice`, pela tecla `Escape` ou clicando fora do painel. Ao abrir, bloqueia o scroll da página e coloca o foco no botão de fecho.
