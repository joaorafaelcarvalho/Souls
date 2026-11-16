# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 8.65
- Turnos médios: 15.65
- Vitórias J1/J2: 10 / 10
- Prioridade forçada: J1

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | balanced | Laboratório · balanced | 20 | 10 | 10 | 0 | 20 | 10 | 50% | 8.65 | 8727.5 | 7290 |
| J2 | high-cost | Laboratório · high-cost | 20 | 10 | 10 | 0 | 0 | 0 | 50% | 8.65 | 7290 | 8727.5 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · balanced | balanced | 20 | 9 | 5 | 3 | 2 | 1 | 17 | sim |
| J2 | Laboratório · high-cost | high-cost | 20 | 7 | 5 | 4 | 2 | 2 | 16 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 152 | 122 | 274 | 1 | 1 |
| 1 | 37 | 47 | 84 | 3 | 2 |
| 2 | 15 | 18 | 33 | 6 | 4 |
| 3 | 4 | 5 | 9 | 7 | 7 |
| 4 | 1 | 0 | 1 | 8 | — |

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
| 0 | 0 / 212 / 0 / 166 | 0 / 103 / 0 / 28 |
| 1 | 657 / 159 / 2 / 3 | 481 / 136 / 0 / 0 |
| 2 | 513 / 32 / 0 / 0 | 605 / 51 / 0 / 0 |
| 3 | 450 / 5 / 0 / 0 | 346 / 4 / 0 / 0 |
| 4 | 180 / 0 / 0 / 0 | 331 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 1.20 | 0.35 | 0.20 | 0.55 |
| 1 | 2.90 | 2.45 | 0.25 | 0.20 |
| 2 | 2.20 | 2.85 | 0.05 | 0.25 |
| 3 | 1.80 | 1.60 | 0.00 | 0.15 |
| 4 | 0.90 | 1.80 | 0.05 | 0.20 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 5.5 | 5.75 |
| Souls gastas médias | 4.9 | 5.15 |
| Dano de combate causado | 8727.5 | 7290 |
| Dano de combate recebido | 7290 | 8727.5 |
| Penalizações de HP | 270 | 50 |
| Dano excedente | 270 | 122.5 |

## Alertas

- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
