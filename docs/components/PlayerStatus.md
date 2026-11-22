# PlayerStatus

## Responsabilidade

Apresentar o estado resumido de um jogador: HP, Souls, cartas na mão, cartas no baralho e descarte.

## Props

```ts
interface PlayerStatusProps {
  player: PlayerState;
  isActive: boolean;
  position: 'top' | 'bottom';
}
```

## Estados e eventos

Não mantém estado interno e não emite eventos. O destaque de jogador ativo vem da prop `isActive`.

## Dependências

- tipo [PlayerState](../../packages/game-core/src/domain/players/types.ts);
- CSS Module local.

## Tokens utilizados

Usa tokens de espaço, borda, superfície, texto e destaque definidos em [tokens.css](../../apps/web/src/shared/styles/tokens.css).

## Exemplo

```tsx
<PlayerStatus player={state.players[1]} isActive position="bottom" />
```

Em viewports até 64rem, o componente reduz espaçamento e conteúdo secundário. A posição visual é determinada pelas faixas do `GameBoard`: J2 fica no painel superior esquerdo e J1 no inferior direito, preservando HP, Souls e feedbacks de combate sem sobrepor a grelha.

## Limitações

- não edita HP ou Souls;
- não mostra histórico de eventos;
- não representa dados remotos;
- não é um componente visual final.

## Testes relevantes

A composição de [App.test.tsx](../../apps/web/src/App.test.tsx) confirma a integração do estado inicial com o protótipo local.
