# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 8.9
- Turnos médios: 16.1
- Vitórias J1/J2: 16 / 4
- Prioridade forçada: J1

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | random-legal | Laboratório · random-legal | 20 | 16 | 4 | 0 | 20 | 16 | 80% | 8.9 | 8852.5 | 6480 |
| J2 | combined-attack | Laboratório · combined-attack | 20 | 4 | 16 | 0 | 0 | 0 | 20% | 8.9 | 6480 | 8852.5 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · random-legal | random-legal | 20 | 15 | 5 | 0 | 0 | 0 | 20 | sim |
| J2 | Laboratório · combined-attack | combined-attack | 20 | 8 | 5 | 4 | 2 | 1 | 17 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 239 | 143 | 382 | 1 | 1 |
| 1 | 67 | 34 | 101 | 3 | 3 |
| 2 | 0 | 9 | 9 | — | 5 |
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
| 0 | 0 / 611 / 37 / 240 | 0 / 111 / 0 / 52 |
| 1 | 334 / 250 / 16 / 72 | 633 / 95 / 0 / 2 |
| 2 | 0 / 0 / 0 / 0 | 630 / 15 / 0 / 0 |
| 3 | 0 / 0 / 0 / 0 | 385 / 0 / 0 / 0 |
| 4 | 0 / 0 / 0 / 0 | 196 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 2.65 | 0.20 | 0.40 | 0.65 |
| 1 | 1.55 | 3.05 | 0.10 | 0.25 |
| 2 | 0.00 | 3.25 | 0.00 | 0.30 |
| 3 | 0.00 | 1.90 | 0.00 | 0.10 |
| 4 | 0.00 | 1.00 | 0.00 | 0.00 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 7.7 | 3.65 |
| Souls gastas médias | 4.9 | 2.95 |
| Dano de combate causado | 8852.5 | 6480 |
| Dano de combate recebido | 6480 | 8852.5 |
| Penalizações de HP | 0 | 935 |
| Dano excedente | 75 | 327.5 |

## Alertas

- J1: a bateria não contém cartas de nível 2.
- J1: a bateria não contém cartas de nível 3.
- J1: a bateria não contém cartas de nível 4.
- J2: existem cartas de nível 3 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
