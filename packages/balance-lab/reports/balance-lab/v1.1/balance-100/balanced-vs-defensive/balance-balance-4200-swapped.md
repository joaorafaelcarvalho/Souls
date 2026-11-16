# SOULS Balance Lab v1.1

- Jogos: 100
- Concluídos: 100
- Inconclusivos: 0
- Rondas médias: 10.29
- Turnos médios: 18.6
- Vitórias J1/J2: 98 / 2
- Prioridade forçada: J2

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | defensive | Laboratório · defensive | 100 | 98 | 2 | 0 | 0 | 0 | 98% | 10.29 | 909 | 3981 |
| J2 | balanced | Laboratório · balanced | 100 | 2 | 98 | 0 | 100 | 2 | 2% | 10.29 | 3981 | 909 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · defensive | defensive | 20 | 10 | 2 | 4 | 3 | 1 | 17 | sim |
| J2 | Laboratório · balanced | balanced | 20 | 9 | 5 | 3 | 2 | 1 | 17 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 945 | 890 | 1835 | 1 | 1 |
| 1 | 154 | 11 | 165 | 2 | 5 |
| 2 | 91 | 0 | 91 | 3 | — |
| 3 | 18 | 0 | 18 | 3 | — |
| 4 | 2 | 0 | 2 | 7 | — |

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
| 0 | 0 / 990 / 247 / 0 | 0 / 630 / 0 / 500 |
| 1 | 680 / 86 / 0 / 0 | 5640 / 32 / 4 / 0 |
| 2 | 3622 / 244 / 0 / 0 | 3428 / 0 / 0 / 0 |
| 3 | 3352 / 27 / 0 / 0 | 2258 / 0 / 0 / 0 |
| 4 | 1155 / 0 / 0 / 0 | 1174 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.46 | 0.08 | 0.09 | 0.02 |
| 1 | 0.45 | 4.89 | 0.01 | 0.00 |
| 2 | 3.07 | 3.00 | 0.02 | 0.00 |
| 3 | 2.77 | 2.00 | 0.05 | 0.00 |
| 4 | 0.98 | 1.00 | 0.00 | 0.00 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 5.78 | 0.41 |
| Souls gastas médias | 5.37 | 0.4 |
| Dano de combate causado | 909 | 3981 |
| Dano de combate recebido | 3981 | 909 |
| Penalizações de HP | 1553.5 | 9481 |
| Dano excedente | 9 | 405 |

## Alertas

- J2: existem cartas de nível 2 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 3 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
- J2: a cobertura de níveis 2–4 não foi observada nas partidas; use o cenário determinístico de invocação para separar falha de cobertura de equilíbrio.
