# SOULS Balance Lab v1.1

- Jogos: 100
- Concluídos: 100
- Inconclusivos: 0
- Rondas médias: 7.8
- Turnos médios: 13.81
- Vitórias J1/J2: 84 / 16
- Prioridade forçada: J1

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | combined-attack | Laboratório · combined-attack | 100 | 84 | 16 | 0 | 100 | 84 | 84% | 7.8 | 10014.5 | 7131.5 |
| J2 | balanced | Laboratório · balanced | 100 | 16 | 84 | 0 | 0 | 0 | 16% | 7.8 | 7131.5 | 10014.5 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · combined-attack | combined-attack | 20 | 8 | 5 | 4 | 2 | 1 | 17 | sim |
| J2 | Laboratório · balanced | balanced | 20 | 9 | 5 | 3 | 2 | 1 | 17 | sim |

## Cartas que não existem no baralho

| Jogador | Quantidade de definições ausentes | Definições ausentes no catálogo |
|---|---:|---|
| J1 | 17 | Arcanista do Fim; Arqueira do Crepúsculo; Batedora do Breu; Caçadora da Lua Pálida; Cavaleiro Negro; Colosso do Crepúsculo; Defensor; Escudeiro das Cinzas; Guardião das Correntes; Guardião das Ruínas; Lanceiro de Ferro; Mago; Matriarca dos Selos; Paladino da Última Vigília; Sentinela da Catedral; Sentinela do Sepulcro; Vigia da Capela |
| J2 | 17 | Arcanista do Fim; Arqueira do Crepúsculo; Batedora do Breu; Carrasco Errante; Colosso do Crepúsculo; Defensor; Duelista do Abismo; Escudeiro das Cinzas; Espadachim do Eclipse; Guardião das Ruínas; Lanceiro de Ferro; Mago; Matriarca dos Selos; Sentinela da Catedral; Sentinela do Sepulcro; Tecelão de Almas; Vigia da Capela |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 691 | 549 | 1240 | 1 | 1 |
| 1 | 206 | 254 | 460 | 3 | 2 |
| 2 | 37 | 62 | 99 | 4 | 3 |
| 3 | 5 | 8 | 13 | 7 | 6 |
| 4 | 0 | 2 | 2 | — | 6 |

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
| 0 | 0 / 597 / 1 / 251 | 0 / 1128 / 0 / 917 |
| 1 | 2970 / 592 / 0 / 0 | 1663 / 568 / 0 / 64 |
| 2 | 3188 / 100 / 0 / 0 | 1976 / 100 / 0 / 0 |
| 3 | 1702 / 5 / 0 / 0 | 1473 / 9 / 0 / 0 |
| 4 | 797 / 0 / 0 / 0 | 782 / 0 / 0 / 0 |

## Cartas que permaneceram

A coluna “não compradas” corresponde às cartas que ainda estão no baralho no fim da partida.

| Nível | Mão J1 | Mão J2 | Não compradas J1 | Não compradas J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.45 | 2.10 | 0.64 | 1.41 |
| 1 | 2.64 | 1.73 | 0.30 | 0.73 |
| 2 | 3.26 | 1.97 | 0.37 | 0.41 |
| 3 | 1.77 | 1.57 | 0.18 | 0.35 |
| 4 | 0.92 | 0.88 | 0.08 | 0.10 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 3.36 | 5.19 |
| Souls gastas médias | 3.09 | 4.15 |
| Dano de combate causado | 10014.5 | 7131.5 |
| Dano de combate recebido | 7131.5 | 10014.5 |
| Penalizações de HP | 30 | 0 |
| Dano excedente | 63.5 | 442.5 |

## Alertas

- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
