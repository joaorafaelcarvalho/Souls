# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 10.45
- Turnos médios: 19.8
- Vitórias J1/J2: 18 / 2
- Prioridade forçada: J1

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | defensive | Laboratório · defensive | 20 | 18 | 2 | 0 | 20 | 18 | 90% | 10.45 | 1915 | 2712.5 |
| J2 | combined-attack | Laboratório · combined-attack | 20 | 2 | 18 | 0 | 0 | 0 | 10% | 10.45 | 2712.5 | 1915 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · defensive | defensive | 20 | 10 | 2 | 4 | 3 | 1 | 17 | sim |
| J2 | Laboratório · combined-attack | combined-attack | 20 | 8 | 5 | 4 | 2 | 1 | 17 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 194 | 160 | 354 | 1 | 1 |
| 1 | 24 | 5 | 29 | 3 | 3 |
| 2 | 9 | 0 | 9 | 6 | — |
| 3 | 4 | 0 | 4 | 5 | — |
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
| 0 | 0 / 179 / 63 / 0 | 0 / 78 / 0 / 47 |
| 1 | 238 / 15 / 0 / 0 | 1018 / 9 / 2 / 0 |
| 2 | 954 / 38 / 0 / 0 | 845 / 0 / 0 / 0 |
| 3 | 719 / 5 / 0 / 0 | 460 / 0 / 0 / 0 |
| 4 | 238 / 0 / 0 / 0 | 209 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.30 | 0.00 | 0.00 | 0.00 |
| 1 | 0.80 | 4.75 | 0.00 | 0.00 |
| 2 | 3.55 | 4.00 | 0.00 | 0.00 |
| 3 | 2.80 | 2.00 | 0.00 | 0.00 |
| 4 | 1.00 | 1.00 | 0.00 | 0.00 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 5.2 | 0.25 |
| Souls gastas médias | 5 | 0.25 |
| Dano de combate causado | 1915 | 2712.5 |
| Dano de combate recebido | 2712.5 | 1915 |
| Penalizações de HP | 3485 | 8350 |
| Dano excedente | 40 | 320 |

## Alertas

- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 2 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 3 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
- J2: a cobertura de níveis 2–4 não foi observada nas partidas; use o cenário determinístico de invocação para separar falha de cobertura de equilíbrio.
