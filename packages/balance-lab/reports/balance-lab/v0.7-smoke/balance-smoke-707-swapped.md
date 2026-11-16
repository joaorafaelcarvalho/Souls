# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 8.65
- Turnos médios: 15.9
- Vitórias J1/J2: 14 / 6
- Prioridade forçada: J2

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Souls obtidas | Souls combate | Souls retirada | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | high-cost | Laboratório · high-cost | 20 | 14 | 6 | 0 | 0 | 0 | 70% | 8.65 | 6.05 | 4.6 | 1.45 | 9390 | 7515 |
| J2 | balanced | Laboratório · balanced | 20 | 6 | 14 | 0 | 20 | 6 | 30% | 8.65 | 6.75 | 5.4 | 1.35 | 7515 | 9390 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · high-cost | high-cost | 20 | 7 | 5 | 4 | 2 | 2 | 16 | sim |
| J2 | Laboratório · balanced | balanced | 20 | 9 | 5 | 3 | 2 | 1 | 17 | sim |

## Cartas que não existem no baralho

| Jogador | Quantidade de definições ausentes | Definições ausentes no catálogo |
|---|---:|---|
| J1 | 16 | Arqueira do Crepúsculo; Batedora do Breu; Caçadora da Lua Pálida; Cavaleiro Negro; Colosso do Crepúsculo; Defensor; Duelista do Abismo; Escudeiro das Cinzas; Espadachim do Eclipse; Feiticeira da Ruptura; Guardião das Ruínas; Lanceiro de Ferro; Mago; Sentinela da Catedral; Sentinela do Sepulcro; Vigia da Capela |
| J2 | 17 | Arcanista do Fim; Arqueira do Crepúsculo; Batedora do Breu; Carrasco Errante; Colosso do Crepúsculo; Defensor; Duelista do Abismo; Escudeiro das Cinzas; Espadachim do Eclipse; Guardião das Ruínas; Lanceiro de Ferro; Mago; Matriarca dos Selos; Sentinela da Catedral; Sentinela do Sepulcro; Tecelão de Almas; Vigia da Capela |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 121 | 128 | 249 | 1 | 1 |
| 1 | 44 | 49 | 93 | 2 | 4 |
| 2 | 30 | 23 | 53 | 4 | 4 |
| 3 | 2 | 4 | 6 | 7 | 6 |
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
| 0 | 0 / 147 / 18 / 61 | 0 / 263 / 11 / 204 |
| 1 | 456 / 136 / 0 / 0 | 522 / 173 / 0 / 28 |
| 2 | 516 / 52 / 0 / 0 | 525 / 49 / 0 / 0 |
| 3 | 433 / 1 / 0 / 0 | 376 / 5 / 0 / 0 |
| 4 | 342 / 0 / 0 / 0 | 240 / 0 / 0 / 0 |

## Cartas que permaneceram

A coluna “não compradas” corresponde às cartas que ainda estão no baralho no fim da partida.

| Nível | Mão J1 | Mão J2 | Não compradas J1 | Não compradas J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.70 | 2.10 | 0.25 | 0.50 |
| 1 | 2.45 | 2.45 | 0.35 | 0.10 |
| 2 | 2.30 | 1.85 | 0.20 | 0.00 |
| 3 | 1.85 | 1.80 | 0.05 | 0.00 |
| 4 | 1.90 | 0.95 | 0.10 | 0.05 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 6.05 | 6.75 |
| Souls gastas médias | 5.75 | 6 |
| Dano de combate causado | 9390 | 7515 |
| Dano de combate recebido | 7515 | 9390 |
| Penalizações de HP | 200 | 300 |
| Dano excedente | 90 | 380 |

## Alertas

- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
