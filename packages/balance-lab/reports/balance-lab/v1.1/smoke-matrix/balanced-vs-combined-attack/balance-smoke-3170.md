# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 7.7
- Turnos médios: 13.9
- Vitórias J1/J2: 11 / 9
- Prioridade forçada: J1

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | balanced | Laboratório · balanced | 20 | 11 | 9 | 0 | 20 | 11 | 55% | 7.7 | 9170 | 8577.5 |
| J2 | combined-attack | Laboratório · combined-attack | 20 | 9 | 11 | 0 | 0 | 0 | 45% | 7.7 | 8577.5 | 9170 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · balanced | balanced | 20 | 9 | 5 | 3 | 2 | 1 | 17 | sim |
| J2 | Laboratório · combined-attack | combined-attack | 20 | 8 | 5 | 4 | 2 | 1 | 17 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 127 | 127 | 254 | 1 | 1 |
| 1 | 44 | 43 | 87 | 3 | 3 |
| 2 | 15 | 6 | 21 | 4 | 5 |
| 3 | 3 | 1 | 4 | 8 | 8 |
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
| 0 | 0 / 253 / 0 / 206 | 0 / 136 / 0 / 73 |
| 1 | 432 / 124 / 0 / 10 | 424 / 99 / 0 / 0 |
| 2 | 431 / 22 / 0 / 0 | 554 / 19 / 0 / 0 |
| 3 | 370 / 4 / 0 / 0 | 337 / 1 / 0 / 0 |
| 4 | 169 / 0 / 0 / 0 | 155 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 2.05 | 0.45 | 0.60 | 1.20 |
| 1 | 2.35 | 2.05 | 0.45 | 0.80 |
| 2 | 1.95 | 3.40 | 0.30 | 0.30 |
| 3 | 1.60 | 1.75 | 0.25 | 0.20 |
| 4 | 0.95 | 0.85 | 0.05 | 0.15 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 4.9 | 3.45 |
| Souls gastas médias | 4.2 | 2.9 |
| Dano de combate causado | 9170 | 8577.5 |
| Dano de combate recebido | 8577.5 | 9170 |
| Penalizações de HP | 10 | 50 |
| Dano excedente | 285 | 175 |

## Alertas

- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
