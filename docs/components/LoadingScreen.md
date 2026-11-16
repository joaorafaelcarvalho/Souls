# LoadingScreen

## Responsabilidade

Apresentar a introdução visual cinematográfica do SOULS antes do menu principal. O componente pertence exclusivamente à apresentação e não bloqueia a inicialização do estado da partida.

## Comportamento

- duração visual normal: aproximadamente 2 000 ms;
- barra de progresso decorativa, sem representar uma transferência de rede;
- logo oficial em `/images/branding/souls-logo.png`;
- fundo cinematográfico local em `/images/backgrounds/souls-background.png`;
- timers limpos quando o componente desmonta;
- `prefers-reduced-motion` elimina a espera decorativa e conclui imediatamente.

A transição é executada uma vez por montagem da aplicação. Navegar do menu para a partida não monta novamente o loading.

## Props

```ts
interface LoadingScreenProps {
  onComplete: () => void;
  durationMs?: number;
}
```