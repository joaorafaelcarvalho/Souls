# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 8.95
- Turnos médios: 16.3
- Vitórias J1/J2: 17 / 3
- Prioridade forçada: J1

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | random-legal | Laboratório · random-legal | 20 | 17 | 3 | 0 | 20 | 17 | 85% | 8.95 | 8250 | 4440 |
| J2 | balanced | Laboratório · balanced | 20 | 3 | 17 | 0 | 0 | 0 | 15% | 8.95 | 4440 | 8250 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · random-legal | random-legal | 20 | 15 | 5 | 0 | 0 | 0 | 20 | sim |
| J2 | Laboratório · balanced | balanced | 20 | 9 | 5 | 3 | 2 | 1 | 17 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 232 | 137 | 369 | 1 | 1 |
| 1 | 67 | 32 | 99 | 3 | 2 |
| 2 | 0 | 16 | 16 | — | 4 |
| 3 | 0 | 4 | 4 | — | 5 |
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
| 0 | 0 / 600 / 98 / 254 | 0 / 206 / 0 / 167 |
| 1 | 364 / 217 / 25 / 55 | 626 / 131 / 0 / 5 |
| 2 | 0 / 0 / 0 / 0 | 485 / 32 / 0 / 0 |
| 3 | 0 / 0 / 0 / 0 | 354 / 3 / 0 / 0 |
| 4 | 0 / 0 / 0 / 0 | 195 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 2.70 | 1.30 | 0.70 | 0.85 |
| 1 | 1.55 | 2.85 | 0.10 | 0.55 |
| 2 | 0.00 | 2.15 | 0.00 | 0.05 |
| 3 | 0.00 | 1.75 | 0.00 | 0.05 |
| 4 | 0.00 | 0.95 | 0.00 | 0.05 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 7.2 | 5.25 |
| Souls gastas médias | 4.85 | 4.65 |
| Dano de combate causado | 8250 | 4440 |
| Dano de combate recebido | 4440 | 8250 |
| Penalizações de HP | 300 | 1780 |
| Dano excedente | 80 | 335 |

## Alertas

- J1: a bateria não contém cartas de nível 2.
- J1: a bateria não contém cartas de nível 3.
- J1: a bateria não contém cartas de nível 4.
- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
