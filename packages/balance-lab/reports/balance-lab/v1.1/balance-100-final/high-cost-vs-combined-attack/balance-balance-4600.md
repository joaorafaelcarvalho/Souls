# SOULS Balance Lab v1.1

- Jogos: 100
- Concluídos: 100
- Inconclusivos: 0
- Rondas médias: 8.23
- Turnos médios: 14.95
- Vitórias J1/J2: 48 / 52
- Prioridade forçada: J1

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | high-cost | Laboratório · high-cost | 100 | 48 | 52 | 0 | 100 | 48 | 48% | 8.23 | 8716 | 8752 |
| J2 | combined-attack | Laboratório · combined-attack | 100 | 52 | 48 | 0 | 0 | 0 | 52% | 8.23 | 8752 | 8716 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · high-cost | high-cost | 20 | 7 | 5 | 4 | 2 | 2 | 16 | sim |
| J2 | Laboratório · combined-attack | combined-attack | 20 | 8 | 5 | 4 | 2 | 1 | 17 | sim |

## Cartas que não existem no baralho

| Jogador | Quantidade de definições ausentes | Definições ausentes no catálogo |
|---|---:|---|
| J1 | 16 | Arqueira do Crepúsculo; Batedora do Breu; Caçadora da Lua Pálida; Cavaleiro Negro; Colosso do Crepúsculo; Defensor; Duelista do Abismo; Escudeiro das Cinzas; Espadachim do Eclipse; Feiticeira da Ruptura; Guardião das Ruínas; Lanceiro de Ferro; Mago; Sentinela da Catedral; Sentinela do Sepulcro; Vigia da Capela |
| J2 | 17 | Arcanista do Fim; Arqueira do Crepúsculo; Batedora do Breu; Caçadora da Lua Pálida; Cavaleiro Negro; Colosso do Crepúsculo; Defensor; Escudeiro das Cinzas; Guardião das Correntes; Guardião das Ruínas; Lanceiro de Ferro; Mago; Matriarca dos Selos; Paladino da Última Vigília; Sentinela da Catedral; Sentinela do Sepulcro; Vigia da Capela |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 629 | 689 | 1318 | 1 | 1 |
| 1 | 261 | 172 | 433 | 3 | 2 |
| 2 | 66 | 34 | 100 | 4 | 4 |
| 3 | 12 | 7 | 19 | 6 | 6 |
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
| 0 | 0 / 577 / 1 / 235 | 0 / 611 / 1 / 319 |
| 1 | 2425 / 624 / 0 / 0 | 2647 / 489 / 1 / 6 |
| 2 | 3276 / 170 / 0 / 0 | 3281 / 112 / 0 / 0 |
| 3 | 1870 / 8 / 0 / 0 | 1761 / 6 / 0 / 0 |
| 4 | 1734 / 0 / 0 / 0 | 844 / 0 / 0 / 0 |

## Cartas que permaneceram

A coluna “não compradas” corresponde às cartas que ainda estão no baralho no fim da partida.

| Nível | Mão J1 | Mão J2 | Não compradas J1 | Não compradas J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.40 | 0.41 | 0.31 | 0.70 |
| 1 | 2.12 | 2.83 | 0.27 | 0.45 |
| 2 | 3.23 | 3.29 | 0.11 | 0.37 |
| 3 | 1.75 | 1.74 | 0.13 | 0.19 |
| 4 | 1.85 | 0.94 | 0.15 | 0.06 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 5.14 | 3.15 |
| Souls gastas médias | 4.62 | 2.73 |
| Dano de combate causado | 8716 | 8752 |
| Dano de combate recebido | 8752 | 8716 |
| Penalizações de HP | 102 | 95 |
| Dano excedente | 329.5 | 226.5 |

## Alertas

- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
