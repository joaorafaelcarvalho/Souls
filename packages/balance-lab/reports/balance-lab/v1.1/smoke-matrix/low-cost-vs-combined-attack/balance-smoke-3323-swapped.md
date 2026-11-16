# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 8.5
- Turnos médios: 15
- Vitórias J1/J2: 0 / 20
- Prioridade forçada: J2

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | combined-attack | Laboratório · combined-attack | 20 | 0 | 20 | 0 | 0 | 0 | 0% | 8.5 | 3230 | 9850 |
| J2 | low-cost | Laboratório · low-cost | 20 | 20 | 0 | 0 | 20 | 20 | 100% | 8.5 | 9850 | 3230 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · combined-attack | combined-attack | 20 | 8 | 5 | 4 | 2 | 1 | 17 | sim |
| J2 | Laboratório · low-cost | low-cost | 20 | 17 | 3 | 0 | 0 | 0 | 21 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 133 | 282 | 415 | 1 | 1 |
| 1 | 28 | 37 | 65 | 2 | 3 |
| 2 | 7 | 0 | 7 | 5 | — |
| 3 | 4 | 0 | 4 | 6 | — |
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
| 0 | 0 / 102 / 0 / 50 | 0 / 751 / 43 / 101 |
| 1 | 510 / 99 / 0 / 0 | 168 / 165 / 23 / 30 |
| 2 | 651 / 32 / 0 / 0 | 0 / 0 / 0 / 0 |
| 3 | 302 / 4 / 0 / 0 | 0 / 0 / 0 / 0 |
| 4 | 157 / 0 / 0 / 0 | 0 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.20 | 2.10 | 1.15 | 0.80 |
| 1 | 3.10 | 1.05 | 0.50 | 0.10 |
| 2 | 3.25 | 0.00 | 0.40 | 0.00 |
| 3 | 1.65 | 0.00 | 0.15 | 0.00 |
| 4 | 1.00 | 0.00 | 0.00 | 0.00 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 3.25 | 5.8 |
| Souls gastas médias | 2.85 | 2.95 |
| Dano de combate causado | 3230 | 9850 |
| Dano de combate recebido | 9850 | 3230 |
| Penalizações de HP | 525 | 0 |
| Dano excedente | 375 | 0 |

## Alertas

- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- J2: a bateria não contém cartas de nível 2.
- J2: a bateria não contém cartas de nível 3.
- J2: a bateria não contém cartas de nível 4.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
