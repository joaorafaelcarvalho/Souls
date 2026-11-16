# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 9.85
- Turnos médios: 17.95
- Vitórias J1/J2: 5 / 15
- Prioridade forçada: J1

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | defensive | Laboratório · defensive | 20 | 5 | 15 | 0 | 20 | 5 | 25% | 9.85 | 665 | 1577.5 |
| J2 | low-cost | Laboratório · low-cost | 20 | 15 | 5 | 0 | 0 | 0 | 75% | 9.85 | 1577.5 | 665 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · defensive | defensive | 20 | 10 | 2 | 4 | 3 | 1 | 17 | sim |
| J2 | Laboratório · low-cost | low-cost | 20 | 17 | 3 | 0 | 0 | 0 | 21 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 178 | 246 | 424 | 1 | 1 |
| 1 | 27 | 0 | 27 | 3 | — |
| 2 | 4 | 0 | 4 | 7 | — |
| 3 | 0 | 0 | 0 | — | — |
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
| 0 | 0 / 155 / 57 / 0 | 0 / 595 / 357 / 79 |
| 1 | 257 / 15 / 0 / 0 | 573 / 10 / 7 / 3 |
| 2 | 779 / 11 / 0 / 0 | 0 / 0 / 0 / 0 |
| 3 | 655 / 0 / 0 / 0 | 0 / 0 / 0 / 0 |
| 4 | 215 / 0 / 0 / 0 | 0 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.95 | 4.30 | 0.15 | 0.40 |
| 1 | 0.65 | 2.90 | 0.00 | 0.10 |
| 2 | 3.75 | 0.00 | 0.05 | 0.00 |
| 3 | 3.00 | 0.00 | 0.00 | 0.00 |
| 4 | 1.00 | 0.00 | 0.00 | 0.00 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 2.65 | 0.6 |
| Souls gastas médias | 2.65 | 0.5 |
| Dano de combate causado | 665 | 1577.5 |
| Dano de combate recebido | 1577.5 | 665 |
| Penalizações de HP | 8372.5 | 6902.5 |
| Dano excedente | 307.5 | 62.5 |

## Alertas

- J1: existem cartas de nível 3 no baralho, mas nenhuma foi invocada.
- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 1 no baralho, mas nenhuma foi invocada.
- J2: a bateria não contém cartas de nível 2.
- J2: a bateria não contém cartas de nível 3.
- J2: a bateria não contém cartas de nível 4.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
