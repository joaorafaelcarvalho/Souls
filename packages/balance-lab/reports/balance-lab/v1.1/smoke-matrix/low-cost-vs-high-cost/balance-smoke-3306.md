# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 8.95
- Turnos médios: 16
- Vitórias J1/J2: 20 / 0
- Prioridade forçada: J1

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | low-cost | Laboratório · low-cost | 20 | 20 | 0 | 0 | 20 | 20 | 100% | 8.95 | 8817.5 | 2960 |
| J2 | high-cost | Laboratório · high-cost | 20 | 0 | 20 | 0 | 0 | 0 | 0% | 8.95 | 2960 | 8817.5 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · low-cost | low-cost | 20 | 17 | 3 | 0 | 0 | 0 | 21 | sim |
| J2 | Laboratório · high-cost | high-cost | 20 | 7 | 5 | 4 | 2 | 2 | 16 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 283 | 119 | 402 | 1 | 1 |
| 1 | 36 | 36 | 72 | 4 | 3 |
| 2 | 0 | 18 | 18 | — | 5 |
| 3 | 0 | 4 | 4 | — | 4 |
| 4 | 0 | 1 | 1 | — | 8 |

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
| 0 | 0 / 702 / 113 / 73 | 0 / 102 / 0 / 37 |
| 1 | 287 / 148 / 37 / 39 | 492 / 115 / 0 / 0 |
| 2 | 0 / 0 / 0 / 0 | 557 / 54 / 0 / 0 |
| 3 | 0 / 0 / 0 / 0 | 286 / 4 / 0 / 0 |
| 4 | 0 / 0 / 0 / 0 | 348 / 1 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 2.30 | 0.35 | 0.55 | 0.70 |
| 1 | 1.15 | 2.75 | 0.05 | 0.45 |
| 2 | 0.00 | 2.85 | 0.00 | 0.25 |
| 3 | 0.00 | 1.70 | 0.00 | 0.10 |
| 4 | 0.00 | 1.85 | 0.00 | 0.10 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 5.5 | 5.4 |
| Souls gastas médias | 3.3 | 4.9 |
| Dano de combate causado | 8817.5 | 2960 |
| Dano de combate recebido | 2960 | 8817.5 |
| Penalizações de HP | 162.5 | 1480 |
| Dano excedente | 0 | 297.5 |

## Alertas

- J1: a bateria não contém cartas de nível 2.
- J1: a bateria não contém cartas de nível 3.
- J1: a bateria não contém cartas de nível 4.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
