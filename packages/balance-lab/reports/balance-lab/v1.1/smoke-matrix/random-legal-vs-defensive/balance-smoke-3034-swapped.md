# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 8.85
- Turnos médios: 16.3
- Vitórias J1/J2: 8 / 12
- Prioridade forçada: J2

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | defensive | Laboratório · defensive | 20 | 8 | 12 | 0 | 0 | 0 | 40% | 8.85 | 485 | 2695 |
| J2 | random-legal | Laboratório · random-legal | 20 | 12 | 8 | 0 | 20 | 12 | 60% | 8.85 | 2695 | 485 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · defensive | defensive | 20 | 10 | 2 | 4 | 3 | 1 | 17 | sim |
| J2 | Laboratório · random-legal | random-legal | 20 | 15 | 5 | 0 | 0 | 0 | 20 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 173 | 235 | 408 | 1 | 1 |
| 1 | 20 | 4 | 24 | 2 | 3 |
| 2 | 8 | 0 | 8 | 4 | — |
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
| 0 | 0 / 135 / 32 / 0 | 0 / 380 / 256 / 126 |
| 1 | 172 / 12 / 0 / 0 | 946 / 9 / 0 / 0 |
| 2 | 688 / 15 / 0 / 0 | 0 / 0 / 0 / 0 |
| 3 | 592 / 0 / 0 / 0 | 0 / 0 / 0 / 0 |
| 4 | 167 / 0 / 0 / 0 | 0 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.95 | 2.85 | 0.40 | 0.40 |
| 1 | 1.00 | 4.75 | 0.00 | 0.05 |
| 2 | 3.40 | 0.00 | 0.20 | 0.00 |
| 3 | 2.90 | 0.00 | 0.10 | 0.00 |
| 4 | 0.95 | 0.00 | 0.05 | 0.00 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 2.25 | 0.5 |
| Souls gastas médias | 2.25 | 0.5 |
| Dano de combate causado | 485 | 2695 |
| Dano de combate recebido | 2695 | 485 |
| Penalizações de HP | 6290 | 7812.5 |
| Dano excedente | 275 | 152.5 |

## Alertas

- J1: existem cartas de nível 3 no baralho, mas nenhuma foi invocada.
- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- J2: a bateria não contém cartas de nível 2.
- J2: a bateria não contém cartas de nível 3.
- J2: a bateria não contém cartas de nível 4.
