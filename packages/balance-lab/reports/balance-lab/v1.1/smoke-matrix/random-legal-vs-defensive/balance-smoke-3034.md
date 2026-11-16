# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 9.25
- Turnos médios: 16.65
- Vitórias J1/J2: 3 / 17
- Prioridade forçada: J1

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | random-legal | Laboratório · random-legal | 20 | 3 | 17 | 0 | 20 | 3 | 15% | 9.25 | 2610 | 655 |
| J2 | defensive | Laboratório · defensive | 20 | 17 | 3 | 0 | 0 | 0 | 85% | 9.25 | 655 | 2610 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · random-legal | random-legal | 20 | 15 | 5 | 0 | 0 | 0 | 20 | sim |
| J2 | Laboratório · defensive | defensive | 20 | 10 | 2 | 4 | 3 | 1 | 17 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 236 | 172 | 408 | 1 | 1 |
| 1 | 8 | 24 | 32 | 3 | 2 |
| 2 | 0 | 5 | 5 | — | 5 |
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
| 0 | 0 / 333 / 318 / 134 | 0 / 128 / 38 / 0 |
| 1 | 999 / 14 / 3 / 0 | 221 / 17 / 0 / 0 |
| 2 | 0 / 0 / 0 / 0 | 767 / 11 / 0 / 0 |
| 3 | 0 / 0 / 0 / 0 | 506 / 0 / 0 / 0 |
| 4 | 0 / 0 / 0 / 0 | 165 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 3.10 | 1.05 | 0.10 | 0.35 |
| 1 | 4.55 | 0.80 | 0.05 | 0.00 |
| 2 | 0.00 | 3.70 | 0.00 | 0.05 |
| 3 | 0.00 | 2.75 | 0.00 | 0.25 |
| 4 | 0.00 | 0.95 | 0.00 | 0.05 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 0.8 | 2.4 |
| Souls gastas médias | 0.8 | 2.4 |
| Dano de combate causado | 2610 | 655 |
| Dano de combate recebido | 655 | 2610 |
| Penalizações de HP | 9105 | 5255 |
| Dano excedente | 272.5 | 75 |

## Alertas

- J1: a bateria não contém cartas de nível 2.
- J1: a bateria não contém cartas de nível 3.
- J1: a bateria não contém cartas de nível 4.
- J2: existem cartas de nível 3 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
