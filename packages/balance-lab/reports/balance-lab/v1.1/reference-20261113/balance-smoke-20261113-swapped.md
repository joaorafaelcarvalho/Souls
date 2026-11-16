# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 8.55
- Turnos médios: 15.85
- Vitórias J1/J2: 14 / 6
- Prioridade forçada: J2

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | aggressive | Laboratório · aggressive | 20 | 14 | 6 | 0 | 0 | 0 | 70% | 8.55 | 9247.5 | 7717.5 |
| J2 | balanced | Laboratório · balanced | 20 | 6 | 14 | 0 | 20 | 6 | 30% | 8.55 | 7717.5 | 9247.5 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · aggressive | aggressive | 20 | 8 | 5 | 4 | 2 | 1 | 17 | sim |
| J2 | Laboratório · balanced | balanced | 20 | 9 | 5 | 3 | 2 | 1 | 17 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 138 | 144 | 282 | 1 | 1 |
| 1 | 52 | 44 | 96 | 2 | 4 |
| 2 | 15 | 19 | 34 | 5 | 6 |
| 3 | 3 | 4 | 7 | 6 | 7 |
| 4 | 0 | 1 | 1 | — | 6 |

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
| 0 | 0 / 149 / 0 / 78 | 0 / 217 / 0 / 163 |
| 1 | 463 / 131 / 0 / 0 | 606 / 162 / 1 / 12 |
| 2 | 681 / 39 / 0 / 0 | 488 / 42 / 0 / 0 |
| 3 | 351 / 2 / 0 / 0 | 419 / 5 / 0 / 0 |
| 4 | 200 / 0 / 0 / 0 | 181 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.75 | 1.35 | 0.35 | 0.45 |
| 1 | 2.00 | 2.60 | 0.40 | 0.20 |
| 2 | 3.10 | 1.90 | 0.15 | 0.15 |
| 3 | 1.60 | 1.75 | 0.25 | 0.05 |
| 4 | 0.90 | 0.85 | 0.10 | 0.10 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 5.15 | 7 |
| Souls gastas médias | 4.8 | 5.75 |
| Dano de combate causado | 9247.5 | 7717.5 |
| Dano de combate recebido | 7717.5 | 9247.5 |
| Penalizações de HP | 500 | 200 |
| Dano excedente | 117.5 | 325 |

## Alertas

- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
