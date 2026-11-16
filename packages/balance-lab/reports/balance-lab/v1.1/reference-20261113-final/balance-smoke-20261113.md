# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 8.35
- Turnos médios: 15.45
- Vitórias J1/J2: 6 / 14
- Prioridade forçada: J1

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | balanced | Laboratório · balanced | 20 | 6 | 14 | 0 | 20 | 6 | 30% | 8.35 | 6857.5 | 9087.5 |
| J2 | aggressive | Laboratório · aggressive | 20 | 14 | 6 | 0 | 0 | 0 | 70% | 8.35 | 9087.5 | 6857.5 |

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
| 0 | 131 | 137 | 268 | 1 | 1 |
| 1 | 43 | 50 | 93 | 3 | 2 |
| 2 | 17 | 16 | 33 | 5 | 4 |
| 3 | 10 | 1 | 11 | 6 | 7 |
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
| 0 | 0 / 238 / 0 / 185 | 0 / 151 / 0 / 81 |
| 1 | 555 / 173 / 3 / 11 | 480 / 117 / 0 / 0 |
| 2 | 519 / 54 / 0 / 0 | 628 / 31 / 0 / 0 |
| 3 | 333 / 9 / 0 / 0 | 387 / 1 / 0 / 0 |
| 4 | 211 / 0 / 0 / 0 | 162 / 0 / 0 / 0 |

## Cartas que permaneceram

A coluna “não compradas” corresponde às cartas que ainda estão no baralho no fim da partida.

| Nível | Mão J1 | Mão J2 | Não compradas J1 | Não compradas J2 |
|---:|---:|---:|---:|---:|
| 0 | 2.00 | 0.75 | 0.45 | 0.40 |
| 1 | 2.55 | 2.20 | 0.30 | 0.30 |
| 2 | 2.05 | 2.80 | 0.10 | 0.40 |
| 3 | 1.30 | 1.85 | 0.20 | 0.10 |
| 4 | 0.95 | 0.90 | 0.05 | 0.10 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 6.95 | 4.8 |
| Souls gastas médias | 6 | 4.5 |
| Dano de combate causado | 6857.5 | 9087.5 |
| Dano de combate recebido | 9087.5 | 6857.5 |
| Penalizações de HP | 150 | 250 |
| Dano excedente | 412.5 | 172.5 |

## Alertas

- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
