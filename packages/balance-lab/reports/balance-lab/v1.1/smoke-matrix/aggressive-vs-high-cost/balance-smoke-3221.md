# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 8.9
- Turnos médios: 16.15
- Vitórias J1/J2: 15 / 5
- Prioridade forçada: J1

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | aggressive | Laboratório · aggressive | 20 | 15 | 5 | 0 | 20 | 15 | 75% | 8.9 | 9627.5 | 6130 |
| J2 | high-cost | Laboratório · high-cost | 20 | 5 | 15 | 0 | 0 | 0 | 25% | 8.9 | 6130 | 9627.5 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · aggressive | aggressive | 20 | 8 | 5 | 4 | 2 | 1 | 17 | sim |
| J2 | Laboratório · high-cost | high-cost | 20 | 7 | 5 | 4 | 2 | 2 | 16 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 143 | 121 | 264 | 1 | 1 |
| 1 | 42 | 39 | 81 | 3 | 3 |
| 2 | 9 | 20 | 29 | 5 | 4 |
| 3 | 1 | 6 | 7 | 7 | 5 |
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
| 0 | 0 / 119 / 0 / 66 | 0 / 114 / 0 / 43 |
| 1 | 768 / 138 / 0 / 0 | 520 / 147 / 0 / 0 |
| 2 | 749 / 22 / 0 / 0 | 546 / 61 / 0 / 0 |
| 3 | 374 / 1 / 0 / 0 | 328 / 4 / 0 / 0 |
| 4 | 199 / 0 / 0 / 0 | 381 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.55 | 0.45 | 0.30 | 0.50 |
| 1 | 2.80 | 2.65 | 0.10 | 0.40 |
| 2 | 3.35 | 2.70 | 0.20 | 0.30 |
| 3 | 1.80 | 1.55 | 0.15 | 0.15 |
| 4 | 0.95 | 1.85 | 0.05 | 0.15 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 4.45 | 6.1 |
| Souls gastas médias | 3.9 | 5.55 |
| Dano de combate causado | 9627.5 | 6130 |
| Dano de combate recebido | 6130 | 9627.5 |
| Penalizações de HP | 850 | 300 |
| Dano excedente | 125 | 382.5 |

## Alertas

- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
