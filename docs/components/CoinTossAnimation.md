# CoinTossAnimation

## Responsabilidade

Apresentar visualmente o resultado oficial de `turn.firstPlayerId` no início de uma nova partida. A moeda seleciona uma das animações WebP locais — [`souls_coin_player_one_animada.webp`](../../apps/web/public/images/effects/souls_coin_player_one_animada.webp) ou [`souls_coin_player_two_animada.webp`](../../apps/web/public/images/effects/souls_coin_player_two_animada.webp) — e não executa sorteio nem altera o estado do motor.

## Sequência

- apresenta a pergunta “QUEM COMEÇA O DUELO?”;
- reproduz a animação medieval fornecida para o jogador sorteado;
- revela o jogador fornecido pelo controlador;
- permite `Saltar`, avançando sem repetir nem recalcular o resultado;
- termina depois de aproximadamente 3 segundos em movimento normal, com uma rotação mais lenta e uma revelação mais espaçada.

Os tempos estão exportados no componente para permitir ajuste futuro. `prefers-reduced-motion` usa uma revelação curta sem rotação prolongada.
