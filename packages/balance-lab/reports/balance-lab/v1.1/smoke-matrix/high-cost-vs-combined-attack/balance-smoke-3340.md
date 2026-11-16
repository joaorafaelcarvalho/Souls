# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 8.6
- Turnos médios: 15.9
- Vitórias J1/J2: 5 / 15
- Prioridade forçada: J1

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | high-cost | Laboratório · high-cost | 20 | 5 | 15 | 0 | 20 | 5 | 25% | 8.6 | 7595 | 9770 |
| J2 | combined-attack | Laboratório · combined-attack | 20 | 15 | 5 | 0 | 0 | 0 | 75% | 8.6 | 9770 | 7595 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · high-cost | high-cost | 20 | 7 | 5 | 4 | 2 | 2 | 16 | sim |
| J2 | Laboratório · combined-attack | combined-attack | 20 | 8 | 5 | 4 | 2 | 1 | 17 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 131 | 147 | 278 | 1 | 1 |
| 1 | 47 | 33 | 80 | 3 | 3 |
| 2 | 16 | 8 | 24 | 4 | 6 |
| 3 | 4 | 0 | 4 | 7 | — |
| 4 | 0 | 1 | 1 | — | 8 |

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
| 0 | 0 / 103 / 0 / 32 | 0 / 93 / 0 / 43 |
| 1 | 552 / 146 / 0 / 0 | 693 / 103 / 4 / 2 |
| 2 | 687 / 43 / 0 / 0 | 627 / 20 / 2 / 0 |
| 3 | 405 / 3 / 0 / 0 | 360 / 2 / 0 / 0 |
| 4 | 458 / 0 / 0 / 0 | 208 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.35 | 0.35 | 0.10 | 0.30 |
| 1 | 2.45 | 3.20 | 0.20 | 0.15 |
| 2 | 3.05 | 3.35 | 0.15 | 0.25 |
| 3 | 1.70 | 1.85 | 0.10 | 0.15 |
| 4 | 1.95 | 0.90 | 0.05 | 0.05 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 6 | 3.15 |
| Souls gastas médias | 5.25 | 2.95 |
| Dano de combate causado | 7595 | 9770 |
| Dano de combate recebido | 9770 | 7595 |
| Penalizações de HP | 50 | 245 |
| Dano excedente | 442.5 | 130 |

## Alertas

- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 3 no baralho, mas nenhuma foi invocada.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
