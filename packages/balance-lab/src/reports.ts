import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { AggregateReport, PairedSimulationOutput, SimulationMetrics, SimulationOutput } from './types.js';
import type { CatalogAnalysis } from './catalogAnalysis.js';

function csvCell(value: unknown): string {
  const text = typeof value === 'string' ? value : JSON.stringify(value) ?? '';
  return `"${text.replaceAll('"', '""')}"`;
}

export function simulationCsv(games: readonly SimulationMetrics[]): string {
  const headers = [
    'id', 'seed', 'status', 'reason', 'winnerId', 'firstPlayerId', 'playerOneStrategy', 'playerTwoStrategy',
    'playerOneDeck', 'playerTwoDeck', 'finalRound', 'turns', 'actions', 'p1Hp', 'p2Hp', 'p1Souls', 'p2Souls',
    'p1GainedSouls', 'p2GainedSouls', 'p1CombatSouls', 'p2CombatSouls', 'p1RetirementSouls', 'p2RetirementSouls', 'p1SpentSouls', 'p2SpentSouls', 'p1Invoked', 'p2Invoked', 'p1Destroyed',
    'p2Destroyed', 'p1DamageDealt', 'p2DamageDealt', 'p1DamageReceived', 'p2DamageReceived', 'p1HpPenalties',
    'p2HpPenalties', 'p1ExcessDamage', 'p2ExcessDamage', 'p1InvocationsByLevel', 'p2InvocationsByLevel',
    'p1RemainingHandByLevel', 'p2RemainingHandByLevel', 'metricWarnings'
  ];
  const rows = games.map((game) => [
    game.id, game.seed, game.status, game.reason ?? '', game.winnerId ?? '', game.firstPlayerId, game.playerOneStrategy,
    game.playerTwoStrategy, game.playerOneDeck, game.playerTwoDeck, game.finalRound, game.turns, game.actions,
    game.finalHp[1], game.finalHp[2], game.finalSouls[1], game.finalSouls[2], game.soulsGained[1], game.soulsGained[2],
    game.soulsGainedFromCombat[1], game.soulsGainedFromCombat[2], game.soulsGainedFromRetirement[1], game.soulsGainedFromRetirement[2], game.soulsSpent[1], game.soulsSpent[2], game.cardsInvoked[1], game.cardsInvoked[2], game.cardsDestroyed[1], game.cardsDestroyed[2],
    game.damageDealt[1], game.damageDealt[2], game.damageReceived[1], game.damageReceived[2], game.hpPenalties[1], game.hpPenalties[2],
    game.excessDamage[1], game.excessDamage[2], game.invocationsByLevel[1], game.invocationsByLevel[2],
    game.cardLocationsByLevel[1].hand, game.cardLocationsByLevel[2].hand, game.metricWarnings
  ]);
  return [headers, ...rows].map((row) => row.map(csvCell).join(',')).join('\n') + '\n';
}

