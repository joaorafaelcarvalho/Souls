# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 10.15
- Turnos médios: 18.3
- Vitórias J1/J2: 20 / 0
- Prioridade forçada: J2

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | defensive | Laboratório · defensive | 20 | 20 | 0 | 0 | 0 | 0 | 100% | 10.15 | 345 | 3612.5 |
| J2 | balanced | Laboratório · balanced | 20 | 0 | 20 | 0 | 20 | 0 | 0% | 10.15 | 3612.5 | 345 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · defensive | defensive | 20 | 10 | 2 | 4 | 3 | 1 | 17 | sim |
| J2 | Laboratório · balanced | balanced | 20 | 9 | 5 | 3 | 2 | 1 | 17 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 186 | 177 | 363 | 1 | 1 |
| 1 | 30 | 0 | 30 | 2 | — |
| 2 | 27 | 0 | 27 | 3 | — |
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
| 0 | 0 / 219 / 47 / 0 | 0 / 117 / 0 / 94 |
| 1 | 158 / 29 / 0 / 0 | 1121 / 0 / 0 / 0 |
| 2 | 679 / 59 / 0 / 0 | 749 / 0 / 0 / 0 |
| 3 | 656 / 4 / 0 / 0 | 482 / 0 / 0 / 0 |
| 4 | 246 / 0 / 0 / 0 | 209 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.65 | 0.15 | 0.05 | 0.00 |
| 1 | 0.50 | 5.00 | 0.00 | 0.00 |
| 2 | 2.55 | 3.00 | 0.10 | 0.00 |
| 3 | 2.85 | 2.00 | 0.05 | 0.00 |
| 4 | 1.00 | 1.00 | 0.00 | 0.00 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 6.25 | 0.1 |
| Souls gastas médias | 5.55 | 0.1 |
| Dano de combate causado | 345 | 3612.5 |
| Dano de combate recebido | 3612.5 | 345 |
| Penalizações de HP | 1310 | 10017.5 |
| Dano excedente | 0 | 362.5 |

## Alertas

- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 1 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 2 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 3 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
- J2: a cobertura de níveis 2–4 não foi observada nas partidas; use o cenário determinístico de invocação para separar falha de cobertura de equilíbrio.
