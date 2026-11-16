# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 9.7
- Turnos médios: 18.15
- Vitórias J1/J2: 5 / 15
- Prioridade forçada: J2

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | high-cost | Laboratório · high-cost | 20 | 5 | 15 | 0 | 0 | 0 | 25% | 9.7 | 2370 | 1130 |
| J2 | defensive | Laboratório · defensive | 20 | 15 | 5 | 0 | 20 | 15 | 75% | 9.7 | 1130 | 2370 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · high-cost | high-cost | 20 | 7 | 5 | 4 | 2 | 2 | 16 | sim |
| J2 | Laboratório · defensive | defensive | 20 | 10 | 2 | 4 | 3 | 1 | 17 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 136 | 180 | 316 | 1 | 1 |
| 1 | 2 | 28 | 30 | 3 | 3 |
| 2 | 0 | 5 | 5 | — | 4 |
| 3 | 0 | 1 | 1 | — | 6 |
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
| 0 | 0 / 35 / 0 / 11 | 0 / 168 / 67 / 0 |
| 1 | 939 / 3 / 0 / 0 | 234 / 10 / 0 / 0 |
| 2 | 650 / 0 / 0 / 0 | 911 / 15 / 0 / 0 |
| 3 | 408 / 0 / 0 / 0 | 644 / 1 / 0 / 0 |
| 4 | 328 / 0 / 0 / 0 | 207 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.05 | 1.00 | 0.15 | 0.00 |
| 1 | 4.90 | 0.60 | 0.00 | 0.00 |
| 2 | 3.85 | 3.55 | 0.15 | 0.20 |
| 3 | 2.00 | 2.85 | 0.00 | 0.10 |
| 4 | 2.00 | 1.00 | 0.00 | 0.00 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 0.25 | 3.65 |
| Souls gastas médias | 0.25 | 3.3 |
| Dano de combate causado | 2370 | 1130 |
| Dano de combate recebido | 1130 | 2370 |
| Penalizações de HP | 8590 | 4177.5 |
| Dano excedente | 275 | 135 |

## Alertas

- J1: existem cartas de nível 2 no baralho, mas nenhuma foi invocada.
- J1: existem cartas de nível 3 no baralho, mas nenhuma foi invocada.
- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
- J1: a cobertura de níveis 2–4 não foi observada nas partidas; use o cenário determinístico de invocação para separar falha de cobertura de equilíbrio.
