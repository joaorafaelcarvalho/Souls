# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 9.85
- Turnos médios: 17.8
- Vitórias J1/J2: 1 / 19
- Prioridade forçada: J1

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | aggressive | Laboratório · aggressive | 20 | 1 | 19 | 0 | 20 | 1 | 5% | 9.85 | 3620 | 1185 |
| J2 | defensive | Laboratório · defensive | 20 | 19 | 1 | 0 | 0 | 0 | 95% | 9.85 | 1185 | 3620 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · aggressive | aggressive | 20 | 8 | 5 | 4 | 2 | 1 | 17 | sim |
| J2 | Laboratório · defensive | defensive | 20 | 10 | 2 | 4 | 3 | 1 | 17 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 160 | 180 | 340 | 1 | 1 |
| 1 | 2 | 29 | 31 | 7 | 2 |
| 2 | 0 | 15 | 15 | — | 5 |
| 3 | 0 | 3 | 3 | — | 6 |
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
| 0 | 0 / 65 / 0 / 29 | 0 / 173 / 43 / 0 |
| 1 | 936 / 6 / 0 / 0 | 148 / 15 / 0 / 0 |
| 2 | 871 / 0 / 0 / 0 | 719 / 49 / 0 / 0 |
| 3 | 393 / 0 / 0 / 0 | 599 / 4 / 0 / 0 |
| 4 | 185 / 0 / 0 / 0 | 227 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.00 | 0.75 | 0.00 | 0.25 |
| 1 | 4.90 | 0.55 | 0.00 | 0.00 |
| 2 | 4.00 | 3.25 | 0.00 | 0.00 |
| 3 | 1.95 | 2.80 | 0.05 | 0.05 |
| 4 | 1.00 | 0.95 | 0.00 | 0.05 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 0.3 | 4.9 |
| Souls gastas médias | 0.3 | 4.3 |
| Dano de combate causado | 3620 | 1185 |
| Dano de combate recebido | 1185 | 3620 |
| Penalizações de HP | 9155 | 1562.5 |
| Dano excedente | 360 | 20 |

## Alertas

- J1: existem cartas de nível 2 no baralho, mas nenhuma foi invocada.
- J1: existem cartas de nível 3 no baralho, mas nenhuma foi invocada.
- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
- J1: a cobertura de níveis 2–4 não foi observada nas partidas; use o cenário determinístico de invocação para separar falha de cobertura de equilíbrio.
