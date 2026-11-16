# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 9.15
- Turnos médios: 17
- Vitórias J1/J2: 1 / 19
- Prioridade forçada: J1

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | balanced | Laboratório · balanced | 20 | 1 | 19 | 0 | 20 | 1 | 5% | 9.15 | 4605 | 7850 |
| J2 | low-cost | Laboratório · low-cost | 20 | 19 | 1 | 0 | 0 | 0 | 95% | 9.15 | 7850 | 4605 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · balanced | balanced | 20 | 9 | 5 | 3 | 2 | 1 | 17 | sim |
| J2 | Laboratório · low-cost | low-cost | 20 | 17 | 3 | 0 | 0 | 0 | 21 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 147 | 297 | 444 | 1 | 1 |
| 1 | 52 | 39 | 91 | 3 | 2 |
| 2 | 19 | 0 | 19 | 5 | — |
| 3 | 2 | 0 | 2 | 8 | — |
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
| 0 | 0 / 221 / 0 / 157 | 0 / 748 / 50 / 80 |
| 1 | 652 / 173 / 0 / 8 | 177 / 153 / 30 / 24 |
| 2 | 500 / 29 / 0 / 0 | 0 / 0 / 0 / 0 |
| 3 | 474 / 2 / 0 / 0 | 0 / 0 / 0 / 0 |
| 4 | 236 / 0 / 0 / 0 | 0 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 1.35 | 1.70 | 0.30 | 0.45 |
| 1 | 2.30 | 0.90 | 0.10 | 0.15 |
| 2 | 2.00 | 0.00 | 0.05 | 0.00 |
| 3 | 1.85 | 0.00 | 0.05 | 0.00 |
| 4 | 0.95 | 0.00 | 0.05 | 0.00 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 7.5 | 6.15 |
| Souls gastas médias | 6.55 | 3.2 |
| Dano de combate causado | 4605 | 7850 |
| Dano de combate recebido | 7850 | 4605 |
| Penalizações de HP | 2505 | 50 |
| Dano excedente | 465 | 25 |

## Alertas

- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- J2: a bateria não contém cartas de nível 2.
- J2: a bateria não contém cartas de nível 3.
- J2: a bateria não contém cartas de nível 4.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
