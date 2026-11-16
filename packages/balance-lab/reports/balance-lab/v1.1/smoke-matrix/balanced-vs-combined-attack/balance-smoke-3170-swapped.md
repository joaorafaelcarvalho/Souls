# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 7.8
- Turnos médios: 14.05
- Vitórias J1/J2: 12 / 8
- Prioridade forçada: J2

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | combined-attack | Laboratório · combined-attack | 20 | 12 | 8 | 0 | 0 | 0 | 60% | 7.8 | 8892.5 | 8897.5 |
| J2 | balanced | Laboratório · balanced | 20 | 8 | 12 | 0 | 20 | 8 | 40% | 7.8 | 8897.5 | 8892.5 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · combined-attack | combined-attack | 20 | 8 | 5 | 4 | 2 | 1 | 17 | sim |
| J2 | Laboratório · balanced | balanced | 20 | 9 | 5 | 3 | 2 | 1 | 17 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 136 | 130 | 266 | 1 | 1 |
| 1 | 35 | 39 | 74 | 4 | 3 |
| 2 | 10 | 16 | 26 | 5 | 5 |
| 3 | 0 | 5 | 5 | — | 7 |
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
| 0 | 0 / 134 / 0 / 65 | 0 / 211 / 0 / 166 |
| 1 | 464 / 98 / 0 / 2 | 496 / 145 / 0 / 15 |
| 2 | 567 / 22 / 0 / 0 | 419 / 29 / 0 / 0 |
| 3 | 339 / 1 / 0 / 0 | 374 / 5 / 0 / 0 |
| 4 | 145 / 0 / 0 / 0 | 182 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.50 | 1.70 | 0.70 | 0.80 |
| 1 | 2.55 | 2.70 | 0.70 | 0.35 |
| 2 | 2.80 | 2.15 | 0.70 | 0.05 |
| 3 | 1.70 | 1.55 | 0.30 | 0.20 |
| 4 | 0.85 | 0.80 | 0.15 | 0.20 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 3.2 | 5.4 |
| Souls gastas médias | 2.8 | 4.45 |
| Dano de combate causado | 8892.5 | 8897.5 |
| Dano de combate recebido | 8897.5 | 8892.5 |
| Penalizações de HP | 0 | 50 |
| Dano excedente | 137.5 | 215 |

## Alertas

- J1: existem cartas de nível 3 no baralho, mas nenhuma foi invocada.
- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
