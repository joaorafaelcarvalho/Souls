# Balance Lab & Automated Playtesting · SOULS v0.7

O Balance Lab está em [packages/balance-lab](../packages/balance-lab). É uma ferramenta Node independente da interface que reutiliza `initializeGame`, `placeCard`, `finishPositioningPhase`, `resolveDrawPhase` e `resolveAttackPhase` do `game-core`.

## Execução

```powershell
npm run balance:smoke
npm run balance:test
npm run balance:extended
```

Os modos executam, respetivamente, 20, 100 e 500 partidas. Os valores podem ser ajustados diretamente no pacote com `--games`, `--seed`, `--max-rounds`, `--max-actions`, `--strategy-a`, `--strategy-b`, `--deck-a`, `--deck-b` e `--out`.

Exemplo:

```powershell
npm --workspace @souls/balance-lab run smoke -- --seed 1234 --games 20 --strategy-a balanced --strategy-b defensive --events
```

As execuções guardam todos os eventos com `--events` ou apenas partidas selecionadas com, por exemplo, `--event-games 1,7`. `--swap` executa uma matriz emparelhada: cada par reutiliza a mesma seed, troca os baralhos/estratégias e força a prioridade inicial para a posição oposta. O baseline, a matriz trocada e a comparação emparelhada recebem ficheiros JSON, CSV e Markdown separados.

Para analisar o catálogo sem simular partidas:

```powershell
npm run balance:catalog
```

Para executar a auditoria completa v0.7, com os dez confrontos pedidos e 100 partidas por confronto:

```powershell
npm run balance:audit -- --out reports/balance-lab/v1.1/audit-final
```

Cada confronto da auditoria usa quatro células de 25 partidas: cada estratégia aparece em cada posição física e com prioridade inicial. O total é de 100 partidas por confronto e 1 000 partidas no conjunto. O comando produz `balance-v0.7-validation.md`, `balance-v0.7-simulations.json`, `balance-v0.7-simulations.csv`, `balance-v0.7-report.md`, `balance-v0.7-comparison.md` e `balance-v0.7-findings.md`.

Para repetir a matriz com estratégias e baralhos trocados, acrescenta `--swap`. Os relatórios smoke de referência ficam em [packages/balance-lab/reports/balance-lab](../packages/balance-lab/reports/balance-lab).

Para executar a verificação v0.7.1 e gerar uma pasta nova, sem substituir os relatórios históricos:

```powershell
npm run balance:audit-v071
```

O comando executa `test:ci`, lint, typecheck, build e a auditoria oficial de 1 000 partidas. Os seis ficheiros são guardados em `packages/balance-lab/reports/balance-lab/v0.7.1`. A comparação v0.6 usa apenas a execução histórica emparelhada disponível em `v1.1/audit-final`; variantes isoladas A–D não são inventadas quando o motor não oferece uma configuração v0.6 segura.

São escritos JSON, CSV e Markdown em `packages/balance-lab/reports/balance-lab`. Partidas que excedam os limites configurados são classificadas como `inconclusive`; não recebem um vencedor artificial.

## Estratégias e métricas

As estratégias atuais são `random-legal`, `balanced`, `aggressive`, `defensive`, `low-cost`, `high-cost` e `combined-attack`. Todas recebem apenas a própria mão, o tabuleiro público e opções de colocação já validadas pelo motor. Os perfis de baralho são explícitos: `balanced`, `aggressive`, `defensive`, `low-cost`, `high-cost` e `combined-attack`, além de `expensive-negative`, que preserva o antigo cenário sem cartas gratuitas apenas como teste negativo.

Todos os perfis normais têm exatamente 20 cartas, cartas de nível 0 para poderem começar com zero Souls e uma composição intencionalmente diferente. O Balance Lab não impõe limites de cópias que não estejam no regulamento.

Os relatórios incluem estratégia, baralho, jogador, prioridade inicial, seed, vencedor, rondas, turnos, ações, Souls ganhas em combate/retirada, Souls gastas, retiradas, composição por nível/tipo, cartas que ficaram no baralho ou na mão, invocações por nível, primeira ronda de invocação, motivos de invocação impossível, dano de combate causado/recebido, penalizações de compras falhadas e dano excedente.

`damageDealt` significa dano de combate causado pelo jogador que iniciou a troca ou pelo proprietário da carta defensora quando o atacante perde. `damageReceived` é o mesmo dano visto pelo alvo. Na v0.7, `hpPenalties` cobre apenas falhas de compra: ataques bloqueados não gastam Souls nem causam HP. O laboratório também separa Souls ganhas por combate e por retirada estratégica.

Os agentes podem escolher uma retirada estratégica antes de colocar cartas quando têm uma carta cara na mão, Souls abaixo do máximo e uma carta de baixo valor no campo. A decisão usa apenas a mão própria e o tabuleiro público; a retirada consome uma ação através do mesmo `TurnState` oficial.

Cada execução inclui ainda um cenário determinístico de cobertura que invoca legalmente uma carta de cada nível 0–4 e testa o custo insuficiente para os níveis 1–4. Este cenário é diagnóstico e não altera as partidas normais nem configura Souls iniciais no motor oficial.

O laboratório mede potenciais desequilíbrios, mas não altera atributos, custos ou regras automaticamente. Os alertas são heurísticas de investigação e não decisões de balanceamento.

Todos os perfis normais têm exatamente 20 cartas e a distribuição oficial N0=10, N1=4, N2=3, N3=2, N4=1. low-cost representa early-pressure e high-cost representa late-game; os identificadores antigos são mantidos para compatibilidade. expensive-negative permanece apenas como cenário de rejeição e não pode iniciar partidas.

Antes de cada simulação, o Balance Lab usa validateOfficialDeckComposition do game-content. Uma composição inválida é rejeitada com o nome do baralho, a distribuição encontrada, a distribuição esperada e as regras violadas.

Para a auditoria final de validação oficial e playtesting humano:

~~~powershell
npm run balance:audit-v072
~~~

Os resultados são escritos numa pasta nova packages/balance-lab/reports/balance-lab/v0.7.2, sem substituir as baterias históricas.
