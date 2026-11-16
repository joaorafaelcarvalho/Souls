# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 8.35
- Turnos médios: 15.45
- Vitórias J1/J2: 16 / 4
- Prioridade forçada: J2

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | aggressive | Laboratório · aggressive | 20 | 16 | 4 | 0 | 0 | 0 | 80% | 8.35 | 9617.5 | 6575 |
| J2 | balanced | Laboratório · balanced | 20 | 4 | 16 | 0 | 20 | 4 | 20% | 8.35 | 6575 | 9617.5 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · aggressive | aggressive | 20 | 8 | 5 | 4 | 2 | 1 | 17 | sim |
| J2 | Laboratório · balanced | balanced | 20 | 9 | 5 | 3 | 2 | 1 | 17 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 138 | 128 | 266 | 1 | 1 |
| 1 | 42 | 49 | 91 | 2 | 3 |
| 2 | 17 | 17 | 34 | 5 | 5 |
| 3 | 1 | 5 | 6 | 6 | 6 |
| 4 | 0 | 0 | 0 | — | — |

## Testes determinísticos do motor

| Nível | Carta | Souls usadas | Invocação legal | Invocada | Resultado |
|---:|---|---:|---|---|---|
| 0 | Cavaleiro | 0 | sim | sim | invoked |
| 1 | Carrasco Errante | 1 | sim | sim | invoked |
| 1 | Carrasco Errante | 0 | não | não | insufficient-souls |
| 2 | Espadachim do Eclipse | 2 | sim | sim | invoked |
| 2 | Espadachim do Eclipse | 1 | não | não | insufficient-souls |
| 3 | Duelista do Abismo | 3 | sim | sim | invoked |
| 3 | Duelista do Abismo | 2 | não | não | insufficient-souls |
| 4 | Colosso do Crepúsculo | 4 | sim | sim | invoked |
| 4 | Colosso do Crepúsculo | 3 | não | não | insufficient-souls |

## Diagnóstico de invocação

Cada célula apresenta: Souls insuficientes / disponíveis não escolhidas / sem espaço / limite de colocação.

| Nível | J1 | J2 |
|---:|---|---|
| 0 | 0 / 143 / 0 / 61 | 0 / 249 / 0 / 202 |
| 1 | 548 / 133 / 0 / 0 | 471 / 148 / 0 / 12 |
| 2 | 552 / 31 / 0 / 0 | 500 / 33 / 0 / 0 |
| 3 | 336 / 0 / 0 / 0 | 424 / 4 / 0 / 0 |
| 4 | 181 / 0 / 0 / 0 | 202 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.75 | 2.15 | 0.35 | 0.45 |
| 1 | 2.60 | 2.05 | 0.30 | 0.50 |
| 2 | 2.60 | 2.00 | 0.55 | 0.15 |
| 3 | 1.80 | 1.65 | 0.15 | 0.10 |
| 4 | 0.90 | 0.90 | 0.10 | 0.10 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 4.6 | 6.9 |
| Souls gastas médias | 4.25 | 5.75 |
| Dano de combate causado | 9617.5 | 6575 |
| Dano de combate recebido | 6575 | 9617.5 |
| Penalizações de HP | 300 | 150 |
| Dano excedente | 90 | 397.5 |

## Alertas

- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
