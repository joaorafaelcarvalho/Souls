# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 8.3
- Turnos médios: 15.2
- Vitórias J1/J2: 8 / 12
- Prioridade forçada: J1

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | balanced | Laboratório · balanced | 20 | 8 | 12 | 0 | 20 | 8 | 40% | 8.3 | 8417.5 | 8875 |
| J2 | aggressive | Laboratório · aggressive | 20 | 12 | 8 | 0 | 0 | 0 | 60% | 8.3 | 8875 | 8417.5 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · balanced | balanced | 20 | 9 | 5 | 3 | 2 | 1 | 17 | sim |
| J2 | Laboratório · aggressive | aggressive | 20 | 8 | 5 | 4 | 2 | 1 | 17 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 142 | 129 | 271 | 1 | 1 |
| 1 | 47 | 45 | 92 | 4 | 3 |
| 2 | 22 | 15 | 37 | 4 | 4 |
| 3 | 3 | 5 | 8 | 6 | 6 |
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
| 0 | 0 / 234 / 0 / 176 | 0 / 146 / 2 / 86 |
| 1 | 566 / 169 / 0 / 14 | 384 / 124 / 1 / 0 |
| 2 | 435 / 33 / 0 / 1 | 641 / 46 / 0 / 0 |
| 3 | 354 / 5 / 0 / 0 | 384 / 5 / 0 / 0 |
| 4 | 198 / 0 / 0 / 0 | 182 / 0 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 1.65 | 1.00 | 0.25 | 0.55 |
| 1 | 2.35 | 2.30 | 0.30 | 0.45 |
| 2 | 1.75 | 3.00 | 0.15 | 0.25 |
| 3 | 1.70 | 1.65 | 0.15 | 0.10 |
| 4 | 0.90 | 0.90 | 0.10 | 0.10 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 6.55 | 5.2 |
| Souls gastas médias | 5.55 | 4.6 |
| Dano de combate causado | 8417.5 | 8875 |
| Dano de combate recebido | 8875 | 8417.5 |
| Penalizações de HP | 0 | 185 |
| Dano excedente | 400 | 170 |

## Alertas

- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
