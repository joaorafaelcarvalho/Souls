# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 8.8
- Turnos médios: 15.75
- Vitórias J1/J2: 0 / 20
- Prioridade forçada: J2

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | balanced | Laboratório · balanced | 20 | 0 | 20 | 0 | 0 | 0 | 0% | 8.8 | 3320 | 8540 |
| J2 | random-legal | Laboratório · random-legal | 20 | 20 | 0 | 0 | 20 | 20 | 100% | 8.8 | 8540 | 3320 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · balanced | balanced | 20 | 9 | 5 | 3 | 2 | 1 | 17 | sim |
| J2 | Laboratório · random-legal | random-legal | 20 | 15 | 5 | 0 | 0 | 0 | 20 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 126 | 240 | 366 | 1 | 1 |
| 1 | 43 | 62 | 105 | 3 | 3 |
| 2 | 17 | 0 | 17 | 5 | — |
| 3 | 3 | 0 | 3 | 6 | — |
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
| 0 | 0 / 272 / 0 / 214 | 0 / 577 / 84 / 220 |
| 1 | 435 / 120 / 2 / 5 | 394 / 198 / 18 / 57 |
| 2 | 461 / 33 / 0 / 0 | 0 / 0 / 0 / 0 |
| 3 | 318 / 2 / 0 / 0 | 0 / 0 / 0 / 0 |
| 4 | 182 / 0 / 0 / 0 | 0 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 2.05 | 2.50 | 0.65 | 0.50 |
| 1 | 2.40 | 1.75 | 0.45 | 0.15 |
| 2 | 1.70 | 0.00 | 0.45 | 0.00 |
| 3 | 1.80 | 0.00 | 0.05 | 0.00 |
| 4 | 0.95 | 0.00 | 0.05 | 0.00 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 6 | 6.1 |
| Souls gastas médias | 5.1 | 4.45 |
| Dano de combate causado | 3320 | 8540 |
| Dano de combate recebido | 8540 | 3320 |
| Penalizações de HP | 1895 | 100 |
| Dano excedente | 435 | 0 |

## Alertas

- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- J2: a bateria não contém cartas de nível 2.
- J2: a bateria não contém cartas de nível 3.
- J2: a bateria não contém cartas de nível 4.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
