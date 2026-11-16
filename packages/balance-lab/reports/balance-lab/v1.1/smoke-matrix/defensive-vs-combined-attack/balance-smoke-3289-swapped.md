# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 10.05
- Turnos médios: 19.1
- Vitórias J1/J2: 0 / 20
- Prioridade forçada: J2

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | combined-attack | Laboratório · combined-attack | 20 | 0 | 20 | 0 | 0 | 0 | 0% | 10.05 | 3190 | 2282.5 |
| J2 | defensive | Laboratório · defensive | 20 | 20 | 0 | 0 | 20 | 20 | 100% | 10.05 | 2282.5 | 3190 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · combined-attack | combined-attack | 20 | 8 | 5 | 4 | 2 | 1 | 17 | sim |
| J2 | Laboratório · defensive | defensive | 20 | 10 | 2 | 4 | 3 | 1 | 17 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 157 | 194 | 351 | 1 | 1 |
| 1 | 3 | 33 | 36 | 5 | 3 |
| 2 | 0 | 10 | 10 | — | 5 |
| 3 | 0 | 2 | 2 | — | 6 |
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
| 0 | 0 / 67 / 0 / 35 | 0 / 163 / 61 / 0 |
| 1 | 942 / 8 / 0 / 0 | 143 / 5 / 0 / 0 |
| 2 | 904 / 0 / 0 / 0 | 917 / 27 / 0 / 0 |
| 3 | 379 / 0 / 0 / 0 | 718 / 4 / 0 / 0 |
| 4 | 187 / 0 / 0 / 0 | 237 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.15 | 0.30 | 0.00 | 0.00 |
| 1 | 4.85 | 0.35 | 0.00 | 0.00 |
| 2 | 4.00 | 3.50 | 0.00 | 0.00 |
| 3 | 2.00 | 2.90 | 0.00 | 0.00 |
| 4 | 1.00 | 1.00 | 0.00 | 0.00 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 0.3 | 5.2 |
| Souls gastas médias | 0.3 | 4.9 |
| Dano de combate causado | 3190 | 2282.5 |
| Dano de combate recebido | 2282.5 | 3190 |
| Penalizações de HP | 7967.5 | 2735 |
| Dano excedente | 250 | 0 |

## Alertas

- J1: existem cartas de nível 2 no baralho, mas nenhuma foi invocada.
- J1: existem cartas de nível 3 no baralho, mas nenhuma foi invocada.
- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
- J1: a cobertura de níveis 2–4 não foi observada nas partidas; use o cenário determinístico de invocação para separar falha de cobertura de equilíbrio.
