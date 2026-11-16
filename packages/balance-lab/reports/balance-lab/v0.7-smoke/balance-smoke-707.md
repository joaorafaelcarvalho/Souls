# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 9.15
- Turnos médios: 16.7
- Vitórias J1/J2: 12 / 8
- Prioridade forçada: J1

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Souls obtidas | Souls combate | Souls retirada | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | balanced | Laboratório · balanced | 20 | 12 | 8 | 0 | 20 | 12 | 60% | 9.15 | 6.9 | 5.35 | 1.55 | 8585 | 7245 |
| J2 | high-cost | Laboratório · high-cost | 20 | 8 | 12 | 0 | 0 | 0 | 40% | 9.15 | 5.65 | 4.05 | 1.6 | 7245 | 8585 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · balanced | balanced | 20 | 9 | 5 | 3 | 2 | 1 | 17 | sim |
| J2 | Laboratório · high-cost | high-cost | 20 | 7 | 5 | 4 | 2 | 2 | 16 | sim |

## Cartas que não existem no baralho

| Jogador | Quantidade de definições ausentes | Definições ausentes no catálogo |
|---|---:|---|
| J1 | 17 | Arcanista do Fim; Arqueira do Crepúsculo; Batedora do Breu; Carrasco Errante; Colosso do Crepúsculo; Defensor; Duelista do Abismo; Escudeiro das Cinzas; Espadachim do Eclipse; Guardião das Ruínas; Lanceiro de Ferro; Mago; Matriarca dos Selos; Sentinela da Catedral; Sentinela do Sepulcro; Tecelão de Almas; Vigia da Capela |
| J2 | 16 | Arqueira do Crepúsculo; Batedora do Breu; Caçadora da Lua Pálida; Cavaleiro Negro; Colosso do Crepúsculo; Defensor; Duelista do Abismo; Escudeiro das Cinzas; Espadachim do Eclipse; Feiticeira da Ruptura; Guardião das Ruínas; Lanceiro de Ferro; Mago; Sentinela da Catedral; Sentinela do Sepulcro; Vigia da Capela |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 139 | 123 | 262 | 1 | 1 |
| 1 | 50 | 42 | 92 | 4 | 3 |
| 2 | 25 | 25 | 50 | 4 | 4 |
| 3 | 1 | 2 | 3 | 7 | 8 |
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
| 0 | 0 / 333 / 12 / 266 | 0 / 125 / 17 / 32 |
| 1 | 494 / 144 / 0 / 14 | 530 / 146 / 0 / 0 |
| 2 | 549 / 39 / 0 / 0 | 632 / 50 / 0 / 0 |
| 3 | 474 / 1 / 0 / 0 | 396 / 2 / 0 / 0 |
| 4 | 214 / 0 / 0 / 0 | 417 / 0 / 0 / 0 |

## Cartas que permaneceram

A coluna “não compradas” corresponde às cartas que ainda estão no baralho no fim da partida.

| Nível | Mão J1 | Mão J2 | Não compradas J1 | Não compradas J2 |
|---:|---:|---:|---:|---:|
| 0 | 1.90 | 0.70 | 0.15 | 0.15 |
| 1 | 2.40 | 2.60 | 0.10 | 0.30 |
| 2 | 1.65 | 2.55 | 0.10 | 0.20 |
| 3 | 1.90 | 1.85 | 0.05 | 0.05 |
| 4 | 1.00 | 1.85 | 0.00 | 0.15 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 6.9 | 5.65 |
| Souls gastas médias | 6.3 | 5.2 |
| Dano de combate causado | 8585 | 7245 |
| Dano de combate recebido | 7245 | 8585 |
| Penalizações de HP | 500 | 650 |
| Dano excedente | 290 | 230 |

## Alertas

- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
