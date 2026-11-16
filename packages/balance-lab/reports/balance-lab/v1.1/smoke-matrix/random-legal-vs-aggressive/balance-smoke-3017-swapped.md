# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 8.75
- Turnos médios: 15.7
- Vitórias J1/J2: 3 / 17
- Prioridade forçada: J2

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | aggressive | Laboratório · aggressive | 20 | 3 | 17 | 0 | 0 | 0 | 15% | 8.75 | 5797.5 | 8265 |
| J2 | random-legal | Laboratório · random-legal | 20 | 17 | 3 | 0 | 20 | 17 | 85% | 8.75 | 8265 | 5797.5 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · aggressive | aggressive | 20 | 8 | 5 | 4 | 2 | 1 | 17 | sim |
| J2 | Laboratório · random-legal | random-legal | 20 | 15 | 5 | 0 | 0 | 0 | 20 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 134 | 234 | 368 | 1 | 1 |
| 1 | 46 | 68 | 114 | 3 | 3 |
| 2 | 13 | 0 | 13 | 5 | — |
| 3 | 3 | 0 | 3 | 5 | — |
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
| 0 | 0 / 129 / 0 / 68 | 0 / 510 / 98 / 182 |
| 1 | 454 / 107 / 0 / 0 | 467 / 207 / 48 / 49 |
| 2 | 644 / 33 / 0 / 0 | 0 / 0 / 0 / 0 |
| 3 | 372 / 0 / 0 / 0 | 0 / 0 / 0 / 0 |
| 4 | 208 / 0 / 0 / 0 | 0 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.70 | 2.70 | 0.60 | 0.60 |
| 1 | 2.20 | 1.55 | 0.50 | 0.05 |
| 2 | 2.95 | 0.00 | 0.40 | 0.00 |
| 3 | 1.70 | 0.00 | 0.15 | 0.00 |
| 4 | 1.00 | 0.00 | 0.00 | 0.00 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 5.3 | 7.55 |
| Souls gastas médias | 4.7 | 4.55 |
| Dano de combate causado | 5797.5 | 8265 |
| Dano de combate recebido | 8265 | 5797.5 |
| Penalizações de HP | 1580 | 150 |
| Dano excedente | 260 | 60 |

## Alertas

- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- J2: a bateria não contém cartas de nível 2.
- J2: a bateria não contém cartas de nível 3.
- J2: a bateria não contém cartas de nível 4.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
