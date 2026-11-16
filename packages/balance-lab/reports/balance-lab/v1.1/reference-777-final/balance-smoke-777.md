# SOULS Balance Lab v1.1

- Jogos: 20
- Concluídos: 20
- Inconclusivos: 0
- Rondas médias: 8.35
- Turnos médios: 15.25
- Vitórias J1/J2: 7 / 13
- Prioridade forçada: J1

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | balanced | Laboratório · balanced | 20 | 7 | 13 | 0 | 20 | 7 | 35% | 8.35 | 8135 | 8512.5 |
| J2 | aggressive | Laboratório · aggressive | 20 | 13 | 7 | 0 | 0 | 0 | 65% | 8.35 | 8512.5 | 8135 |

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
| 0 | 137 | 128 | 265 | 1 | 1 |
| 1 | 45 | 48 | 93 | 4 | 3 |
| 2 | 14 | 15 | 29 | 5 | 5 |
| 3 | 5 | 2 | 7 | 5 | 8 |
| 4 | 1 | 0 | 1 | 8 | — |

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
| 0 | 0 / 223 / 0 / 173 | 0 / 160 / 1 / 90 |
| 1 | 512 / 148 / 4 / 4 | 503 / 135 / 0 / 0 |
| 2 | 556 / 35 / 0 / 0 | 640 / 40 / 0 / 0 |
| 3 | 385 / 7 / 0 / 0 | 296 / 0 / 0 / 0 |
| 4 | 215 / 0 / 0 / 0 | 183 / 0 / 0 / 0 |

## Cartas que permaneceram

A coluna “não compradas” corresponde às cartas que ainda estão no baralho no fim da partida.

| Nível | Mão J1 | Mão J2 | Não compradas J1 | Não compradas J2 |
|---:|---:|---:|---:|---:|
| 0 | 1.60 | 1.00 | 0.55 | 0.60 |
| 1 | 2.40 | 2.40 | 0.35 | 0.20 |
| 2 | 2.20 | 2.85 | 0.10 | 0.40 |
| 3 | 1.70 | 1.60 | 0.05 | 0.30 |
| 4 | 0.95 | 1.00 | 0.00 | 0.00 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 6.15 | 5.1 |
| Souls gastas médias | 5.1 | 4.4 |
| Dano de combate causado | 8135 | 8512.5 |
| Dano de combate recebido | 8512.5 | 8135 |
| Penalizações de HP | 250 | 100 |
| Dano excedente | 337.5 | 75 |

## Alertas

- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
