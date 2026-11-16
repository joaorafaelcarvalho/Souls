# SOULS Balance Lab v1.1 — simulações

- Partidas: 1000
- Regras: SOULS v0.6
- Catálogo: local-26-definitions

## Confrontos

As quatro células de cada confronto são: A em J1/prioridade 1, A em J1/prioridade 2, B em J1/prioridade 1 e B em J1/prioridade 2.

| Confronto | Partidas | Vitórias A / B | Vitórias primeiro / segundo | Concluídas |
|---|---:|---:|---:|---:|
| balanced-vs-aggressive | 100 | 13 / 87 | 57 / 43 | 100 |
| balanced-vs-defensive | 100 | 7 / 93 | 53 / 47 | 100 |
| balanced-vs-low-cost | 100 | 6 / 94 | 52 / 48 | 100 |
| balanced-vs-high-cost | 100 | 56 / 44 | 56 / 44 | 100 |
| balanced-vs-combined-attack | 100 | 24 / 76 | 60 / 40 | 100 |
| aggressive-vs-defensive | 100 | 8 / 92 | 52 / 48 | 100 |
| aggressive-vs-high-cost | 100 | 75 / 25 | 57 / 43 | 100 |
| defensive-vs-combined-attack | 100 | 94 / 6 | 50 / 50 | 100 |
| low-cost-vs-high-cost | 100 | 97 / 3 | 49 / 51 | 100 |
| high-cost-vs-combined-attack | 100 | 31 / 69 | 61 / 39 | 100 |

## Estratégias

| Estratégia | Jogos | Vitórias | Derrotas | Win rate | Vitórias quando 1.º | Vitórias quando 2.º | Souls obtidas | Souls em invocações | Souls em penalizações | N2 usado % | N3 usado % | N4 usado % |
|---|---:|---:|---:|---:|---|---|---:|---:|---:|---:|---:|---:|
| balanced | 500 | 106 | 394 | 21.2% | 67/250 | 39/250 | 4.85 | 3.6 | 0.58 | 51 | 11.8 | 1.2 |
| aggressive | 300 | 170 | 130 | 56.67% | 93/150 | 77/150 | 3.2 | 2.49 | 0.47 | 33.67 | 8 | 0 |
| defensive | 300 | 279 | 21 | 93% | 142/150 | 137/150 | 5.41 | 3.22 | 1.92 | 52 | 12.33 | 0.33 |
| low-cost | 200 | 191 | 9 | 95.5% | 96/100 | 95/100 | 6.28 | 2.03 | 1.51 | 0 | 0 | 0 |
| high-cost | 400 | 103 | 297 | 25.75% | 63/200 | 40/200 | 5.83 | 4.53 | 0.8 | 64.25 | 16.75 | 0.75 |
| combined-attack | 300 | 151 | 149 | 50.33% | 86/150 | 65/150 | 2.34 | 1.95 | 0.21 | 27 | 1 | 0.33 |

## Economia de Souls

| Estratégia | Souls obtidas médias | Souls em invocações | Souls em penalizações | 1.ª Soul | 1.ª N2 | 1.ª N3 | 1.ª N4 | N2–N4 na mão no fim | N2–N4 não compradas | Diagnóstico N2 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| balanced | 4.85 | 3.6 | 0.58 | 5.08 | 6.69 | 7.34 | 7.83 | 2438 | 158 | N2 13056 / escolha 625 |
| aggressive | 3.2 | 2.49 | 0.47 | 5.45 | 6.92 | 7.08 | — | 1885 | 71 | N2 10557 / escolha 341 |
| defensive | 5.41 | 3.22 | 1.92 | 4.02 | 6.47 | 7.41 | 7 | 2149 | 21 | N2 11821 / escolha 531 |
| low-cost | 6.28 | 2.03 | 1.51 | 4.83 | — | — | — | 0 | 0 | N2 0 / escolha 0 |
| high-cost | 5.83 | 4.53 | 0.8 | 5.01 | 6.61 | 7.28 | 7.33 | 2655 | 132 | N2 12876 / escolha 918 |
| combined-attack | 2.34 | 1.95 | 0.21 | 5.4 | 6.77 | 6.67 | 7 | 1918 | 90 | N2 10788 / escolha 217 |

## Prioridade inicial

- Vitórias J1/J2: 497/503.
- Vitórias de quem começou: 547/1000 (54.7%).
- Vitórias de quem começou em segundo: 453/1000 (45.3%).

