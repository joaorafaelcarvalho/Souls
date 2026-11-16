# SOULS Balance Lab v1.1

- Jogos: 100
- Concluídos: 100
- Inconclusivos: 0
- Rondas médias: 8.28
- Turnos médios: 15.14
- Vitórias J1/J2: 62 / 38
- Prioridade forçada: J2

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | aggressive | Laboratório · aggressive | 100 | 62 | 38 | 0 | 0 | 0 | 62% | 8.28 | 8912 | 7979.5 |
| J2 | balanced | Laboratório · balanced | 100 | 38 | 62 | 0 | 100 | 38 | 38% | 8.28 | 7979.5 | 8912 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · aggressive | aggressive | 20 | 8 | 5 | 4 | 2 | 1 | 17 | sim |
| J2 | Laboratório · balanced | balanced | 20 | 9 | 5 | 3 | 2 | 1 | 17 | sim |

## Cartas que não existem no baralho

| Jogador | Quantidade de definições ausentes | Definições ausentes no catálogo |
|---|---:|---|
| J1 | 17 | Arcanista do Fim; Arqueira do Crepúsculo; Batedora do Breu; Cavaleiro Negro; Colosso do Crepúsculo; Defensor; Escudeiro das Cinzas; Guardião das Correntes; Guardião das Ruínas; Lanceiro de Ferro; Mago; Matriarca dos Selos; Paladino da Última Vigília; Sentinela da Catedral; Sentinela do Sepulcro; Tecelão de Almas; Vigia da Capela |
| J2 | 17 | Arcanista do Fim; Arqueira do Crepúsculo; Batedora do Breu; Carrasco Errante; Colosso do Crepúsculo; Defensor; Duelista do Abismo; Escudeiro das Cinzas; Espadachim do Eclipse; Guardião das Ruínas; Lanceiro de Ferro; Mago; Matriarca dos Selos; Sentinela da Catedral; Sentinela do Sepulcro; Tecelão de Almas; Vigia da Capela |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 647 | 664 | 1311 | 1 | 1 |
| 1 | 213 | 227 | 440 | 2 | 3 |
| 2 | 85 | 78 | 163 | 4 | 4 |
| 3 | 7 | 23 | 30 | 6 | 6 |
| 4 | 0 | 4 | 4 | — | 8 |

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
| 0 | 0 / 699 / 4 / 397 | 0 / 1205 / 2 / 961 |
| 1 | 2497 / 619 / 0 / 0 | 2555 / 733 / 2 / 41 |
| 2 | 2883 / 176 / 0 / 0 | 2656 / 187 / 0 / 0 |
| 3 | 1772 / 5 / 0 / 0 | 1782 / 31 / 0 / 0 |
| 4 | 948 / 0 / 0 / 0 | 1054 / 0 / 0 / 0 |

## Cartas que permaneceram

A coluna “não compradas” corresponde às cartas que ainda estão no baralho no fim da partida.

| Nível | Mão J1 | Mão J2 | Não compradas J1 | Não compradas J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.77 | 1.82 | 0.76 | 0.54 |
| 1 | 2.51 | 2.42 | 0.36 | 0.31 |
| 2 | 2.81 | 2.05 | 0.34 | 0.17 |
| 3 | 1.75 | 1.69 | 0.18 | 0.08 |
| 4 | 0.95 | 0.88 | 0.05 | 0.08 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 4.81 | 6.15 |
| Souls gastas médias | 4.34 | 5.29 |
| Dano de combate causado | 8912 | 7979.5 |
| Dano de combate recebido | 7979.5 | 8912 |
| Penalizações de HP | 100 | 130 |
| Dano excedente | 169.5 | 303.5 |

## Alertas

- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
