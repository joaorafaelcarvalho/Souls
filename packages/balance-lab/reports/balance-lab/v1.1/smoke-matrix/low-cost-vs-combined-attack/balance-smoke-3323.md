# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 8.5
- Turnos médios: 15.4
- Vitórias J1/J2: 17 / 3
- Prioridade forçada: J1

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | low-cost | Laboratório · low-cost | 20 | 17 | 3 | 0 | 20 | 17 | 85% | 8.5 | 9172.5 | 5352.5 |
| J2 | combined-attack | Laboratório · combined-attack | 20 | 3 | 17 | 0 | 0 | 0 | 15% | 8.5 | 5352.5 | 9172.5 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · low-cost | low-cost | 20 | 17 | 3 | 0 | 0 | 0 | 21 | sim |
| J2 | Laboratório · combined-attack | combined-attack | 20 | 8 | 5 | 4 | 2 | 1 | 17 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 285 | 128 | 413 | 1 | 1 |
| 1 | 44 | 31 | 75 | 3 | 2 |
| 2 | 0 | 11 | 11 | — | 6 |
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
| 0 | 0 / 737 / 24 / 79 | 0 / 99 / 0 / 52 |
| 1 | 119 / 174 / 11 / 32 | 595 / 105 / 0 / 3 |
| 2 | 0 / 0 / 0 / 0 | 606 / 30 / 0 / 0 |
| 3 | 0 / 0 / 0 / 0 | 312 / 0 / 0 / 0 |
| 4 | 0 / 0 / 0 / 0 | 166 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 1.90 | 0.60 | 0.85 | 1.00 |
| 1 | 0.60 | 3.05 | 0.20 | 0.40 |
| 2 | 0.00 | 3.30 | 0.00 | 0.15 |
| 3 | 0.00 | 1.80 | 0.00 | 0.20 |
| 4 | 0.00 | 0.80 | 0.00 | 0.20 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 6.7 | 3.35 |
| Souls gastas médias | 3.35 | 3 |
| Dano de combate causado | 9172.5 | 5352.5 |
| Dano de combate recebido | 5352.5 | 9172.5 |
| Penalizações de HP | 0 | 965 |
| Dano excedente | 130 | 287.5 |

## Alertas

- J1: a bateria não contém cartas de nível 2.
- J1: a bateria não contém cartas de nível 3.
- J1: a bateria não contém cartas de nível 4.
- J2: existem cartas de nível 3 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
