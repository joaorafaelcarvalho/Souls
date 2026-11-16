# SOULS Balance Lab v1.1

- Jogos: 100
- Concluídos: 100
- Inconclusivos: 0
- Rondas médias: 8.32
- Turnos médios: 15.23
- Vitórias J1/J2: 63 / 37
- Prioridade forçada: J2

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | combined-attack | Laboratório · combined-attack | 100 | 63 | 37 | 0 | 0 | 0 | 63% | 8.32 | 9108.5 | 8139.5 |
| J2 | high-cost | Laboratório · high-cost | 100 | 37 | 63 | 0 | 100 | 37 | 37% | 8.32 | 8139.5 | 9108.5 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · combined-attack | combined-attack | 20 | 8 | 5 | 4 | 2 | 1 | 17 | sim |
| J2 | Laboratório · high-cost | high-cost | 20 | 7 | 5 | 4 | 2 | 2 | 16 | sim |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 700 | 618 | 1318 | 1 | 1 |
| 1 | 184 | 249 | 433 | 2 | 3 |
| 2 | 34 | 82 | 116 | 4 | 4 |
| 3 | 6 | 13 | 19 | 7 | 4 |
| 4 | 1 | 1 | 2 | 8 | 8 |

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
| 0 | 0 / 612 / 2 / 287 | 0 / 548 / 0 / 199 |
| 1 | 2921 / 501 / 0 / 8 | 2226 / 599 / 0 / 0 |
| 2 | 3223 / 104 / 0 / 0 | 3187 / 219 / 0 / 0 |
| 3 | 1713 / 7 / 0 / 0 | 1902 / 14 / 0 / 0 |
| 4 | 806 / 0 / 0 / 0 | 1902 / 1 / 0 / 0 |

## Cartas que permaneceram

| Nível | Mão J1 | Mão J2 | Baralho J1 | Baralho J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.37 | 0.44 | 0.63 | 0.38 |
| 1 | 2.76 | 2.27 | 0.40 | 0.24 |
| 2 | 3.33 | 2.92 | 0.33 | 0.26 |
| 3 | 1.76 | 1.81 | 0.18 | 0.06 |
| 4 | 0.91 | 1.91 | 0.08 | 0.08 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 3.33 | 5.6 |
| Souls gastas médias | 2.97 | 5.01 |
| Dano de combate causado | 9108.5 | 8139.5 |
| Dano de combate recebido | 8139.5 | 9108.5 |
| Penalizações de HP | 219 | 214 |
| Dano excedente | 154.5 | 369 |

## Alertas

- Nenhum alerta heurístico nesta execução.
