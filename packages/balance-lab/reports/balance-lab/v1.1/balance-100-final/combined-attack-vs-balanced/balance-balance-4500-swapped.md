# SOULS Balance Lab v1.1

- Jogos: 100
- Concluídos: 100
- Inconclusivos: 0
- Rondas médias: 7.92
- Turnos médios: 14.07
- Vitórias J1/J2: 16 / 84
- Prioridade forçada: J2

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | balanced | Laboratório · balanced | 100 | 16 | 84 | 0 | 0 | 0 | 16% | 7.92 | 7049.5 | 9936 |
| J2 | combined-attack | Laboratório · combined-attack | 100 | 84 | 16 | 0 | 100 | 84 | 84% | 7.92 | 9936 | 7049.5 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · balanced | balanced | 20 | 9 | 5 | 3 | 2 | 1 | 17 | sim |
| J2 | Laboratório · combined-attack | combined-attack | 20 | 8 | 5 | 4 | 2 | 1 | 17 | sim |

## Cartas que não existem no baralho

| Jogador | Quantidade de definições ausentes | Definições ausentes no catálogo |
|---|---:|---|
| J1 | 17 | Arcanista do Fim; Arqueira do Crepúsculo; Batedora do Breu; Carrasco Errante; Colosso do Crepúsculo; Defensor; Duelista do Abismo; Escudeiro das Cinzas; Espadachim do Eclipse; Guardião das Ruínas; Lanceiro de Ferro; Mago; Matriarca dos Selos; Sentinela da Catedral; Sentinela do Sepulcro; Tecelão de Almas; Vigia da Capela |
| J2 | 17 | Arcanista do Fim; Arqueira do Crepúsculo; Batedora do Breu; Caçadora da Lua Pálida; Cavaleiro Negro; Colosso do Crepúsculo; Defensor; Escudeiro das Cinzas; Guardião das Correntes; Guardião das Ruínas; Lanceiro de Ferro; Mago; Matriarca dos Selos; Paladino da Última Vigília; Sentinela da Catedral; Sentinela do Sepulcro; Vigia da Capela |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 558 | 697 | 1255 | 1 | 1 |
| 1 | 258 | 228 | 486 | 2 | 3 |
| 2 | 74 | 39 | 113 | 3 | 5 |
| 3 | 10 | 2 | 12 | 5 | 7 |
| 4 | 0 | 1 | 1 | — | 7 |

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
| 0 | 0 / 1222 / 0 / 964 | 0 / 637 / 1 / 262 |
| 1 | 1858 / 606 / 0 / 65 | 2696 / 593 / 0 / 6 |
| 2 | 1841 / 107 / 0 / 0 | 3364 / 107 / 0 / 0 |
| 3 | 1498 / 11 / 0 / 0 | 1750 / 3 / 0 / 0 |
| 4 | 695 / 0 / 0 / 0 | 913 / 0 / 0 / 0 |

## Cartas que permaneceram

A coluna “não compradas” corresponde às cartas que ainda estão no baralho no fim da partida.

| Nível | Mão J1 | Mão J2 | Não compradas J1 | Não compradas J2 |
|---:|---:|---:|---:|---:|
| 0 | 2.15 | 0.45 | 1.27 | 0.58 |
| 1 | 1.80 | 2.30 | 0.62 | 0.42 |
| 2 | 1.77 | 3.37 | 0.49 | 0.24 |
| 3 | 1.68 | 1.86 | 0.22 | 0.12 |
| 4 | 0.80 | 0.90 | 0.20 | 0.09 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 5.34 | 3.84 |
| Souls gastas médias | 4.43 | 3.39 |
| Dano de combate causado | 7049.5 | 9936 |
| Dano de combate recebido | 9936 | 7049.5 |
| Penalizações de HP | 62 | 60 |
| Dano excedente | 431.5 | 59.5 |

## Alertas

- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