export function aggregateMarkdown(report: AggregateReport): string {
  const strategyRows = report.strategyResults.map((result) => `| J${result.playerId} | ${result.strategy} | ${result.deck} | ${result.games} | ${result.wins} | ${result.losses} | ${result.inconclusive} | ${result.firstPlayerGames} | ${result.firstPlayerWins} | ${result.winRate}% | ${result.averageRounds} | ${result.averageSoulsGained} | ${result.averageSoulsGainedFromCombat} | ${result.averageSoulsGainedFromRetirement} | ${result.averageDamageDealt} | ${result.averageDamageReceived} |`).join('\n');
  const levelRows = ([0, 1, 2, 3, 4] as const).map((level) => `| ${level} | ${report.invocationsByPlayerAndLevel[1][level]} | ${report.invocationsByPlayerAndLevel[2][level]} | ${report.invocationsByLevel[level]} | ${report.firstInvocationRoundByPlayerAndLevel[1][level] ?? '—'} | ${report.firstInvocationRoundByPlayerAndLevel[2][level] ?? '—'} |`).join('\n');
  const deckRows = report.deckDistributions.map((deck) => `| J${deck.playerId} | ${deck.name} | ${deck.profile} | ${deck.totalCards} | ${deck.byLevel[0]} | ${deck.byLevel[1]} | ${deck.byLevel[2]} | ${deck.byLevel[3]} | ${deck.byLevel[4]} | ${deck.definitionsMissing} | ${deck.valid ? 'sim' : 'não'} |`).join('\n');
  const missingDefinitionRows = report.deckDistributions.map((deck) => `| J${deck.playerId} | ${deck.definitionsMissing} | ${deck.missingDefinitionNames.join('; ') || '—'} |`).join('\n');
  const diagnosticsRows = ([0, 1, 2, 3, 4] as const).map((level) => `| ${level} | ${report.invocationDiagnostics[1].insufficientSouls[level]} / ${report.invocationDiagnostics[1].availableNotChosen[level]} / ${report.invocationDiagnostics[1].noSpace[level]} / ${report.invocationDiagnostics[1].placementLimit[level]} | ${report.invocationDiagnostics[2].insufficientSouls[level]} / ${report.invocationDiagnostics[2].availableNotChosen[level]} / ${report.invocationDiagnostics[2].noSpace[level]} / ${report.invocationDiagnostics[2].placementLimit[level]} |`).join('\n');
  const locationRows = ([0, 1, 2, 3, 4] as const).map((level) => `| ${level} | ${report.averageCardsRemainingInHand[1][level].toFixed(2)} | ${report.averageCardsRemainingInHand[2][level].toFixed(2)} | ${report.averageCardsRemainingInDeck[1][level].toFixed(2)} | ${report.averageCardsRemainingInDeck[2][level].toFixed(2)} |`).join('\n');
  const coverageRows = report.invocationCoverage.scenarios.map((scenario) => `| ${scenario.level} | ${scenario.cardName} | ${scenario.soulsBefore} | ${scenario.legal ? 'sim' : 'não'} | ${scenario.invoked ? 'sim' : 'não'} | ${scenario.reason ?? '—'} |`).join('\n');
  return `# SOULS Balance Lab v1.1\n\n` +
    `- Jogos: ${report.games}\n- Concluídos: ${report.completedGames}\n- Inconclusivos: ${report.inconclusiveGames}\n` +
    `- Rondas médias: ${report.averageRounds}\n- Turnos médios: ${report.averageTurns}\n` +
    `- Vitórias J1/J2: ${report.winsByPlayer[1]} / ${report.winsByPlayer[2]}\n` +
    `- Prioridade forçada: ${report.config.firstPlayerId === undefined ? 'aleatória' : `J${report.config.firstPlayerId}`}\n\n` +
    `## Estratégia, baralho e posição\n\n| Jogador | Estratégia | Baralho | Jogos | Vitórias | Derrotas | Inconclusivos | Jogos em primeiro | Vitórias em primeiro | Win rate | Rondas médias | Souls obtidas | Souls combate | Souls retirada | Dano causado | Dano recebido |\n|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|\n${strategyRows}\n\n` +
    `## Distribuição dos baralhos\n\n| Jogador | Baralho | Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Definições ausentes | Válido |\n|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|\n${deckRows}\n\n` +
    `## Cartas que não existem no baralho\n\n| Jogador | Quantidade de definições ausentes | Definições ausentes no catálogo |\n|---|---:|---|\n${missingDefinitionRows}\n\n` +
    `## Invocações por nível\n\n| Nível | J1 | J2 | Total | Primeira J1 | Primeira J2 |\n|---:|---:|---:|---:|---:|---:|\n${levelRows}\n\n` +
    `## Testes determinísticos do motor\n\n| Nível | Carta | Souls usadas | Invocação legal | Invocada | Resultado |\n|---:|---|---:|---|---|---|\n${coverageRows}\n\n` +
    `## Diagnóstico de invocação\n\nCada célula apresenta: Souls insuficientes / disponíveis não escolhidas / sem espaço / limite de colocação.\n\n| Nível | J1 | J2 |\n|---:|---|---|\n${diagnosticsRows}\n\n` +
    `## Cartas que permaneceram\n\nA coluna “não compradas” corresponde às cartas que ainda estão no baralho no fim da partida.\n\n| Nível | Mão J1 | Mão J2 | Não compradas J1 | Não compradas J2 |\n|---:|---:|---:|---:|---:|\n${locationRows}\n\n` +
    `## Souls e dano\n\n| Métrica | J1 | J2 |\n|---|---:|---:|\n| Souls ganhas médias | ${report.averageSoulsGained[1]} | ${report.averageSoulsGained[2]} |\n| Souls gastas médias | ${report.averageSoulsSpent[1]} | ${report.averageSoulsSpent[2]} |\n| Dano de combate causado | ${report.averageCombatDamageDealt[1]} | ${report.averageCombatDamageDealt[2]} |\n| Dano de combate recebido | ${report.averageCombatDamageReceived[1]} | ${report.averageCombatDamageReceived[2]} |\n| Penalizações de HP | ${report.averageHpPenalties[1]} | ${report.averageHpPenalties[2]} |\n| Dano excedente | ${report.averageExcessDamage[1]} | ${report.averageExcessDamage[2]} |\n\n` +
    `## Alertas\n\n${report.warnings.length === 0 ? '- Nenhum alerta heurístico nesta execução.' : report.warnings.map((warning) => `- ${warning}`).join('\n')}\n`;
}

