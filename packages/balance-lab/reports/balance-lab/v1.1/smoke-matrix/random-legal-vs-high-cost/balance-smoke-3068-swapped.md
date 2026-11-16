# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 8.9
- Turnos médios: 16.15
- Vitórias J1/J2: 2 / 18
- Prioridade forçada: J2

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | high-cost | Laboratório · high-cost | 20 | 2 | 18 | 0 | 0 | 0 | 10% | 8.9 | 4095 | 8090 |
| J2 | random-legal | Laboratório · random-legal | 20 | 18 | 2 | 0 | 20 | 18 | 90% | 8.9 | 8090 | 4095 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · high-cost | high-cost | 20 | 7 | 5 | 4 | 2 | 2 | 16 | sim |
| J2 | Laboratório · random-legal | random-legal | 20 | 15 | 5 | 0 | 0 | 0 | 20 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 117 | 242 | 359 | 1 | 1 |
| 1 | 36 | 51 | 87 | 2 | 4 |
| 2 | 8 | 0 | 8 | 5 | — |
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
| 0 | 0 / 74 / 0 / 21 | 0 / 496 / 173 / 195 |
| 1 | 474 / 98 / 0 / 0 | 508 / 191 / 55 / 48 |
| 2 | 615 / 30 / 0 / 0 | 0 / 0 / 0 / 0 |
| 3 | 400 / 4 / 0 / 0 | 0 / 0 / 0 / 0 |
| 4 | 328 / 0 / 0 / 0 | 0 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.30 | 2.60 | 0.85 | 0.30 |
| 1 | 2.85 | 2.25 | 0.35 | 0.20 |
| 2 | 3.50 | 0.00 | 0.10 | 0.00 |
| 3 | 1.80 | 0.00 | 0.00 | 0.00 |
| 4 | 2.00 | 0.00 | 0.00 | 0.00 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 4.1 | 5.5 |
| Souls gastas médias | 3.55 | 3.9 |
| Dano de combate causado | 4095 | 8090 |
| Dano de combate recebido | 8090 | 4095 |
| Penalizações de HP | 1590 | 155 |
| Dano excedente | 180 | 65 |

## Alertas

- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- J2: a bateria não contém cartas de nível 2.
- J2: a bateria não contém cartas de nível 3.
- J2: a bateria não contém cartas de nível 4.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
