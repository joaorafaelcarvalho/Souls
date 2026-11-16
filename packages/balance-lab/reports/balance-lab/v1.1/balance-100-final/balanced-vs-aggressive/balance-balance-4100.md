# SOULS Balance Lab v1.1

- Jogos: 100
- Concluídos: 100
- Inconclusivos: 0
- Rondas médias: 8.26
- Turnos médios: 15.19
- Vitórias J1/J2: 31 / 69
- Prioridade forçada: J1

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | balanced | Laboratório · balanced | 100 | 31 | 69 | 0 | 100 | 31 | 31% | 8.26 | 7509 | 9419 |
| J2 | aggressive | Laboratório · aggressive | 100 | 69 | 31 | 0 | 0 | 0 | 69% | 8.26 | 9419 | 7509 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · balanced | balanced | 20 | 9 | 5 | 3 | 2 | 1 | 17 | sim |
| J2 | Laboratório · aggressive | aggressive | 20 | 8 | 5 | 4 | 2 | 1 | 17 | sim |

## Cartas que não existem no baralho

| Jogador | Quantidade de definições ausentes | Definições ausentes no catálogo |
|---|---:|---|
| J1 | 17 | Arcanista do Fim; Arqueira do Crepúsculo; Batedora do Breu; Carrasco Errante; Colosso do Crepúsculo; Defensor; Duelista do Abismo; Escudeiro das Cinzas; Espadachim do Eclipse; Guardião das Ruínas; Lanceiro de Ferro; Mago; Matriarca dos Selos; Sentinela da Catedral; Sentinela do Sepulcro; Tecelão de Almas; Vigia da Capela |
| J2 | 17 | Arcanista do Fim; Arqueira do Crepúsculo; Batedora do Breu; Cavaleiro Negro; Colosso do Crepúsculo; Defensor; Escudeiro das Cinzas; Guardião das Correntes; Guardião das Ruínas; Lanceiro de Ferro; Mago; Matriarca dos Selos; Paladino da Última Vigília; Sentinela da Catedral; Sentinela do Sepulcro; Tecelão de Almas; Vigia da Capela |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 657 | 664 | 1321 | 1 | 1 |
| 1 | 214 | 264 | 478 | 3 | 2 |
| 2 | 88 | 64 | 152 | 5 | 4 |
| 3 | 19 | 8 | 27 | 6 | 5 |
| 4 | 5 | 0 | 5 | 7 | — |

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
| 0 | 0 / 1199 / 0 / 953 | 0 / 729 / 1 / 387 |
| 1 | 2738 / 787 / 2 / 38 | 2051 / 560 / 1 / 1 |
| 2 | 2309 / 179 / 0 / 0 | 3301 / 165 / 0 / 0 |
| 3 | 1891 / 25 / 0 / 0 | 1707 / 4 / 0 / 0 |
| 4 | 1028 / 0 / 0 / 0 | 977 / 0 / 0 / 0 |

## Cartas que permaneceram

A coluna “não compradas” corresponde às cartas que ainda estão no baralho no fim da partida.

| Nível | Mão J1 | Mão J2 | Não compradas J1 | Não compradas J2 |
|---:|---:|---:|---:|---:|
| 0 | 1.87 | 0.75 | 0.56 | 0.61 |
| 1 | 2.55 | 1.89 | 0.31 | 0.47 |
| 2 | 1.97 | 3.08 | 0.15 | 0.28 |
| 3 | 1.72 | 1.80 | 0.09 | 0.12 |
| 4 | 0.92 | 0.90 | 0.03 | 0.10 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 6.2 | 4.78 |
| Souls gastas médias | 5.21 | 4.4 |
| Dano de combate causado | 7509 | 9419 |
| Dano de combate recebido | 9419 | 7509 |
| Penalizações de HP | 120 | 190 |
| Dano excedente | 390 | 121 |

## Alertas

- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
