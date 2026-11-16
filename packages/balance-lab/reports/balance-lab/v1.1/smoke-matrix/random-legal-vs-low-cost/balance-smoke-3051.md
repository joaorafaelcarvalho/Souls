# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 11.4
- Turnos médios: 21.2
- Vitórias J1/J2: 6 / 14
- Prioridade forçada: J1

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | random-legal | Laboratório · random-legal | 20 | 6 | 14 | 0 | 20 | 6 | 30% | 11.4 | 5035 | 5280 |
| J2 | low-cost | Laboratório · low-cost | 20 | 14 | 6 | 0 | 0 | 0 | 70% | 11.4 | 5280 | 5035 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · random-legal | random-legal | 20 | 15 | 5 | 0 | 0 | 0 | 20 | sim |
| J2 | Laboratório · low-cost | low-cost | 20 | 17 | 3 | 0 | 0 | 0 | 21 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 267 | 320 | 587 | 1 | 1 |
| 1 | 54 | 44 | 98 | 3 | 3 |
| 2 | 0 | 0 | 0 | — | — |
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
| 0 | 0 / 574 / 211 / 214 | 0 / 777 / 116 / 80 |
| 1 | 668 / 201 / 44 / 47 | 278 / 156 / 30 / 20 |
| 2 | 0 / 0 / 0 / 0 | 0 / 0 / 0 / 0 |
| 3 | 0 / 0 / 0 / 0 | 0 / 0 / 0 / 0 |
| 4 | 0 / 0 / 0 / 0 | 0 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 1.65 | 1.00 | 0.00 | 0.00 |
| 1 | 2.30 | 0.75 | 0.00 | 0.05 |
| 2 | 0.00 | 0.00 | 0.00 | 0.00 |
| 3 | 0.00 | 0.00 | 0.00 | 0.00 |
| 4 | 0.00 | 0.00 | 0.00 | 0.00 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 8.05 | 8.8 |
| Souls gastas médias | 7.6 | 7.9 |
| Dano de combate causado | 5035 | 5280 |
| Dano de combate recebido | 5280 | 5035 |
| Penalizações de HP | 4135 | 2825 |
| Dano excedente | 285 | 152.5 |

## Alertas

- J1: a bateria não contém cartas de nível 2.
- J1: a bateria não contém cartas de nível 3.
- J1: a bateria não contém cartas de nível 4.
- J2: a bateria não contém cartas de nível 2.
- J2: a bateria não contém cartas de nível 3.
- J2: a bateria não contém cartas de nível 4.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
