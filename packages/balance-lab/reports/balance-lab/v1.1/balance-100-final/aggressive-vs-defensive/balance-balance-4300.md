# SOULS Balance Lab v1.1

- Jogos: 100
- Concluídos: 100
- Inconclusivos: 0
- Rondas médias: 9.88
- Turnos médios: 17.84
- Vitórias J1/J2: 7 / 93
- Prioridade forçada: J1

## Estratégia, baralho e posição

| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Dano causado | Dano recebido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| J1 | aggressive | Laboratório · aggressive | 100 | 7 | 93 | 0 | 100 | 7 | 7% | 9.88 | 3250 | 838.5 |
| J2 | defensive | Laboratório · defensive | 100 | 93 | 7 | 0 | 0 | 0 | 93% | 9.88 | 838.5 | 3250 |

## Distribuição dos baralhos

| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| J1 | Laboratório · aggressive | aggressive | 20 | 8 | 5 | 4 | 2 | 1 | 17 | sim |
| J2 | Laboratório · defensive | defensive | 20 | 10 | 2 | 4 | 3 | 1 | 17 | sim |

## Cartas que não existem no baralho

| Jogador | Quantidade de definições ausentes | Definições ausentes no catálogo |
|---|---:|---|
| J1 | 17 | Arcanista do Fim; Arqueira do Crepúsculo; Batedora do Breu; Cavaleiro Negro; Colosso do Crepúsculo; Defensor; Escudeiro das Cinzas; Guardião das Correntes; Guardião das Ruínas; Lanceiro de Ferro; Mago; Matriarca dos Selos; Paladino da Última Vigília; Sentinela da Catedral; Sentinela do Sepulcro; Tecelão de Almas; Vigia da Capela |
| J2 | 17 | Acólito da Névoa; Arcanista do Fim; Arqueira do Crepúsculo; Arqueiro; Batedora do Breu; Caçadora da Lua Pálida; Carrasco Errante; Cavaleiro Negro; Duelista do Abismo; Escudeiro das Cinzas; Espadachim do Eclipse; Feiticeira da Ruptura; Lanceiro de Ferro; Mago; Matriarca dos Selos; Rei Exilado; Tecelão de Almas |

## Invocações por nível

| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |
|---:|---:|---:|---:|---:|---:|
| 0 | 789 | 926 | 1715 | 1 | 1 |
| 1 | 9 | 136 | 145 | 4 | 2 |
| 2 | 0 | 63 | 63 | — | 3 |
| 3 | 0 | 7 | 7 | — | 5 |
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
| 0 | 0 / 317 / 0 / 125 | 0 / 912 / 212 / 0 |
| 1 | 4803 / 25 / 0 / 0 | 855 / 79 / 1 / 0 |
| 2 | 3953 / 0 / 0 / 0 | 3568 / 147 / 0 / 0 |
| 3 | 1978 / 0 / 0 / 0 | 3081 / 9 / 0 / 0 |
| 4 | 959 / 0 / 0 / 0 | 1082 / 0 / 0 / 0 |

## Cartas que permaneceram

A coluna “não compradas” corresponde às cartas que ainda estão no baralho no fim da partida.

| Nível | Mão J1 | Mão J2 | Não compradas J1 | Não compradas J2 |
|---:|---:|---:|---:|---:|
| 0 | 0.08 | 0.60 | 0.03 | 0.14 |
| 1 | 4.91 | 0.58 | 0.00 | 0.06 |
| 2 | 3.99 | 3.24 | 0.01 | 0.13 |
| 3 | 1.98 | 2.86 | 0.02 | 0.07 |
| 4 | 1.00 | 0.99 | 0.00 | 0.01 |

## Souls e dano

| Métrica | J1 | J2 |
|---|---:|---:|
| Souls ganhas médias | 0.24 | 4.69 |
| Souls gastas médias | 0.24 | 4.24 |
| Dano de combate causado | 3250 | 838.5 |
| Dano de combate recebido | 838.5 | 3250 |
| Penalizações de HP | 9404 | 1972.5 |
| Dano excedente | 378.5 | 32 |

## Alertas

- J1: existem cartas de nível 2 no baralho, mas nenhuma foi invocada.
- J1: existem cartas de nível 3 no baralho, mas nenhuma foi invocada.
- J1: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- J2: existem cartas de nível 4 no baralho, mas nenhuma foi invocada.
- Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.
- J1: a cobertura de níveis 2–4 não foi observada nas partidas; use o cenário determinístico de invocação para separar falha de cobertura de equilíbrio.
