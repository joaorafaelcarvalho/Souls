# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 9.1
- Turnos médios: 16.35
- Vitórias J1/J2: 6 / 14
- Prioridade forçada: J2

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | high-cost | Laboratório · high-cost | 20 | 6 | 14 | 0 | 0 | 0 | 30% | 9.1 | 6515 | 9445 |
| J2 | aggressive | Laboratório · aggressive | 20 | 14 | 6 | 0 | 20 | 14 | 70% | 9.1 | 9445 | 6515 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · high-cost | high-cost | 20 | 7 | 5 | 4 | 2 | 2 | 16 | sim |
| J2 | Laboratório · aggressive | aggressive | 20 | 8 | 5 | 4 | 2 | 1 | 17 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 121 | 147 | 268 | 1 | 1 |
| 1 | 41 | 30 | 71 | 3 | 3 |
| 2 | 13 | 12 | 25 | 5 | 4 |
| 3 | 3 | 3 | 6 | 7 | 8 |
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
| 0 | 0 / 91 / 0 / 31 | 0 / 106 / 0 / 54 |
| 1 | 586 / 133 / 0 / 1 | 753 / 128 / 0 / 0 |
| 2 | 695 / 41 / 0 / 0 | 683 / 37 / 0 / 0 |
| 3 | 304 / 4 / 0 / 0 | 401 / 3 / 0 / 0 |
| 4 | 347 / 0 / 0 / 0 | 224 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.40 | 0.45 | 0.55 | 0.20 |
| 1 | 2.70 | 3.30 | 0.25 | 0.20 |
| 2 | 3.00 | 3.30 | 0.35 | 0.10 |
| 3 | 1.75 | 1.85 | 0.10 | 0.00 |
| 4 | 1.85 | 1.00 | 0.10 | 0.00 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 5.2 | 4.1 |
| Souls gastas médias | 4.55 | 3.95 |
| Dano de combate causado | 6515 | 9445 |
| Dano de combate recebido | 9445 | 6515 |
| Penalizações de HP | 250 | 810 |
| Dano excedente | 320 | 120 |

## Alertas

- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
