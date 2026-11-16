# Card

## Responsabilidade

Apresentar uma definição completa de carta nas variantes hand ou board. O componente recebe CardDefinition e não conhece CardInstance, regras de invocação ou combate.

## Estrutura visual

A carta mantém cinco áreas reutilizáveis:

1. cabeçalho: tipo, ícone correspondente e nível;
2. ilustração: definition.image, com object-fit e proporção preservada;
3. nome: nome da definição em destaque;
4. atributos: ATK com ícone de espada e DEF com ícone de escudo;
5. moldura: ferro negro, bronze, dourado antigo, profundidade e detalhes góticos discretos.

A diferenciação por tipo é visual: melee usa vermelho escuro e bronze com espadas; ranged usa azul-petróleo, dourado e seta/arco. Mago permanece ranged.

## Props

A interface recebe definition, variant e selected:

- definition: CardDefinition validado pelo catálogo;
- variant: hand ou board;
- selected: destaque visual opcional.

## Visual Base v1

A variante hand usa mais espaço vertical, ilustração dominante, nome com até duas linhas e atributos em painéis separados. A variante board reduz apenas tipografia, espaçamento e moldura interna para caber na casa 2:3; nunca aumenta a grelha. Ambas usam a mesma moldura e os mesmos dados de CardDefinition.
## Variantes

- hand: carta vertical selecionável, com ilustração destacada e texto legível;
- board: carta compacta com proporção 2:3 dentro da casa, sem alterar as dimensões da grelha.

As duas variantes usam a mesma estrutura e aceitam qualquer definição válida do catálogo. Não existem condições específicas para os cinco nomes de teste.

## Imagens

O caminho vem exclusivamente de CardDefinition.image. O componente não monta caminhos com base no nome da carta. Se o carregamento falhar, apresenta um fallback textual acessível Imagem indisponível, sem substituir a imagem por outro recurso.

## Estados e eventos

O componente não mantém estado de jogo nem emite eventos. Mantém apenas o estado local de falha da imagem. A seleção é indicada pela prop selected; a mão encaminha o clique através do botão que envolve o componente.

## Testes

[Card.test.tsx](../../apps/web/src/features/cards/presentation/Card.test.tsx) verifica as informações principais, as variantes, a referência da imagem e o fallback de erro.
## Composição atual

A ilustração é aplicada como background da carta através de CardDefinition.image. O conteúdo fica sobre a arte: o cabeçalho compacto e o nome ficam na parte superior, enquanto os dois valores de combate permanecem na faixa inferior. A variante board mantém a mesma composição dentro da proporção 2:3.