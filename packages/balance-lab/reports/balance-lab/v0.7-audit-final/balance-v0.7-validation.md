# SOULS Balance Lab v0.7 — validation

## Testes executados

| Comando | Resultado | Testes |
|---|---|---:|
| npm --workspace @souls/game-core test | PASSOU | 35 |
| npm --workspace @souls/balance-lab test | PASSOU | 13 |
| npm run lint | PASSOU | 0 |
| npm run typecheck | PASSOU | 0 |
| npm run build | PASSOU | 0 |

## Baralhos

| Jogador de validação | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Válido | Inicia com 0 Souls |
|---:|---|---:|---:|---:|---:|---:|---:|---|---|
| 1 | balanced | 20 | 9 | 5 | 3 | 2 | 1 | sim | sim |
| 2 | aggressive | 20 | 8 | 5 | 4 | 2 | 1 | sim | sim |
| 2 | defensive | 20 | 10 | 2 | 4 | 3 | 1 | sim | sim |
| 2 | low-cost | 20 | 17 | 3 | 0 | 0 | 0 | sim | sim |
| 2 | high-cost | 20 | 7 | 5 | 4 | 2 | 2 | sim | sim |
| 2 | combined-attack | 20 | 8 | 5 | 4 | 2 | 1 | sim | sim |

## Evidências de execução

- Jogos auditados: 1000.
- Partidas concluídas: 1000/1000.
- Aggressive invocou cartas em 300 partidas em que participou.
- Cobertura determinística 0–4: PASSOU.
- Invocações de níveis 2/3/4 em jogos auditados: N2: 1246, N3: 218, N4: 19.
- Inconsistências de dano: 0.
- Reprodutibilidade: confirmada.
- Motor oficial sem alterações nesta tarefa: confirmado por escopo e testes.

## Critérios verificados

1. Aggressive invoca e participa: sim.
2. Baralhos com 20 cartas válidas: sim.
3. Perfis estratégicos distintos: há composições distintas.
4. Níveis 2–4 nos perfis apropriados: sim.
5. Invocações superiores legais: sim, no cenário determinístico.
6. Dano causado/recebido: coerente.
7. Estratégia/baralho por jogador: sim, presente no JSON/CSV.
8. Seeds reproduzem: sim.
9. Inversão de posições/prioridade: sim, quatro células de 25 partidas por confronto.
10. Motor oficial: sem alteração involuntária.
