# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 8.55
- Turnos médios: 15.35
- Vitórias J1/J2: 2 / 18
- Prioridade forçada: J2

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | high-cost | Laboratório · high-cost | 20 | 2 | 18 | 0 | 0 | 0 | 10% | 8.55 | 3690 | 9377.5 |
| J2 | low-cost | Laboratório · low-cost | 20 | 18 | 2 | 0 | 20 | 18 | 90% | 8.55 | 9377.5 | 3690 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · high-cost | high-cost | 20 | 7 | 5 | 4 | 2 | 2 | 16 | sim |
| J2 | Laboratório · low-cost | low-cost | 20 | 17 | 3 | 0 | 0 | 0 | 21 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 113 | 286 | 399 | 1 | 1 |
| 1 | 54 | 36 | 90 | 2 | 4 |
| 2 | 15 | 0 | 15 | 5 | — |
| 3 | 2 | 0 | 2 | 5 | — |
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
| 0 | 0 / 100 / 0 / 38 | 0 / 712 / 51 / 71 |
| 1 | 377 / 124 / 0 / 0 | 230 / 156 / 22 / 31 |
| 2 | 566 / 30 / 0 / 0 | 0 / 0 / 0 / 0 |
| 3 | 307 / 1 / 0 / 0 | 0 / 0 / 0 / 0 |
| 4 | 374 / 0 / 0 / 0 | 0 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.60 | 2.05 | 0.75 | 0.65 |
| 1 | 1.90 | 1.10 | 0.40 | 0.10 |
| 2 | 2.90 | 0.00 | 0.35 | 0.00 |
| 3 | 1.70 | 0.00 | 0.20 | 0.00 |
| 4 | 1.90 | 0.00 | 0.10 | 0.00 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 5.45 | 5.75 |
| Souls gastas médias | 4.75 | 2.7 |
| Dano de combate causado | 3690 | 9377.5 |
| Dano de combate recebido | 9377.5 | 3690 |
| Penalizações de HP | 790 | 115 |
| Dano excedente | 352.5 | 22.5 |

## Alertas

- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- J2: a bateria não contém cartas de nível 2.
- J2: a bateria não contém cartas de nível 3.
- J2: a bateria não contém cartas de nível 4.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
