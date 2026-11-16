# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 9.25
- Turnos médios: 17.25
- Vitórias J1/J2: 19 / 1
- Prioridade forçada: J2

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | low-cost | Laboratório · low-cost | 20 | 19 | 1 | 0 | 0 | 0 | 95% | 9.25 | 8417.5 | 4695 |
| J2 | balanced | Laboratório · balanced | 20 | 1 | 19 | 0 | 20 | 1 | 5% | 9.25 | 4695 | 8417.5 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · low-cost | low-cost | 20 | 17 | 3 | 0 | 0 | 0 | 21 | sim |
| J2 | Laboratório · balanced | balanced | 20 | 9 | 5 | 3 | 2 | 1 | 17 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 303 | 144 | 447 | 1 | 1 |
| 1 | 44 | 41 | 85 | 2 | 3 |
| 2 | 0 | 18 | 18 | — | 5 |
| 3 | 0 | 3 | 3 | — | 7 |
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
| 0 | 0 / 728 / 29 / 81 | 0 / 212 / 1 / 158 |
| 1 | 168 / 164 / 15 / 51 | 693 / 170 / 0 / 9 |
| 2 | 0 / 0 / 0 / 0 | 619 / 34 / 0 / 0 |
| 3 | 0 / 0 / 0 / 0 | 454 / 2 / 0 / 0 |
| 4 | 0 / 0 / 0 / 0 | 197 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 1.45 | 1.40 | 0.40 | 0.40 |
| 1 | 0.70 | 2.95 | 0.10 | 0.00 |
| 2 | 0.00 | 2.10 | 0.00 | 0.00 |
| 3 | 0.00 | 1.80 | 0.00 | 0.05 |
| 4 | 0.00 | 0.95 | 0.00 | 0.05 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 6.7 | 6.3 |
| Souls gastas médias | 3.8 | 5.7 |
| Dano de combate causado | 8417.5 | 4695 |
| Dano de combate recebido | 4695 | 8417.5 |
| Penalizações de HP | 50 | 1985 |
| Dano excedente | 7.5 | 450 |

## Alertas

- J1: a bateria não contém cartas de nível 2.
- J1: a bateria não contém cartas de nível 3.
- J1: a bateria não contém cartas de nível 4.
- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