export function writeSimulationReports(output: SimulationOutput, directory: string, prefix: string): readonly string[] {
  mkdirSync(directory, { recursive: true });
  const paths = {
    json: join(directory, `${prefix}.json`),
    csv: join(directory, `${prefix}.csv`),
    markdown: join(directory, `${prefix}.md`)
  };
  writeFileSync(paths.json, JSON.stringify(output, null, 2), 'utf8');
  writeFileSync(paths.csv, simulationCsv(output.games), 'utf8');
  writeFileSync(paths.markdown, aggregateMarkdown(output.aggregate), 'utf8');
  return Object.values(paths);
}

export function pairedComparisonCsv(output: PairedSimulationOutput): string {
  const headers = ['pairIndex', 'seed', 'baselineSimulationId', 'swappedSimulationId', 'baselineFirstPlayerId', 'swappedFirstPlayerId', 'baselineWinnerId', 'swappedWinnerId'];
  const rows = output.comparisons.map((comparison) => [
    comparison.pairIndex, comparison.seed, comparison.baselineSimulationId, comparison.swappedSimulationId,
    comparison.baselineFirstPlayerId, comparison.swappedFirstPlayerId, comparison.baselineWinnerId ?? '', comparison.swappedWinnerId ?? ''
  ]);
  return [headers, ...rows].map((row) => row.map(csvCell).join(',')).join('\n') + '\n';
}

export function pairedComparisonMarkdown(output: PairedSimulationOutput): string {
  const rows = output.comparisons.map((comparison) => `| ${comparison.pairIndex} | ${comparison.seed} | J${comparison.baselineFirstPlayerId} | J${comparison.swappedFirstPlayerId} | ${comparison.baselineWinnerId === undefined ? '—' : `J${comparison.baselineWinnerId}`} | ${comparison.swappedWinnerId === undefined ? '—' : `J${comparison.swappedWinnerId}`} |`).join('\n');
  return `# SOULS Balance Lab · comparação emparelhada\n\n` +
    `Cada linha reutiliza a mesma seed e inverte as posições/estratégias.\n\n` +
    `| Par | Seed | Primeiro baseline | Primeiro swapped | Vencedor baseline | Vencedor swapped |\n|---:|---:|---:|---:|---:|---:|\n${rows}\n\n` +
    `## Resumos\n\n- Baseline: ${output.baseline.aggregate.winsByPlayer[1]} vitórias J1 / ${output.baseline.aggregate.winsByPlayer[2]} vitórias J2.\n` +
    `- Swapped: ${output.swapped.aggregate.winsByPlayer[1]} vitórias J1 / ${output.swapped.aggregate.winsByPlayer[2]} vitórias J2.\n\n` +
    `## Alertas\n\n${output.warnings.length === 0 ? '- Nenhum alerta de emparelhamento.' : output.warnings.map((warning) => `- ${warning}`).join('\n')}\n`;
}

export function writePairedReports(output: PairedSimulationOutput, directory: string, prefix: string): readonly string[] {
  mkdirSync(directory, { recursive: true });
  const paths = {
    json: join(directory, `${prefix}.json`),
    csv: join(directory, `${prefix}.csv`),
    markdown: join(directory, `${prefix}.md`)
  };
  writeFileSync(paths.json, JSON.stringify(output, null, 2), 'utf8');
  writeFileSync(paths.csv, pairedComparisonCsv(output), 'utf8');
  writeFileSync(paths.markdown, pairedComparisonMarkdown(output), 'utf8');
  return Object.values(paths);
}

export function catalogAnalysisMarkdown(analysis: CatalogAnalysis): string {
  const levels = ([0, 1, 2, 3, 4] as const).map((level) => `| ${level} | ${analysis.byLevel[level]} | ${analysis.averageAttackByLevel[level]} | ${analysis.averageDefenseByLevel[level]} |`).join('\n');
  const factions = Object.entries(analysis.byFaction).map(([faction, count]) => `| ${faction} | ${count} |`).join('\n');
  return `# SOULS Catalog Analysis\n\n` +
    `- Definições: ${analysis.totalDefinitions}\n- Melee: ${analysis.byType.melee}\n- Ranged: ${analysis.byType.ranged}\n\n` +
    `## Níveis\n\n| Nível | Cartas | ATK médio | DEF médio |\n|---:|---:|---:|---:|\n${levels}\n\n` +
    `## Facções\n\n| Fação | Cartas |\n|---|---:|\n${factions}\n`;
}
