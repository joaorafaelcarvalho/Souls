# SOULS Balance Lab v0.7 — simulações

- Partidas: 1000
- Regras: SOULS v0.7
- Catálogo: local-26-definitions

## Confrontos

As quatro células de cada confronto são: A em J1/prioridade 1, A em J1/prioridade 2, B em J1/prioridade 1 e B em J1/prioridade 2.

| Confronto | Partidas | Vitórias A / B | Vitórias primeiro / segundo | Concluídas |
|---|---:|---:|---:|---:|
| balanced-vs-aggressive | 100 | 3 / 97 | 51 / 49 | 100 |
| balanced-vs-defensive | 100 | 67 / 33 | 49 / 51 | 100 |
| balanced-vs-low-cost | 100 | 6 / 94 | 52 / 48 | 100 |
| balanced-vs-high-cost | 100 | 42 / 58 | 56 / 44 | 100 |
| balanced-vs-combined-attack | 100 | 27 / 73 | 59 / 41 | 100 |
| aggressive-vs-defensive | 100 | 76 / 24 | 44 / 56 | 100 |
| aggressive-vs-high-cost | 100 | 83 / 17 | 53 / 47 | 100 |
| defensive-vs-combined-attack | 100 | 28 / 72 | 50 / 50 | 100 |
| low-cost-vs-high-cost | 100 | 90 / 10 | 52 / 48 | 100 |
| high-cost-vs-combined-attack | 100 | 34 / 66 | 58 / 42 | 100 |

## Estratégias

| Estratégia | Jogos | Vitórias | Derrotas | Win rate | Vitórias quando 1.º | Vitórias quando 2.º | Souls obtidas | Souls combate | Souls retirada | Souls em invocações | Souls em penalizações | N2 usado % | N3 usado % | N4 usado % |
|---|---:|---:|---:|---:|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| balanced | 500 | 145 | 355 | 29% | 81/250 | 64/250 | 6.3 | 4.68 | 1.62 | 5.1 | 0.45 | 72.8 | 12.2 | 1.6 |
| aggressive | 300 | 256 | 44 | 85.33% | 127/150 | 129/150 | 4.5 | 2.64 | 1.86 | 4.05 | 0.26 | 57 | 5 | 0 |
| defensive | 300 | 85 | 215 | 28.33% | 39/150 | 46/150 | 7.81 | 7.81 | 0 | 5 | 2.67 | 77 | 29.67 | 2.33 |
| low-cost | 200 | 184 | 16 | 92% | 94/100 | 90/100 | 6.87 | 6.87 | 0 | 2.25 | 1.8 | 0 | 0 | 0 |
| high-cost | 400 | 119 | 281 | 29.75% | 69/200 | 50/200 | 6.32 | 4.83 | 1.49 | 5.44 | 0.39 | 85.75 | 11.25 | 1 |
| combined-attack | 300 | 211 | 89 | 70.33% | 114/150 | 97/150 | 3.76 | 2.01 | 1.75 | 3.42 | 0.14 | 45.67 | 2.67 | 0 |

## Economia de Souls

| Estratégia | Souls obtidas médias | Souls combate | Souls retirada | Souls em invocações | Souls em penalizações | 1.ª Soul | 1.ª N2 | 1.ª N3 | 1.ª N4 | N2–N4 na mão no fim | N2–N4 não compradas | Diagnóstico N2 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| balanced | 6.3 | 4.68 | 1.62 | 5.1 | 0.45 | 3.83 | 5.87 | 7.15 | 7.63 | 2224 | 173 | N2 12778 / escolha 827 |
| aggressive | 4.5 | 2.64 | 1.86 | 4.05 | 0.26 | 3.9 | 5.78 | 7.47 | — | 1747 | 99 | N2 10880 / escolha 454 |
| defensive | 7.81 | 7.81 | 0 | 5 | 2.67 | 3.84 | 6.27 | 6.8 | 7.29 | 1956 | 4 | N2 12321 / escolha 973 |
| low-cost | 6.87 | 6.87 | 0 | 2.25 | 1.8 | 4.5 | — | — | — | 0 | 0 | N2 0 / escolha 0 |
| high-cost | 6.32 | 4.83 | 1.49 | 5.44 | 0.39 | 3.8 | 5.72 | 7.13 | 7 | 2421 | 186 | N2 10998 / escolha 1064 |
| combined-attack | 3.76 | 2.01 | 1.75 | 3.42 | 0.14 | 3.93 | 5.91 | 6.13 | — | 1772 | 143 | N2 10822 / escolha 383 |

## Prioridade inicial

- Vitórias J1/J2: 514/486.
- Vitórias de quem começou: 524/1000 (52.4%).
- Vitórias de quem começou em segundo: 476/1000 (47.6%).

