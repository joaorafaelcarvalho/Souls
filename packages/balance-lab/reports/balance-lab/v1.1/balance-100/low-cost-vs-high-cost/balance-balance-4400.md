# SOULS Balance Lab v1.1

- Jogos: 100
- Concluídos: 100
- Inconclusivos: 0
- Rondas médias: 8.52
- Turnos médios: 15.38
- Vitórias J1/J2: 96 / 4
- Prioridade forçada: J1

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | low-cost | Laboratório · low-cost | 100 | 96 | 4 | 0 | 100 | 96 | 96% | 8.52 | 8492 | 2872 |
| J2 | high-cost | Laboratório · high-cost | 100 | 4 | 96 | 0 | 0 | 0 | 4% | 8.52 | 2872 | 8492 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · low-cost | low-cost | 20 | 17 | 3 | 0 | 0 | 0 | 21 | sim |
| J2 | Laboratório · high-cost | high-cost | 20 | 7 | 5 | 4 | 2 | 2 | 16 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 1382 | 586 | 1968 | 1 | 1 |
| 1 | 155 | 221 | 376 | 3 | 2 |
| 2 | 0 | 65 | 65 | — | 5 |
| 3 | 0 | 23 | 23 | — | 5 |
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
| 0 | 0 / 3266 / 424 / 396 | 0 / 493 / 0 / 170 |
| 1 | 1461 / 756 / 181 / 134 | 2155 / 614 / 1 / 1 |
| 2 | 0 / 0 / 0 / 0 | 2780 / 197 / 0 / 0 |
| 3 | 0 / 0 / 0 / 0 | 1518 / 14 / 0 / 0 |
| 4 | 0 / 0 / 0 / 0 | 1791 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 2.23 | 0.47 | 0.95 | 0.67 |
| 1 | 1.36 | 2.26 | 0.09 | 0.53 |
| 2 | 0.00 | 2.90 | 0.00 | 0.45 |
| 3 | 0.00 | 1.58 | 0.00 | 0.19 |
| 4 | 0.00 | 1.88 | 0.00 | 0.12 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 5.26 | 5.26 |
| Souls gastas médias | 2.7 | 4.67 |
| Dano de combate causado | 8492 | 2872 |
| Dano de combate recebido | 2872 | 8492 |
| Penalizações de HP | 58 | 1657 |
| Dano excedente | 22 | 292 |

## Alertas

- J1: a bateria não contém cartas de nível 2.
- J1: a bateria não contém cartas de nível 3.
- J1: a bateria não contém cartas de nível 4.
- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
