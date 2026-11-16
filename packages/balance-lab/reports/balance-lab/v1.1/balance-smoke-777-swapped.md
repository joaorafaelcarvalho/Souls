# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 8.4
- Turnos médios: 15.45
- Vitórias J1/J2: 12 / 8
- Prioridade forçada: J2

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | aggressive | Laboratório · aggressive | 20 | 12 | 8 | 0 | 0 | 0 | 60% | 8.4 | 9365 | 7285 |
| J2 | balanced | Laboratório · balanced | 20 | 8 | 12 | 0 | 20 | 8 | 40% | 8.4 | 7285 | 9365 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · aggressive | aggressive | 20 | 8 | 5 | 4 | 2 | 1 | 17 | sim |
| J2 | Laboratório · balanced | balanced | 20 | 9 | 5 | 3 | 2 | 1 | 17 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 130 | 130 | 260 | 1 | 1 |
| 1 | 52 | 52 | 104 | 3 | 3 |
| 2 | 14 | 22 | 36 | 3 | 5 |
| 3 | 2 | 4 | 6 | 7 | 7 |
| 4 | 0 | 2 | 2 | — | 8 |

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
| 0 | 0 / 136 / 0 / 78 | 0 / 268 / 0 / 204 |
| 1 | 421 / 121 / 0 / 0 | 501 / 173 / 0 / 10 |
| 2 | 666 / 34 / 0 / 0 | 507 / 47 / 0 / 0 |
| 3 | 373 / 2 / 0 / 0 | 328 / 9 / 0 / 0 |
| 4 | 201 / 0 / 0 / 0 | 206 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.80 | 1.90 | 0.70 | 0.60 |
| 1 | 2.00 | 2.15 | 0.40 | 0.25 |
| 2 | 3.10 | 1.80 | 0.20 | 0.10 |
| 3 | 1.70 | 1.70 | 0.20 | 0.10 |
| 4 | 0.95 | 0.90 | 0.05 | 0.00 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 4.8 | 7.5 |
| Souls gastas médias | 4.55 | 6.6 |
| Dano de combate causado | 9365 | 7285 |
| Dano de combate recebido | 7285 | 9365 |
| Penalizações de HP | 350 | 50 |
| Dano excedente | 200 | 305 |

## Alertas

- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
