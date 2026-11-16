# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 9.45
- Turnos médios: 17.15
- Vitórias J1/J2: 16 / 4
- Prioridade forçada: J2

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | low-cost | Laboratório · low-cost | 20 | 16 | 4 | 0 | 0 | 0 | 80% | 9.45 | 1095 | 630 |
| J2 | defensive | Laboratório · defensive | 20 | 4 | 16 | 0 | 20 | 4 | 20% | 9.45 | 630 | 1095 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · low-cost | low-cost | 20 | 17 | 3 | 0 | 0 | 0 | 21 | sim |
| J2 | Laboratório · defensive | defensive | 20 | 10 | 2 | 4 | 3 | 1 | 17 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 245 | 177 | 422 | 1 | 1 |
| 1 | 0 | 27 | 27 | — | 3 |
| 2 | 0 | 5 | 5 | — | 6 |
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
| 0 | 0 / 550 / 334 / 77 | 0 / 158 / 67 / 0 |
| 1 | 606 / 4 / 6 / 0 | 184 / 13 / 0 / 0 |
| 2 | 0 / 0 / 0 / 0 | 833 / 10 / 0 / 0 |
| 3 | 0 / 0 / 0 / 0 | 572 / 0 / 0 / 0 |
| 4 | 0 / 0 / 0 / 0 | 191 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 4.20 | 1.10 | 0.55 | 0.05 |
| 1 | 3.00 | 0.65 | 0.00 | 0.00 |
| 2 | 0.00 | 3.65 | 0.00 | 0.10 |
| 3 | 0.00 | 2.95 | 0.00 | 0.05 |
| 4 | 0.00 | 1.00 | 0.00 | 0.00 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 0.6 | 2.6 |
| Souls gastas médias | 0.55 | 2.55 |
| Dano de combate causado | 1095 | 630 |
| Dano de combate recebido | 630 | 1095 |
| Penalizações de HP | 6660 | 8510 |
| Dano excedente | 70 | 245 |

## Alertas

- J1: existem cartas de nível 1 no baralho, mas nenhuma foi invocada.
- J1: a bateria não contém cartas de nível 2.
- J1: a bateria não contém cartas de nível 3.
- J1: a bateria não contém cartas de nível 4.
- J2: existem cartas de nível 3 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
