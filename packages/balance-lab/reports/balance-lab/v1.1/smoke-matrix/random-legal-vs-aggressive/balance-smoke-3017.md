# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 9.2
- Turnos médios: 16.65
- Vitórias J1/J2: 17 / 3
- Prioridade forçada: J1

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | random-legal | Laboratório · random-legal | 20 | 17 | 3 | 0 | 20 | 17 | 85% | 9.2 | 9000 | 4965 |
| J2 | aggressive | Laboratório · aggressive | 20 | 3 | 17 | 0 | 0 | 0 | 15% | 9.2 | 4965 | 9000 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · random-legal | random-legal | 20 | 15 | 5 | 0 | 0 | 0 | 20 | sim |
| J2 | Laboratório · aggressive | aggressive | 20 | 8 | 5 | 4 | 2 | 1 | 17 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 242 | 135 | 377 | 1 | 1 |
| 1 | 70 | 43 | 113 | 3 | 3 |
| 2 | 0 | 15 | 15 | — | 4 |
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
| 0 | 0 / 576 / 136 / 197 | 0 / 138 / 0 / 77 |
| 1 | 498 / 227 / 49 / 39 | 545 / 129 / 0 / 0 |
| 2 | 0 / 0 / 0 / 0 | 676 / 39 / 0 / 0 |
| 3 | 0 / 0 / 0 / 0 | 417 / 2 / 0 / 0 |
| 4 | 0 / 0 / 0 / 0 | 210 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 2.75 | 0.90 | 0.15 | 0.35 |
| 1 | 1.40 | 2.50 | 0.10 | 0.35 |
| 2 | 0.00 | 3.15 | 0.00 | 0.10 |
| 3 | 0.00 | 1.70 | 0.00 | 0.15 |
| 4 | 0.00 | 0.95 | 0.00 | 0.05 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 7.35 | 5.65 |
| Souls gastas médias | 5.15 | 4.85 |
| Dano de combate causado | 9000 | 4965 |
| Dano de combate recebido | 4965 | 9000 |
| Penalizações de HP | 25 | 1280 |
| Dano excedente | 45 | 400 |

## Alertas

- J1: a bateria não contém cartas de nível 2.
- J1: a bateria não contém cartas de nível 3.
- J1: a bateria não contém cartas de nível 4.
- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
