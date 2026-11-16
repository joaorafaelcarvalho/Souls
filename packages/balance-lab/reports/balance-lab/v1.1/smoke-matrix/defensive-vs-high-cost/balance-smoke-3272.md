# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 10.05
- Turnos médios: 19
- Vitórias J1/J2: 18 / 2
- Prioridade forçada: J1

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | defensive | Laboratório · defensive | 20 | 18 | 2 | 0 | 20 | 18 | 90% | 10.05 | 1327.5 | 1525 |
| J2 | high-cost | Laboratório · high-cost | 20 | 2 | 18 | 0 | 0 | 0 | 10% | 10.05 | 1525 | 1327.5 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · defensive | defensive | 20 | 10 | 2 | 4 | 3 | 1 | 17 | sim |
| J2 | Laboratório · high-cost | high-cost | 20 | 7 | 5 | 4 | 2 | 2 | 16 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 186 | 139 | 325 | 1 | 1 |
| 1 | 26 | 0 | 26 | 3 | — |
| 2 | 2 | 0 | 2 | 6 | — |
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
| 0 | 0 / 189 / 112 / 0 | 0 / 45 / 0 / 6 |
| 1 | 279 / 7 / 0 / 0 | 918 / 0 / 0 / 0 |
| 2 | 864 / 5 / 0 / 0 | 804 / 0 / 0 / 0 |
| 3 | 752 / 0 / 0 / 0 | 376 / 0 / 0 / 0 |
| 4 | 222 / 0 / 0 / 0 | 346 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.70 | 0.05 | 0.00 | 0.00 |
| 1 | 0.70 | 5.00 | 0.00 | 0.00 |
| 2 | 3.90 | 4.00 | 0.00 | 0.00 |
| 3 | 3.00 | 2.00 | 0.00 | 0.00 |
| 4 | 1.00 | 2.00 | 0.00 | 0.00 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 3.75 | 0.15 |
| Souls gastas médias | 3.45 | 0.1 |
| Dano de combate causado | 1327.5 | 1525 |
| Dano de combate recebido | 1525 | 1327.5 |
| Penalizações de HP | 3332.5 | 8905 |
| Dano excedente | 30 | 285 |

## Alertas

- J1: existem cartas de nível 3 no baralho, mas nenhuma foi invocada.
- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 1 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 2 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 3 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
- J2: a cobertura de níveis 2–4 não foi observada nas partidas; use o cenário determinístico de invocação para separar falha de cobertura de equilíbrio.