| Estratégia | Vitórias quando começa | Taxa | Vitórias quando começa em segundo | Taxa |
|---|---|---:|---|---:|
| balanced | 67/250 | 26.8% | 39/250 | 15.6% |
| aggressive | 93/150 | 62% | 77/150 | 51.33% |
| defensive | 142/150 | 94.67% | 137/150 | 91.33% |
| low-cost | 96/100 | 96% | 95/100 | 95% |
| high-cost | 63/200 | 31.5% | 40/200 | 20% |
| combined-attack | 86/150 | 57.33% | 65/150 | 43.33% |

## Cartas oficiais

Dano por carta fica “não atribuível” porque os eventos oficiais identificam o alvo e o trace identifica a coluna, mas não publicam um ID de carta-fonte para cada ponto de dano.

| Carta | Tipo/Nível | Presenças em baralhos | Partidas com carta | Compras | Invocações | Destruições | Vitórias com invocação | Utilização | Dano |
|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| Cavaleiro | melee/N0 | 9300 | 1000 | 6573 | 8747 | 4148 | 1000 | 100% | não atribuível |
| Arqueiro | ranged/N0 | 6300 | 1000 | 4469 | 4855 | 1719 | 718 | 100% | não atribuível |
| Defensor | melee/N0 | 2000 | 500 | 1451 | 1692 | 647 | 469 | 99.8% | não atribuível |
| Carrasco Errante | melee/N1 | 3000 | 800 | 2079 | 1507 | 732 | 392 | 74.88% | não atribuível |
| Cavaleiro Negro | melee/N1 | 1900 | 600 | 1299 | 1175 | 801 | 265 | 81.5% | não atribuível |
| Guardião das Ruínas | melee/N0 | 900 | 300 | 675 | 873 | 700 | 279 | 100% | não atribuível |
| Vigia da Capela | melee/N1 | 600 | 300 | 432 | 466 | 158 | 264 | 94% | não atribuível |
| Guardião das Correntes | melee/N2 | 2400 | 1000 | 1744 | 374 | 256 | 64 | 29.3% | não atribuível |
| Acólito da Névoa | ranged/N1 | 3000 | 1000 | 2150 | 316 | 136 | 129 | 24.3% | não atribuível |
| Tecelão de Almas | ranged/N2 | 1400 | 600 | 988 | 313 | 93 | 63 | 41.33% | não atribuível |
| Sentinela do Sepulcro | melee/N2 | 600 | 300 | 451 | 177 | 43 | 145 | 51% | não atribuível |
| Caçadora da Lua Pálida | ranged/N2 | 1100 | 700 | 801 | 128 | 24 | 79 | 15.43% | não atribuível |
| Espadachim do Eclipse | melee/N2 | 1200 | 600 | 861 | 90 | 13 | 61 | 13.83% | não atribuível |
| Arqueira do Crepúsculo | ranged/N1 | 200 | 200 | 140 | 74 | 28 | 67 | 37% | não atribuível |
| Paladino da Última Vigília | melee/N3 | 1500 | 1000 | 1072 | 73 | 25 | 15 | 7.3% | não atribuível |
| Matriarca dos Selos | ranged/N3 | 400 | 400 | 268 | 57 | 12 | 5 | 14.25% | não atribuível |
| Sentinela da Catedral | melee/N3 | 300 | 300 | 210 | 33 | 4 | 31 | 11% | não atribuível |
| Duelista do Abismo | melee/N3 | 600 | 600 | 405 | 25 | 1 | 15 | 4.17% | não atribuível |
| Rei Exilado | melee/N4 | 1500 | 1000 | 1098 | 9 | 0 | 5 | 0.9% | não atribuível |
| Feiticeira da Ruptura | ranged/N3 | 1100 | 900 | 751 | 2 | 0 | 1 | 0.22% | não atribuível |
| Arcanista do Fim | ranged/N4 | 400 | 400 | 284 | 1 | 0 | 0 | 0.25% | não atribuível |
| Colosso do Crepúsculo | melee/N4 | 300 | 300 | 237 | 1 | 0 | 1 | 0.33% | não atribuível |
| Batedora do Breu | ranged/N0 | 0 | 0 | 0 | 0 | 0 | 0 | 0% | não atribuível |
| Escudeiro das Cinzas | melee/N0 | 0 | 0 | 0 | 0 | 0 | 0 | 0% | não atribuível |
| Lanceiro de Ferro | melee/N1 | 0 | 0 | 0 | 0 | 0 | 0 | 0% | não atribuível |
| Mago | ranged/N0 | 0 | 0 | 0 | 0 | 0 | 0 | 0% | não atribuível |
