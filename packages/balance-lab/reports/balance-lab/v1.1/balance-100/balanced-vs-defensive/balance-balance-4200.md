# SOULS Balance Lab v1.1

- Jogos: 100
- Concluídos: 100
- Inconclusivos: 0
- Rondas médias: 10.22
- Turnos médios: 18.5
- Vitórias J1/J2: 6 / 94
- Prioridade forçada: J1

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | balanced | Laboratório · balanced | 100 | 6 | 94 | 0 | 100 | 6 | 6% | 10.22 | 3969 | 875.5 |
| J2 | defensive | Laboratório · defensive | 100 | 94 | 6 | 0 | 0 | 0 | 94% | 10.22 | 875.5 | 3969 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · balanced | balanced | 20 | 9 | 5 | 3 | 2 | 1 | 17 | sim |
| J2 | Laboratório · defensive | defensive | 20 | 10 | 2 | 4 | 3 | 1 | 17 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 890 | 948 | 1838 | 1 | 1 |
| 1 | 10 | 158 | 168 | 5 | 2 |
| 2 | 0 | 103 | 103 | — | 3 |
| 3 | 0 | 14 | 14 | — | 5 |
| 4 | 0 | 1 | 1 | — | 8 |

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
| 0 | 0 / 734 / 0 / 596 | 0 / 986 / 227 / 0 |
| 1 | 5423 / 26 / 4 / 0 | 769 / 99 / 0 / 0 |
| 2 | 3365 / 0 / 0 / 0 | 3593 / 264 / 0 / 0 |
| 3 | 2330 / 0 / 0 / 0 | 3244 / 24 / 0 / 0 |
| 4 | 1163 / 0 / 0 / 0 | 1163 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.08 | 0.44 | 0.02 | 0.08 |
| 1 | 4.90 | 0.42 | 0.00 | 0.00 |
| 2 | 3.00 | 2.96 | 0.00 | 0.01 |
| 3 | 2.00 | 2.83 | 0.00 | 0.03 |
| 4 | 1.00 | 0.97 | 0.00 | 0.02 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 0.36 | 5.95 |
| Souls gastas médias | 0.35 | 5.48 |
| Dano de combate causado | 3969 | 875.5 |
| Dano de combate recebido | 875.5 | 3969 |
| Penalizações de HP | 9369.5 | 1277.5 |
| Dano excedente | 384.5 | 13 |

## Alertas

- J1: existem cartas de nível 2 no baralho, mas nenhuma foi invocada.
- J1: existem cartas de nível 3 no baralho, mas nenhuma foi invocada.
- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
- J1: a cobertura de níveis 2–4 não foi observada nas partidas; use o cenário determinístico de invocação para separar falha de cobertura de equilíbrio.
