# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 8.1
- Turnos médios: 14.6
- Vitórias J1/J2: 8 / 12
- Prioridade forçada: J2

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | combined-attack | Laboratório · combined-attack | 20 | 8 | 12 | 0 | 0 | 0 | 40% | 8.1 | 8330 | 9377.5 |
| J2 | aggressive | Laboratório · aggressive | 20 | 12 | 8 | 0 | 20 | 12 | 60% | 8.1 | 9377.5 | 8330 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · combined-attack | combined-attack | 20 | 8 | 5 | 4 | 2 | 1 | 17 | sim |
| J2 | Laboratório · aggressive | aggressive | 20 | 8 | 5 | 4 | 2 | 1 | 17 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 131 | 134 | 265 | 1 | 1 |
| 1 | 35 | 46 | 81 | 2 | 3 |
| 2 | 10 | 11 | 21 | 5 | 5 |
| 3 | 4 | 3 | 7 | 6 | 7 |
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
| 0 | 0 / 110 / 0 / 42 | 0 / 142 / 0 / 72 |
| 1 | 507 / 113 / 0 / 0 | 548 / 130 / 0 / 0 |
| 2 | 592 / 37 / 0 / 0 | 670 / 37 / 0 / 0 |
| 3 | 331 / 3 / 0 / 0 | 359 / 1 / 0 / 0 |
| 4 | 170 / 0 / 0 / 0 | 199 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.60 | 0.80 | 0.85 | 0.50 |
| 1 | 2.80 | 2.40 | 0.45 | 0.30 |
| 2 | 3.05 | 3.25 | 0.45 | 0.20 |
| 3 | 1.50 | 1.75 | 0.30 | 0.10 |
| 4 | 0.90 | 0.95 | 0.10 | 0.05 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 4.05 | 4.6 |
| Souls gastas médias | 3.5 | 4.15 |
| Dano de combate causado | 8330 | 9377.5 |
| Dano de combate recebido | 9377.5 | 8330 |
| Penalizações de HP | 0 | 50 |
| Dano excedente | 250 | 305 |

## Alertas

- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
