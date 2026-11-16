# Arquitetura frontend

## Objetivo

O frontend React apresenta o estado autorizado e o conteúdo validado pelo game-content. O protótipo local chama diretamente o game-core; não existe comunicação com a API.

## Organização

```text
apps/web/src/
├── app/
├── features/
│   ├── cards/
│   │   └── presentation/       # Card reutilizável
│   ├── game-board/
│   │   └── presentation/       # grelha vertical 6×4
│   └── match/
│       ├── application/        # controlador local
│       └── presentation/       # estado e mão
├── mocks/
├── shared/styles/
├── App.tsx
└── main.tsx
```

## Limites

- game-core é a fonte das regras, estados e instâncias;
- game-content é a fonte das definições e imagens;
- [Card](../components/Card.md) só apresenta uma definição;
- componentes não calculam dano, Souls, destruição ou vencedor;
- a mão usa os IDs presentes no estado real;
- a aplicação não duplica regras no frontend.

## Hierarquia visual

A composição atual coloca:

1. estado resumido do adversário;
2. ronda, jogador ativo e fase;
3. tabuleiro principal centrado;
4. estado resumido do jogador;
5. mão horizontal abaixo do tabuleiro.

As casas usam proporção vertical `2 / 3`, sem coordenadas ou etiquetas técnicas visíveis.

## Evolução prevista

Quando existir uma API de partidas, um adaptador substituirá o controlador local. Os componentes continuarão a receber definições, instâncias e callbacks tipados; o game-core continuará responsável pelos resultados.