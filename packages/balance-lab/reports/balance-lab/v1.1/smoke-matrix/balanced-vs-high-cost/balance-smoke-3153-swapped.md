# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 8.9
- Turnos médios: 16.3
- Vitórias J1/J2: 13 / 7
- Prioridade forçada: J2

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | high-cost | Laboratório · high-cost | 20 | 13 | 7 | 0 | 0 | 0 | 65% | 8.9 | 8070 | 8385 |
| J2 | balanced | Laboratório · balanced | 20 | 7 | 13 | 0 | 20 | 7 | 35% | 8.9 | 8385 | 8070 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · high-cost | high-cost | 20 | 7 | 5 | 4 | 2 | 2 | 16 | sim |
| J2 | Laboratório · balanced | balanced | 20 | 9 | 5 | 3 | 2 | 1 | 17 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 128 | 141 | 269 | 1 | 1 |
| 1 | 49 | 50 | 99 | 2 | 3 |
| 2 | 16 | 12 | 28 | 4 | 6 |
| 3 | 2 | 3 | 5 | 6 | 7 |
| 4 | 0 | 3 | 3 | — | 7 |

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
| 0 | 0 / 103 / 0 / 39 | 0 / 256 / 0 / 206 |
| 1 | 556 / 144 / 0 / 0 | 629 / 144 / 0 / 12 |
| 2 | 619 / 38 / 0 / 0 | 547 / 35 / 0 / 0 |
| 3 | 379 / 2 / 0 / 0 | 420 / 10 / 0 / 0 |
| 4 | 383 / 0 / 0 / 0 | 207 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.30 | 1.75 | 0.30 | 0.20 |
| 1 | 2.25 | 2.25 | 0.30 | 0.25 |
| 2 | 3.00 | 2.35 | 0.20 | 0.05 |
| 3 | 1.75 | 1.80 | 0.15 | 0.05 |
| 4 | 1.95 | 0.85 | 0.05 | 0.00 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 5.15 | 6.4 |
| Souls gastas médias | 4.95 | 5.65 |
| Dano de combate causado | 8070 | 8385 |
| Dano de combate recebido | 8385 | 8070 |
| Penalizações de HP | 200 | 470 |
| Dano excedente | 140 | 360 |

## Alertas

- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
