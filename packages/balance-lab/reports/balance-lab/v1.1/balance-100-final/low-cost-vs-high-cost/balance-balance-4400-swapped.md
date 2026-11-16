# SOULS Balance Lab v1.1

- Jogos: 100
- Concluídos: 100
- Inconclusivos: 0
- Rondas médias: 8.69
- Turnos médios: 15.57
- Vitórias J1/J2: 2 / 98
- Prioridade forçada: J2

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | high-cost | Laboratório · high-cost | 100 | 2 | 98 | 0 | 0 | 0 | 2% | 8.69 | 2806.5 | 9039 |
| J2 | low-cost | Laboratório · low-cost | 100 | 98 | 2 | 0 | 100 | 98 | 98% | 8.69 | 9039 | 2806.5 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · high-cost | high-cost | 20 | 7 | 5 | 4 | 2 | 2 | 16 | sim |
| J2 | Laboratório · low-cost | low-cost | 20 | 17 | 3 | 0 | 0 | 0 | 21 | sim |

## Cartas que não existem no baralho

| Jogador | Quantidade de definições ausentes | Definições ausentes no catálogo |
|---|---:|---|
| J1 | 16 | Arqueira do Crepúsculo; Batedora do Breu; Caçadora da Lua Pálida; Cavaleiro Negro; Colosso do Crepúsculo; Defensor; Duelista do Abismo; Escudeiro das Cinzas; Espadachim do Eclipse; Feiticeira da Ruptura; Guardião das Ruínas; Lanceiro de Ferro; Mago; Sentinela da Catedral; Sentinela do Sepulcro; Vigia da Capela |
| J2 | 21 | Acólito da Névoa; Arcanista do Fim; Batedora do Breu; Caçadora da Lua Pálida; Carrasco Errante; Colosso do Crepúsculo; Duelista do Abismo; Escudeiro das Cinzas; Espadachim do Eclipse; Feiticeira da Ruptura; Guardião das Correntes; Guardião das Ruínas; Lanceiro de Ferro; Mago; Matriarca dos Selos; Paladino da Última Vigília; Rei Exilado; Sentinela da Catedral; Sentinela do Sepulcro; Tecelão de Almas; Vigia da Capela |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 567 | 1399 | 1966 | 1 | 1 |
| 1 | 217 | 151 | 368 | 2 | 3 |
| 2 | 80 | 0 | 80 | 4 | — |
| 3 | 18 | 0 | 18 | 5 | — |
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
| 0 | 0 / 497 / 2 / 186 | 0 / 3380 / 432 / 393 |
| 1 | 2187 / 610 / 0 / 2 | 1465 / 767 / 207 / 113 |
| 2 | 2749 / 211 / 0 / 0 | 0 / 0 / 0 / 0 |
| 3 | 1621 / 11 / 0 / 0 | 0 / 0 / 0 / 0 |
| 4 | 1722 / 0 / 0 / 0 | 0 / 0 / 0 / 0 |

## Cartas que permaneceram

A coluna “não compradas” corresponde às cartas que ainda estão no baralho no fim da partida.

| Nível | Mão J1 | Mão J2 | Não compradas J1 | Não compradas J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.52 | 2.27 | 0.81 | 0.74 |
| 1 | 2.40 | 1.34 | 0.43 | 0.15 |
| 2 | 2.81 | 0.00 | 0.39 | 0.00 |
| 3 | 1.57 | 0.00 | 0.25 | 0.00 |
| 4 | 1.89 | 0.00 | 0.11 | 0.00 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 5.49 | 5.25 |
| Souls gastas médias | 4.85 | 2.78 |
| Dano de combate causado | 2806.5 | 9039 |
| Dano de combate recebido | 9039 | 2806.5 |
| Penalizações de HP | 1339 | 140.5 |
| Dano excedente | 399 | 13.5 |

## Alertas

- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- J2: a bateria não contém cartas de nível 2.
- J2: a bateria não contém cartas de nível 3.
- J2: a bateria não contém cartas de nível 4.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
