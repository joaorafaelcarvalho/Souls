# Arquitetura frontend

## Objetivo

O frontend React apresenta o estado autorizado e o conteúdo validado pelo game-content. O modo local chama diretamente o game-core; o PvP Online usa `useOnlineGame` para comunicar intenções ao servidor Fastify por WebSocket.

## Organização

```text
apps/web/src/
├── app/
├── features/
│   ├── cards/
│   │   └── presentation/       # Card reutilizável
│   ├── game-board/
│   │   └── presentation/       # grelha vertical 6×4
│   ├── online/
│   │   ├── application/        # transporte e sessão online
│   │   └── presentation/       # criação, entrada e lobby
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

## Sessão online

O frontend guarda apenas `roomId`, token da própria sessão, versão e `AuthorizedGameView`. O servidor mantém o `GameState` completo, valida os comandos e filtra eventos privados. A ligação tenta reconectar enquanto o processo servidor continua disponível. Os componentes continuam a receber definições, instâncias e callbacks tipados; o game-core continua responsável pelos resultados.
