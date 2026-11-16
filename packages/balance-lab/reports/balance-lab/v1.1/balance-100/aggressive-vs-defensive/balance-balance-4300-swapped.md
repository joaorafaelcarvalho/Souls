# SOULS Balance Lab v1.1

- Jogos: 100
- Concluídos: 100
- Inconclusivos: 0
- Rondas médias: 10.04
- Turnos médios: 18.18
- Vitórias J1/J2: 90 / 10
- Prioridade forçada: J2

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | defensive | Laboratório · defensive | 100 | 90 | 10 | 0 | 0 | 0 | 90% | 10.04 | 788.5 | 3430.5 |
| J2 | aggressive | Laboratório · aggressive | 100 | 10 | 90 | 0 | 100 | 10 | 10% | 10.04 | 3430.5 | 788.5 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · defensive | defensive | 20 | 10 | 2 | 4 | 3 | 1 | 17 | sim |
| J2 | Laboratório · aggressive | aggressive | 20 | 8 | 5 | 4 | 2 | 1 | 17 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 926 | 798 | 1724 | 1 | 1 |
| 1 | 134 | 9 | 143 | 2 | 3 |
| 2 | 59 | 0 | 59 | 3 | — |
| 3 | 12 | 0 | 12 | 4 | — |
| 4 | 1 | 0 | 1 | 7 | — |

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
| 0 | 0 / 922 / 266 / 0 | 0 / 356 / 0 / 156 |
| 1 | 909 / 75 / 0 / 0 | 4890 / 24 / 0 / 0 |
| 2 | 3776 / 157 / 0 / 0 | 3891 / 0 / 0 / 0 |
| 3 | 3173 / 23 / 0 / 0 | 1979 / 0 / 0 / 0 |
| 4 | 1051 / 0 / 0 / 0 | 1023 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.65 | 0.02 | 0.09 | 0.00 |
| 1 | 0.63 | 4.90 | 0.03 | 0.01 |
| 2 | 3.31 | 3.99 | 0.10 | 0.01 |
| 3 | 2.80 | 1.99 | 0.08 | 0.01 |
| 4 | 0.99 | 1.00 | 0.00 | 0.00 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 4.69 | 0.31 |
| Souls gastas médias | 4.34 | 0.31 |
| Dano de combate causado | 788.5 | 3430.5 |
| Dano de combate recebido | 3430.5 | 788.5 |
| Penalizações de HP | 2096 | 9442 |
| Dano excedente | 21.5 | 344.5 |

## Alertas

- J2: existem cartas de nível 2 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 3 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
- J2: a cobertura de níveis 2–4 não foi observada nas partidas; use o cenário determinístico de invocação para separar falha de cobertura de equilíbrio.
