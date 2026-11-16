# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 8.95
- Turnos médios: 16.25
- Vitórias J1/J2: 5 / 15
- Prioridade forçada: aleatória

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | balanced | Laboratório · balanced | 20 | 5 | 15 | 0 | 7 | 3 | 25% | 8.95 | 6667.5 | 9452.5 |
| J2 | aggressive | Laboratório · aggressive | 20 | 15 | 5 | 0 | 13 | 11 | 75% | 8.95 | 9452.5 | 6667.5 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · balanced | balanced | 20 | 9 | 5 | 3 | 2 | 1 | 17 | sim |
| J2 | Laboratório · aggressive | aggressive | 20 | 8 | 5 | 4 | 2 | 1 | 17 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 133 | 141 | 274 | 1 | 1 |
| 1 | 38 | 45 | 83 | 4 | 2 |
| 2 | 19 | 17 | 36 | 6 | 6 |
| 3 | 6 | 1 | 7 | 7 | 7 |
| 4 | 0 | 0 | 0 | — | — |

## Diagnóstico de invocação

Cada célula apresenta: Souls insuficientes / disponíveis não escolhidas / sem espaço / limite de colocação.

| Nível | J1 | J2 |
|---:|---|---|
| 0 | 0 / 226 / 0 / 176 | 0 / 159 / 0 / 89 |
| 1 | 602 / 155 / 2 / 5 | 661 / 154 / 0 / 0 |
| 2 | 534 / 39 / 0 / 0 | 718 / 39 / 0 / 0 |
| 3 | 405 / 6 / 0 / 0 | 388 / 1 / 0 / 0 |
| 4 | 193 / 0 / 0 / 0 | 205 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 1.75 | 0.75 | 0.60 | 0.20 |
| 1 | 2.85 | 2.65 | 0.25 | 0.10 |
| 2 | 1.95 | 2.90 | 0.10 | 0.25 |
| 3 | 1.60 | 1.95 | 0.10 | 0.00 |
| 4 | 0.95 | 0.95 | 0.05 | 0.05 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 6.2 | 5.15 |
| Souls gastas médias | 5.3 | 4.95 |
| Dano de combate causado | 6667.5 | 9452.5 |
| Dano de combate recebido | 9452.5 | 6667.5 |
| Penalizações de HP | 300 | 400 |
| Dano excedente | 462.5 | 110 |

## Alertas

- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
