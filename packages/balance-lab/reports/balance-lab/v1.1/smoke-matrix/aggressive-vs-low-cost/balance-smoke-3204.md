# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 9.4
- Turnos médios: 17.2
- Vitórias J1/J2: 3 / 17
- Prioridade forçada: J1

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | aggressive | Laboratório · aggressive | 20 | 3 | 17 | 0 | 20 | 3 | 15% | 9.4 | 5262.5 | 7222.5 |
| J2 | low-cost | Laboratório · low-cost | 20 | 17 | 3 | 0 | 0 | 0 | 85% | 9.4 | 7222.5 | 5262.5 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · aggressive | aggressive | 20 | 8 | 5 | 4 | 2 | 1 | 17 | sim |
| J2 | Laboratório · low-cost | low-cost | 20 | 17 | 3 | 0 | 0 | 0 | 21 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 150 | 296 | 446 | 1 | 1 |
| 1 | 33 | 40 | 73 | 4 | 3 |
| 2 | 15 | 0 | 15 | 6 | — |
| 3 | 4 | 0 | 4 | 7 | — |
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
| 0 | 0 / 127 / 0 / 62 | 0 / 708 / 32 / 105 |
| 1 | 699 / 148 / 0 / 0 | 197 / 214 / 17 / 34 |
| 2 | 709 / 47 / 0 / 0 | 0 / 0 / 0 / 0 |
| 3 | 400 / 2 / 0 / 0 | 0 / 0 / 0 / 0 |
| 4 | 237 / 0 / 0 / 0 | 0 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.50 | 1.95 | 0.00 | 0.25 |
| 1 | 3.30 | 0.85 | 0.05 | 0.15 |
| 2 | 3.20 | 0.00 | 0.05 | 0.00 |
| 3 | 1.75 | 0.00 | 0.05 | 0.00 |
| 4 | 1.00 | 0.00 | 0.00 | 0.00 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 5.3 | 6.6 |
| Souls gastas médias | 5.05 | 3.15 |
| Dano de combate causado | 5262.5 | 7222.5 |
| Dano de combate recebido | 7222.5 | 5262.5 |
| Penalizações de HP | 2205 | 25 |
| Dano excedente | 200 | 22.5 |

## Alertas

- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- J2: a bateria não contém cartas de nível 2.
- J2: a bateria não contém cartas de nível 3.
- J2: a bateria não contém cartas de nível 4.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