| Estratégia | Vitórias quando começa | Taxa | Vitórias quando começa em segundo | Taxa |
|---|---|---:|---|---:|
| balanced | 81/250 | 32.4% | 64/250 | 25.6% |
| aggressive | 127/150 | 84.67% | 129/150 | 86% |
| defensive | 39/150 | 26% | 46/150 | 30.67% |
| low-cost | 94/100 | 94% | 90/100 | 90% |
| high-cost | 69/200 | 34.5% | 50/200 | 25% |
| combined-attack | 114/150 | 76% | 97/150 | 64.67% |

## Cartas oficiais

Dano por carta fica “não atribuível” porque os eventos oficiais identificam o alvo e o trace identifica a coluna, mas não publicam um ID de carta-fonte para cada ponto de dano.

| Carta | Tipo/Nível | Presenças em baralhos | Partidas com carta | Compras | Invocações | Destruições | Vitórias com invocação | Utilização | Dano |
|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| Cavaleiro | melee/N0 | 9300 | 1000 | 6492 | 8584 | 4097 | 1000 | 100% | não atribuível |
| Arqueiro | ranged/N0 | 6300 | 1000 | 4430 | 4471 | 1135 | 911 | 100% | não atribuível |
| Carrasco Errante | melee/N1 | 3000 | 800 | 2009 | 1867 | 781 | 566 | 96.63% | não atribuível |
| Defensor | melee/N0 | 2000 | 500 | 1455 | 1724 | 889 | 268 | 99.8% | não atribuível |
| Cavaleiro Negro | melee/N1 | 1900 | 600 | 1298 | 1511 | 860 | 316 | 98.83% | não atribuível |
| Guardião das Ruínas | melee/N0 | 900 | 300 | 676 | 894 | 760 | 85 | 100% | não atribuível |
| Guardião das Correntes | melee/N2 | 2400 | 1000 | 1726 | 622 | 402 | 87 | 44.3% | não atribuível |
| Vigia da Capela | melee/N1 | 600 | 300 | 431 | 511 | 280 | 80 | 96.33% | não atribuível |
| Acólito da Névoa | ranged/N1 | 3000 | 1000 | 2106 | 508 | 147 | 236 | 39.4% | não atribuível |
| Tecelão de Almas | ranged/N2 | 1400 | 600 | 946 | 487 | 126 | 112 | 57.67% | não atribuível |
| Espadachim do Eclipse | melee/N2 | 1200 | 600 | 832 | 349 | 57 | 226 | 47.17% | não atribuível |
| Sentinela do Sepulcro | melee/N2 | 600 | 300 | 456 | 312 | 65 | 60 | 75.67% | não atribuível |
| Arqueira do Crepúsculo | ranged/N1 | 200 | 200 | 144 | 104 | 57 | 93 | 52% | não atribuível |
| Paladino da Última Vigília | melee/N3 | 1500 | 1000 | 1074 | 88 | 25 | 17 | 8.8% | não atribuível |
| Sentinela da Catedral | melee/N3 | 300 | 300 | 212 | 70 | 4 | 12 | 23.33% | não atribuível |
| Caçadora da Lua Pálida | ranged/N2 | 1100 | 700 | 783 | 61 | 7 | 37 | 8.29% | não atribuível |
| Matriarca dos Selos | ranged/N3 | 400 | 400 | 261 | 40 | 2 | 17 | 10% | não atribuível |
| Duelista do Abismo | melee/N3 | 600 | 600 | 403 | 22 | 2 | 16 | 3.67% | não atribuível |
| Rei Exilado | melee/N4 | 1500 | 1000 | 1084 | 11 | 0 | 4 | 1.1% | não atribuível |
| Colosso do Crepúsculo | melee/N4 | 300 | 300 | 238 | 7 | 0 | 1 | 2.33% | não atribuível |
| Feiticeira da Ruptura | ranged/N3 | 1100 | 900 | 743 | 5 | 0 | 2 | 0.56% | não atribuível |
| Arcanista do Fim | ranged/N4 | 400 | 400 | 279 | 1 | 0 | 0 | 0.25% | não atribuível |
| Batedora do Breu | ranged/N0 | 0 | 0 | 0 | 0 | 0 | 0 | 0% | não atribuível |
| Escudeiro das Cinzas | melee/N0 | 0 | 0 | 0 | 0 | 0 | 0 | 0% | não atribuível |
| Lanceiro de Ferro | melee/N1 | 0 | 0 | 0 | 0 | 0 | 0 | 0% | não atribuível |
| Mago | ranged/N0 | 0 | 0 | 0 | 0 | 0 | 0 | 0% | não atribuível |
