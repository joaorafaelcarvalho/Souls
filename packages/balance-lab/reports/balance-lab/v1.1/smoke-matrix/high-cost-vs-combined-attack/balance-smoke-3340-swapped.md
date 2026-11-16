# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 8.25
- Turnos médios: 15
- Vitórias J1/J2: 10 / 10
- Prioridade forçada: J2

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | combined-attack | Laboratório · combined-attack | 20 | 10 | 10 | 0 | 0 | 0 | 50% | 8.25 | 8710 | 8835 |
| J2 | high-cost | Laboratório · high-cost | 20 | 10 | 10 | 0 | 20 | 10 | 50% | 8.25 | 8835 | 8710 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · combined-attack | combined-attack | 20 | 8 | 5 | 4 | 2 | 1 | 17 | sim |
| J2 | Laboratório · high-cost | high-cost | 20 | 7 | 5 | 4 | 2 | 2 | 16 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 134 | 125 | 259 | 1 | 1 |
| 1 | 37 | 49 | 86 | 3 | 3 |
| 2 | 8 | 20 | 28 | 5 | 4 |
| 3 | 2 | 2 | 4 | 8 | 6 |
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
| 0 | 0 / 111 / 0 / 55 | 0 / 100 / 0 / 33 |
| 1 | 549 / 105 / 2 / 1 | 517 / 148 / 0 / 1 |
| 2 | 643 / 27 / 0 / 0 | 584 / 42 / 0 / 0 |
| 3 | 385 / 2 / 0 / 0 | 335 / 1 / 0 / 0 |
| 4 | 205 / 0 / 0 / 0 | 424 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.70 | 0.60 | 0.60 | 0.15 |
| 1 | 2.65 | 2.30 | 0.50 | 0.25 |
| 2 | 3.25 | 2.75 | 0.35 | 0.25 |
| 3 | 1.80 | 1.85 | 0.10 | 0.05 |
| 4 | 1.00 | 1.95 | 0.00 | 0.05 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 3.25 | 5.7 |
| Souls gastas médias | 2.95 | 5 |
| Dano de combate causado | 8710 | 8835 |
| Dano de combate recebido | 8835 | 8710 |
| Penalizações de HP | 70 | 0 |
| Dano excedente | 290 | 397.5 |

## Alertas

- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
