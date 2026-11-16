# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 9.4
- Turnos médios: 17.05
- Vitórias J1/J2: 19 / 1
- Prioridade forçada: J1

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | random-legal | Laboratório · random-legal | 20 | 19 | 1 | 0 | 20 | 19 | 95% | 9.4 | 7810 | 2970 |
| J2 | high-cost | Laboratório · high-cost | 20 | 1 | 19 | 0 | 0 | 0 | 5% | 9.4 | 2970 | 7810 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · random-legal | random-legal | 20 | 15 | 5 | 0 | 0 | 0 | 20 | sim |
| J2 | Laboratório · high-cost | high-cost | 20 | 7 | 5 | 4 | 2 | 2 | 16 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 244 | 126 | 370 | 1 | 1 |
| 1 | 50 | 49 | 99 | 4 | 2 |
| 2 | 0 | 17 | 17 | — | 5 |
| 3 | 0 | 3 | 3 | — | 6 |
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
| 0 | 0 / 479 / 198 / 153 | 0 / 116 / 2 / 44 |
| 1 | 696 / 201 / 38 / 37 | 464 / 137 / 2 / 0 |
| 2 | 0 / 0 / 0 / 0 | 697 / 46 / 0 / 0 |
| 3 | 0 / 0 / 0 / 0 | 318 / 2 / 0 / 0 |
| 4 | 0 / 0 / 0 / 0 | 396 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 2.60 | 0.30 | 0.20 | 0.40 |
| 1 | 2.50 | 2.25 | 0.00 | 0.30 |
| 2 | 0.00 | 3.15 | 0.00 | 0.00 |
| 3 | 0.00 | 1.75 | 0.00 | 0.10 |
| 4 | 0.00 | 1.95 | 0.00 | 0.05 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 5.25 | 6.05 |
| Souls gastas médias | 4.2 | 5.3 |
| Dano de combate causado | 7810 | 2970 |
| Dano de combate recebido | 2970 | 7810 |
| Penalizações de HP | 400 | 2370 |
| Dano excedente | 0 | 370 |

## Alertas

- J1: a bateria não contém cartas de nível 2.
- J1: a bateria não contém cartas de nível 3.
- J1: a bateria não contém cartas de nível 4.
- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
