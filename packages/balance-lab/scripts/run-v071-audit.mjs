/* global console, process */

import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';

const root = existsSync(join(process.cwd(), 'packages'))
  ? process.cwd()
  : resolve(process.cwd(), '..', '..');
const outputDirectory = join(root, 'packages', 'balance-lab', 'reports', 'balance-lab', 'v0.7.1');
const historicalPath = join(root, 'packages', 'balance-lab', 'reports', 'balance-lab', 'v1.1', 'audit-final', 'balance-v1.1-simulations.json');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const startedAt = new Date();

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    shell: true,
    maxBuffer: 50 * 1024 * 1024
  });
  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
  const tests = [...output.matchAll(/Tests\s+(\d+)\s+passed/g)].reduce((sum, match) => sum + Number(match[1]), 0);
  return {
    command: [command, ...args].join(' '),
    passed: result.status === 0,
    tests,
    exitCode: result.status ?? 1,
    error: result.error?.message,
    output
  };
}

function round(value, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function counter(value, playerId) {
  return Number(value?.[String(playerId)] ?? 0);
}

function nestedCounter(value, playerId, level) {
  return Number(value?.[String(playerId)]?.[String(level)] ?? 0);
}

function csvCell(value) {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function tableRow(values) {
  return `| ${values.map((value) => String(value)).join(' | ')} |`;
}

function flatten(audit) {
  const rows = [];
  for (const confrontation of audit.confrontations ?? []) {
    for (const run of confrontation.runs ?? []) {
      for (const game of run.output.games ?? []) {
        rows.push({ confrontationId: confrontation.matchup.id, cell: run.cell, game });
      }
    }
  }
  return rows;
}

function playerStrategy(game, playerId) {
  return playerId === 1 ? game.playerOneStrategy : game.playerTwoStrategy;
}

function highLevelHand(game, playerId) {
  return [2, 3, 4].reduce((sum, level) => sum + counter(game.cardLocationsByLevel?.[playerId]?.hand, level), 0);
}

function highLevelDeck(game, playerId) {
  return [2, 3, 4].reduce((sum, level) => sum + counter(game.cardLocationsByLevel?.[playerId]?.deck, level), 0);
}

function deckRemaining(game, playerId) {
  return [0, 1, 2, 3, 4].reduce((sum, level) => sum + counter(game.cardLocationsByLevel?.[playerId]?.deck, level), 0);
}

function summarizeEconomy(rows) {
  const strategies = ['balanced', 'aggressive', 'defensive', 'low-cost', 'high-cost', 'combined-attack'];
  const values = new Map(strategies.map((strategy) => [strategy, {
    strategy,
    playerGames: 0,
    wins: 0,
    totalSoulsGained: 0,
    totalCombatSouls: 0,
    totalRetirementSouls: 0,
    totalSoulsSpentOnInvocations: 0,
    totalSoulsSpentOnPenalties: 0,
    totalFailedDraws: 0,
    failedPurchaseGames: 0,
    lossesWithFailedPurchases: 0,
    totalHpPenalty: 0,
    lossesWithHpPenalty: 0,
    totalCardsRemainingInDeck: 0,
    totalHighLevelCardsRemainingInHand: 0,
    totalHighLevelCardsNotDrawn: 0,
    deckEmptyAtEndGames: 0
  }]));
  const overall = {
    totalPlayerGames: rows.length * 2,
    playerGamesWithFailedPurchases: 0,
    totalFailedPurchases: 0,
    totalHpPenalty: 0,
    playerLossesWithFailedPurchases: 0,
    playerLossesWithHpPenalty: 0,
    totalCardsRemainingInDeckAtEnd: 0,
    totalHighLevelCardsRemainingInHandAtEnd: 0,
    totalHighLevelCardsNotDrawn: 0
  };
  for (const { game } of rows) {
    for (const playerId of [1, 2]) {
      const strategy = playerStrategy(game, playerId);
      const value = values.get(strategy);
      if (!value) continue;
      const failedDraws = counter(game.failedDraws, playerId);
      const hpPenalty = counter(game.hpPenalties, playerId);
      const lost = game.winnerId !== playerId;
      value.playerGames += 1;
      if (game.winnerId === playerId) value.wins += 1;
      value.totalSoulsGained += counter(game.soulsGained, playerId);
      value.totalCombatSouls += counter(game.soulsGainedFromCombat, playerId);
      value.totalRetirementSouls += counter(game.soulsGainedFromRetirement, playerId);
      value.totalSoulsSpentOnInvocations += counter(game.soulsSpentOnInvocations, playerId);
      value.totalSoulsSpentOnPenalties += counter(game.soulsSpentOnPenalties, playerId);
      value.totalFailedDraws += failedDraws;
      value.totalHpPenalty += hpPenalty;
      value.totalCardsRemainingInDeck += deckRemaining(game, playerId);
      value.totalHighLevelCardsRemainingInHand += highLevelHand(game, playerId);
      value.totalHighLevelCardsNotDrawn += highLevelDeck(game, playerId);
      if (failedDraws > 0) {
        value.failedPurchaseGames += 1;
        overall.playerGamesWithFailedPurchases += 1;
      }
      if (lost && failedDraws > 0) {
        value.lossesWithFailedPurchases += 1;
        overall.playerLossesWithFailedPurchases += 1;
      }
      if (lost && hpPenalty > 0) {
        value.lossesWithHpPenalty += 1;
        overall.playerLossesWithHpPenalty += 1;
      }
      if (deckRemaining(game, playerId) === 0) value.deckEmptyAtEndGames += 1;
      overall.totalFailedPurchases += failedDraws;
      overall.totalHpPenalty += hpPenalty;
      overall.totalCardsRemainingInDeckAtEnd += deckRemaining(game, playerId);
      overall.totalHighLevelCardsRemainingInHandAtEnd += highLevelHand(game, playerId);
      overall.totalHighLevelCardsNotDrawn += highLevelDeck(game, playerId);
    }
  }
  return {
    byStrategy: [...values.values()].map((value) => ({
      strategy: value.strategy,
      playerGames: value.playerGames,
      wins: value.wins,
      losses: value.playerGames - value.wins,
      winRate: round((value.wins / Math.max(1, value.playerGames)) * 100),
      totalSoulsGained: value.totalSoulsGained,
      totalCombatSouls: value.totalCombatSouls,
      totalRetirementSouls: value.totalRetirementSouls,
      totalSoulsSpentOnInvocations: value.totalSoulsSpentOnInvocations,
      totalSoulsSpentOnPenalties: value.totalSoulsSpentOnPenalties,
      totalFailedDraws: value.totalFailedDraws,
      failedPurchaseGames: value.failedPurchaseGames,
      lossesWithFailedPurchases: value.lossesWithFailedPurchases,
      totalHpPenalty: value.totalHpPenalty,
      lossesWithHpPenalty: value.lossesWithHpPenalty,
      averageFailedDraws: round(value.totalFailedDraws / Math.max(1, value.playerGames)),
      averageHpPenalty: round(value.totalHpPenalty / Math.max(1, value.playerGames)),
      averageSoulsGained: round(value.totalSoulsGained / Math.max(1, value.playerGames)),
      averageCombatSouls: round(value.totalCombatSouls / Math.max(1, value.playerGames)),
      averageRetirementSouls: round(value.totalRetirementSouls / Math.max(1, value.playerGames)),
      averageCardsRemainingInDeck: round(value.totalCardsRemainingInDeck / Math.max(1, value.playerGames)),
      averageHighLevelCardsRemainingInHand: round(value.totalHighLevelCardsRemainingInHand / Math.max(1, value.playerGames)),
      averageHighLevelCardsNotDrawn: round(value.totalHighLevelCardsNotDrawn / Math.max(1, value.playerGames)),
      deckEmptyAtEndGames: value.deckEmptyAtEndGames
    })),
    overall
  };
}

function summarizeLevels(rows) {
  return [0, 1, 2, 3, 4].map((level) => {
    let totalInvocations = 0;
    let playerGamesWithInvocation = 0;
    const firstRounds = [];
    for (const { game } of rows) {
      for (const playerId of [1, 2]) {
        const invocations = nestedCounter(game.invocationsByLevel, playerId, level);
        totalInvocations += invocations;
        if (invocations > 0) playerGamesWithInvocation += 1;
        const firstRound = game.firstInvocationRoundByLevel?.[playerId]?.[level];
        if (firstRound !== null && firstRound !== undefined) firstRounds.push(firstRound);
      }
    }
    return {
      level,
      totalInvocations,
      playerGamesWithInvocation,
      playerGamePercentage: round((playerGamesWithInvocation / Math.max(1, rows.length * 2)) * 100),
      averageFirstInvocationRound: firstRounds.length === 0 ? null : round(firstRounds.reduce((sum, value) => sum + value, 0) / firstRounds.length)
    };
  });
}

function oldStrategySummary(oldAudit) {
  const strategies = ['balanced', 'aggressive', 'defensive', 'low-cost', 'high-cost', 'combined-attack'];
  const values = new Map(strategies.map((strategy) => [strategy, {
    games: 0,
    wins: 0,
    failedDraws: 0,
    hpPenalty: 0,
    level3Invocations: 0,
    level4Invocations: 0
  }]));
  for (const { game } of flatten(oldAudit)) {
    for (const playerId of [1, 2]) {
      const value = values.get(playerStrategy(game, playerId));
      if (!value) continue;
      value.games += 1;
      if (game.winnerId === playerId) value.wins += 1;
      value.failedDraws += counter(game.failedDraws, playerId);
      value.hpPenalty += counter(game.hpPenalties, playerId);
      value.level3Invocations += nestedCounter(game.invocationsByLevel, playerId, 3);
      value.level4Invocations += nestedCounter(game.invocationsByLevel, playerId, 4);
    }
  }
  return values;
}

function currentStrategySummary(currentAudit, rows) {
  const values = new Map(['balanced', 'aggressive', 'defensive', 'low-cost', 'high-cost', 'combined-attack'].map((strategy) => [strategy, {
    games: 0,
    wins: 0,
    failedDraws: 0,
    hpPenalty: 0,
    level3Invocations: 0,
    level4Invocations: 0
  }]));
  for (const { game } of rows) {
    for (const playerId of [1, 2]) {
      const value = values.get(playerStrategy(game, playerId));
      if (!value) continue;
      value.games += 1;
      if (game.winnerId === playerId) value.wins += 1;
      value.failedDraws += counter(game.failedDraws, playerId);
      value.hpPenalty += counter(game.hpPenalties, playerId);
      value.level3Invocations += nestedCounter(game.invocationsByLevel, playerId, 3);
      value.level4Invocations += nestedCounter(game.invocationsByLevel, playerId, 4);
    }
  }
  return values;
}

function deckCards(output, playerId) {
  const config = output?.aggregate?.config;
  return playerId === 1 ? config?.playerOneDeck?.cards ?? [] : config?.playerTwoDeck?.cards ?? [];
}

function compareRuns(currentAudit, oldAudit) {
  const currentById = new Map(currentAudit.confrontations.map((item) => [item.matchup.id, item]));
  const sameMatchups = oldAudit.confrontations.length === currentAudit.confrontations.length && oldAudit.confrontations.every((oldConfrontation) => {
    const current = currentById.get(oldConfrontation.matchup.id);
    return current && current.matchup.seed === oldConfrontation.matchup.seed && current.games === oldConfrontation.games;
  });
  let sameSeeds = sameMatchups;
  let sameDecks = sameMatchups;
  for (const oldConfrontation of oldAudit.confrontations) {
    const current = currentById.get(oldConfrontation.matchup.id);
    if (!current) {
      sameSeeds = false;
      sameDecks = false;
      continue;
    }
    current.runs.forEach((run, index) => {
      const oldRun = oldConfrontation.runs[index];
      if (!oldRun) {
        sameSeeds = false;
        sameDecks = false;
        return;
      }
      const currentSeeds = run.output.games.map((game) => game.seed);
      const oldSeeds = oldRun.output.games.map((game) => game.seed);
      if (JSON.stringify(currentSeeds) !== JSON.stringify(oldSeeds)) sameSeeds = false;
      if (JSON.stringify(deckCards(run.output, 1)) !== JSON.stringify(deckCards(oldRun.output, 1))) sameDecks = false;
      if (JSON.stringify(deckCards(run.output, 2)) !== JSON.stringify(deckCards(oldRun.output, 2))) sameDecks = false;
    });
  }
  return { sameMatchups, sameSeeds, sameDecks };
}

function comparison(currentAudit, oldAudit, historicalReference, currentRows) {
  if (!oldAudit) {
    return {
      status: 'reference-unavailable',
      v06WasExecutedDuringThisRun: false,
      sameSeeds: false,
      sameDecks: false,
      sameMatchups: false,
      strategyRows: [],
      notes: ['Não foi encontrado um relatório histórico v0.6 verificável.']
    };
  }
  const match = compareRuns(currentAudit, oldAudit);
  const old = oldStrategySummary(oldAudit);
  const current = currentStrategySummary(currentAudit, currentRows);
  const strategyRows = ['balanced', 'aggressive', 'defensive', 'low-cost', 'high-cost', 'combined-attack'].map((strategy) => {
    const v06 = old.get(strategy);
    const v07 = current.get(strategy);
    const v06WinRate = round((v06.wins / Math.max(1, v06.games)) * 100);
    const v07WinRate = round((v07.wins / Math.max(1, v07.games)) * 100);
    return {
      strategy,
      v06Games: v06.games,
      v06Wins: v06.wins,
      v06WinRate,
      v07Games: v07.games,
      v07Wins: v07.wins,
      v07WinRate,
      winRateDelta: round(v07WinRate - v06WinRate),
      v06FailedDraws: v06.failedDraws,
      v07FailedDraws: v07.failedDraws,
      v06HpPenalty: v06.hpPenalty,
      v07HpPenalty: v07.hpPenalty,
      v06Level3Invocations: v06.level3Invocations,
      v07Level3Invocations: v07.level3Invocations,
      v06Level4Invocations: v06.level4Invocations,
      v07Level4Invocations: v07.level4Invocations
    };
  });
  return {
    status: match.sameMatchups && match.sameSeeds && match.sameDecks ? 'matched-historical-reference' : 'not-controlled',
    v06WasExecutedDuringThisRun: false,
    ...match,
    strategyRows,
    historicalReference,
    notes: [
      'A referência v0.6 foi encontrada no repositório e usa os mesmos confrontos, seeds e baralhos.',
      'A referência v0.6 não foi reexecutada nesta sessão: o motor v0.6 não está disponível como variante versionada.',
      'A separação causal entre economia e atributos não foi executada, porque exigiria duplicar ou parametrizar as regras oficiais.'
    ]
  };
}

function csv(report) {
  const header = [
    'auditVersion', 'rulesVersion', 'confrontationId', 'cell', 'gameId', 'seed', 'playerOneStrategy', 'playerTwoStrategy',
    'playerOneDeck', 'playerTwoDeck', 'firstPlayerId', 'winnerId', 'status', 'finalRound', 'turns', 'actions',
    'failedDrawsP1', 'failedDrawsP2', 'hpPenaltyP1', 'hpPenaltyP2', 'soulsCombatP1', 'soulsCombatP2',
    'soulsRetirementP1', 'soulsRetirementP2', 'soulsSpentInvocationP1', 'soulsSpentInvocationP2',
    'soulsSpentPenaltyP1', 'soulsSpentPenaltyP2', 'cardsRetiredP1', 'cardsRetiredP2', 'invocationsN2P1',
    'invocationsN2P2', 'invocationsN3P1', 'invocationsN3P2', 'invocationsN4P1', 'invocationsN4P2'
  ];
  const lines = [header.map(csvCell).join(',')];
  for (const { confrontationId, cell, game } of flatten(report.currentAudit)) {
    lines.push([
      report.schemaVersion, report.currentAudit.rulesVersion, confrontationId, cell, game.id, game.seed,
      game.playerOneStrategy, game.playerTwoStrategy, game.playerOneDeck, game.playerTwoDeck, game.firstPlayerId,
      game.winnerId ?? '', game.status, game.finalRound, game.turns, game.actions, counter(game.failedDraws, 1),
      counter(game.failedDraws, 2), counter(game.hpPenalties, 1), counter(game.hpPenalties, 2),
      counter(game.soulsGainedFromCombat, 1), counter(game.soulsGainedFromCombat, 2), counter(game.soulsGainedFromRetirement, 1),
      counter(game.soulsGainedFromRetirement, 2), counter(game.soulsSpentOnInvocations, 1), counter(game.soulsSpentOnInvocations, 2),
      counter(game.soulsSpentOnPenalties, 1), counter(game.soulsSpentOnPenalties, 2), counter(game.cardsRetired, 1),
      counter(game.cardsRetired, 2), nestedCounter(game.invocationsByLevel, 1, 2), nestedCounter(game.invocationsByLevel, 2, 2),
      nestedCounter(game.invocationsByLevel, 1, 3), nestedCounter(game.invocationsByLevel, 2, 3), nestedCounter(game.invocationsByLevel, 1, 4),
      nestedCounter(game.invocationsByLevel, 2, 4)
    ].map(csvCell).join(','));
  }
  return `${lines.join('\n')}\n`;
}

function validationMarkdown(report) {
  const testRows = report.execution.validation.map((test) => tableRow([test.command, test.passed ? 'PASSOU' : 'FALHOU', test.tests, test.exitCode])).join('\n');
  const validation = report.currentAudit.validation;
  return `# SOULS Balance Lab v0.7.1 — validação\n\n` +
    `- Gerado em: ${report.execution.finishedAt}\n- Início: ${report.execution.startedAt}\n- Duração da auditoria: ${report.execution.durationMs} ms\n` +
    `- Regras: ${report.currentAudit.rulesVersion}\n- Catálogo: ${report.currentAudit.catalogVersion}\n- Comando: \`${report.execution.command}\`\n\n` +
    `## Comandos realmente executados\n\n| Comando | Resultado | Testes | Exit code |\n|---|---|---:|---:|\n${testRows}\n\n` +
    `A suíte npm run test:ci incluiu game-core, Balance Lab, game-content, web e API. O valor reportado foi contado a partir da saída desta execução, não herdado dos relatórios antigos.\n\n` +
    `## Auditoria\n\n- Partidas executadas: ${report.totalGames}.\n- Partidas concluídas: ${validation.completedGames}/${report.totalGames}.\n` +
    `- Confrontos: ${report.currentAudit.confrontations.length}; ${report.execution.gamesPerMatchup} partidas por confronto.\n- Seeds: ${report.execution.seedSchedule.join(', ')}.\n` +
    `- Cobertura determinística 0–4: ${validation.invocationCoverage.allLevelsCovered ? 'PASSOU' : 'FALHOU'}.\n- Inconsistências de métricas: ${validation.metricInconsistencies}.\n` +
    `- Reprodutibilidade declarada pelo laboratório: ${validation.reproducibility ? 'confirmada' : 'não confirmada'}.\n- Aggressive com invocações: ${validation.aggressiveGamesWithInvocation}.\n\n` +
    `## Referência v0.6\n\n- Reexecutada nesta sessão: não.\n- Referência localizada: ${report.comparison.historicalReference?.path ?? 'não encontrada'}.\n` +
    `- Seeds, baralhos e confrontos coincidentes: ${report.comparison.status === 'matched-historical-reference' ? 'sim' : 'não confirmado'}.\n`;
}

function comparisonMarkdown(report) {
  const rows = report.comparison.strategyRows.map((row) => tableRow([
    row.strategy,
    `${row.v06Wins}/${row.v06Games} (${row.v06WinRate}%)`,
    `${row.v07Wins}/${row.v07Games} (${row.v07WinRate}%)`,
    row.winRateDelta,
    `${row.v06FailedDraws}/${row.v07FailedDraws}`,
    `${row.v06HpPenalty}/${row.v07HpPenalty}`,
    `${row.v06Level3Invocations}/${row.v07Level3Invocations}`,
    `${row.v06Level4Invocations}/${row.v07Level4Invocations}`
  ])).join('\n');
  return `# SOULS Balance Lab v0.7.1 — comparação v0.6/v0.7\n\n` +
    `A v0.6 é uma referência histórica real, gerada em ${report.comparison.historicalReference?.generatedAt ?? 'data desconhecida'}, e não foi reexecutada em ${report.execution.finishedAt}. ` +
    `A v0.7 foi executada agora.\n\n` +
    `- Mesmos confrontos: ${report.comparison.sameMatchups ? 'sim' : 'não'}\n- Mesmas seeds: ${report.comparison.sameSeeds ? 'sim' : 'não'}\n` +
    `- Mesmos baralhos: ${report.comparison.sameDecks ? 'sim' : 'não'}\n- Estatuto: ${report.comparison.status}\n\n` +
    `| Estratégia | v0.6 vitórias/jogos | v0.7 vitórias/jogos | Delta win rate (p.p.) | Compras falhadas v0.6/v0.7 | Penalização HP v0.6/v0.7 | N3 v0.6/v0.7 | N4 v0.6/v0.7 |\n|---|---:|---:|---:|---:|---:|---:|---:|\n${rows}\n\n` +
    `## Variantes isoladas\n\n` +
    `As experiências A–D (economia antiga/nova combinada com atributos antigos/novos) não foram executadas. O repositório não contém um motor v0.6 versionado nem uma configuração de regras que permita trocar apenas esses eixos. Criar essa variante exigiria duplicar ou parametrizar a lógica normativa, o que violaria a restrição desta tarefa. Portanto, a tabela acima é uma comparação emparelhada histórica, não uma decomposição causal A–D.\n`;
}

function economyMarkdown(report) {
  const strategyRows = report.economy.byStrategy.map((strategy) => tableRow([
    strategy.strategy, strategy.playerGames, `${strategy.wins}/${strategy.losses}`, `${strategy.winRate}%`, strategy.averageSoulsGained,
    strategy.averageCombatSouls, strategy.averageRetirementSouls, strategy.totalSoulsSpentOnInvocations, strategy.totalSoulsSpentOnPenalties,
    strategy.averageFailedDraws, strategy.averageHpPenalty, strategy.lossesWithFailedPurchases,
    strategy.averageHighLevelCardsRemainingInHand, strategy.averageHighLevelCardsNotDrawn
  ])).join('\n');
  const levelRows = report.economy.levels.map((level) => tableRow([
    `N${level.level}`, level.totalInvocations, level.playerGamesWithInvocation, `${level.playerGamePercentage}%`, level.averageFirstInvocationRound ?? '—'
  ])).join('\n');
  const overall = report.exhaustion;
  return `# SOULS Balance Lab v0.7.1 — economia e esgotamento\n\n` +
    `- Gerado em: ${report.execution.finishedAt}\n- Partidas v0.7: ${report.totalGames}\n- Seeds: ${report.execution.seedSchedule.join(', ')}\n\n` +
    `## Economia por estratégia\n\n| Estratégia | Participações | Vitórias/derrotas | Win rate | Souls médias | Combate | Retirada | Gastas invocação | Gastas compra falhada | Compras falhadas médias | HP perdido médio | Derrotas com compra falhada | N2–N4 na mão | N2–N4 não compradas |\n|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|\n${strategyRows}\n\n` +
    `## Invocações por nível\n\n| Nível | Invocações totais | Participações individuais | Percentagem das participações | Primeira ronda média |\n|---:|---:|---:|---:|---:|\n${levelRows}\n\n` +
    `Totais e participações são indicadores diferentes: várias cartas do mesmo nível numa partida contam várias vezes no total, mas uma vez na participação individual.\n\n` +
    `## Esgotamento e compras falhadas\n\n- Participações de jogador: ${overall.totalPlayerGames}.\n- Participações com compra falhada: ${overall.playerGamesWithFailedPurchases}.\n` +
    `- Compras falhadas totais: ${overall.totalFailedPurchases}.\n- HP perdido por penalizações de compra: ${overall.totalHpPenalty}.\n` +
    `- Derrotas com compra falhada: ${overall.playerLossesWithFailedPurchases}.\n- Derrotas com penalização de HP: ${overall.playerLossesWithHpPenalty}.\n` +
    `- Cartas restantes no baralho no fim: ${overall.totalCardsRemainingInDeckAtEnd}.\n- N2–N4 na mão no fim: ${overall.totalHighLevelCardsRemainingInHandAtEnd}.\n` +
    `- N2–N4 não compradas: ${overall.totalHighLevelCardsNotDrawn}.\n\n` +
    `Na v0.7, HP perdido neste quadro vem de compras falhadas; ataques bloqueados não são contabilizados como penalização.\n`;
}

function findingsMarkdown(report) {
  const rows = (report.currentAudit.findings ?? []).map((finding) => tableRow([finding.severity.toUpperCase(), finding.subject, finding.evidence, finding.recommendation])).join('\n');
  return `# SOULS Balance Lab v0.7.1 — findings\n\n` +
    `Resultados reais desta execução: ${report.totalGames} partidas v0.7, terminadas em ${report.execution.finishedAt}.\n\n` +
    `| Gravidade | Assunto | Evidência | Recomendação |\n|---|---|---|---|\n${rows}\n\n` +
    `## Limitações não mascaradas\n\n- A decomposição A–D não foi executada por falta de motor v0.6 configurável.\n` +
    `- A v0.6 usada na comparação é histórica e não foi reexecutada nesta data.\n- Dano por carta individual não é atribuível pelos eventos oficiais atuais.\n`;
}

function writeReports(report) {
  mkdirSync(outputDirectory, { recursive: true });
  const paths = {
    validation: join(outputDirectory, 'balance-v0.7.1-validation.md'),
    comparison: join(outputDirectory, 'balance-v0.7.1-comparison.md'),
    economy: join(outputDirectory, 'balance-v0.7.1-economy.md'),
    findings: join(outputDirectory, 'balance-v0.7.1-findings.md'),
    simulationsJson: join(outputDirectory, 'balance-v0.7.1-simulations.json'),
    simulationsCsv: join(outputDirectory, 'balance-v0.7.1-simulations.csv')
  };
  writeFileSync(paths.validation, validationMarkdown(report), 'utf8');
  writeFileSync(paths.comparison, comparisonMarkdown(report), 'utf8');
  writeFileSync(paths.economy, economyMarkdown(report), 'utf8');
  writeFileSync(paths.findings, findingsMarkdown(report), 'utf8');
  writeFileSync(paths.simulationsJson, JSON.stringify(report, null, 2), 'utf8');
  writeFileSync(paths.simulationsCsv, csv(report), 'utf8');
  return Object.values(paths);
}

const verification = [
  run(npmCommand, ['run', 'test:ci']),
  run(npmCommand, ['run', 'lint']),
  run(npmCommand, ['run', 'typecheck']),
  run(npmCommand, ['run', 'build'])
];
const temporaryOutput = mkdtempSync(join(tmpdir(), 'souls-balance-v071-'));
const auditRun = run(npmCommand, ['--workspace', '@souls/balance-lab', 'run', 'audit', '--', '--out', temporaryOutput]);
if (!auditRun.passed) {
  console.error(auditRun.output);
  rmSync(temporaryOutput, { recursive: true, force: true });
  process.exit(auditRun.exitCode);
}
const currentAuditPath = join(temporaryOutput, 'balance-v0.7-simulations.json');
const currentAudit = JSON.parse(readFileSync(currentAuditPath, 'utf8'));
const oldAudit = existsSync(historicalPath) ? JSON.parse(readFileSync(historicalPath, 'utf8')) : undefined;
const currentRows = flatten(currentAudit);
const economy = summarizeEconomy(currentRows);
const levels = summarizeLevels(currentRows);
const historicalReference = oldAudit ? {
  path: historicalPath,
  generatedAt: oldAudit.generatedAt,
  lastWriteTime: statSync(historicalPath).mtime.toISOString()
} : undefined;
const finishedAt = new Date();
const execution = {
  auditVersion: 'SOULS Balance Lab v0.7.1',
  startedAt: startedAt.toISOString(),
  finishedAt: finishedAt.toISOString(),
  durationMs: finishedAt.getTime() - startedAt.getTime(),
  command: 'npm run balance:audit-v071',
  rulesVersion: currentAudit.rulesVersion,
  catalogVersion: currentAudit.catalogVersion,
  gamesPerMatchup: currentAudit.confrontations[0]?.games ?? 0,
  seedSchedule: currentAudit.confrontations.map((confrontation) => confrontation.matchup.seed),
  validation: verification.map((result) => ({
    command: result.command,
    passed: result.passed,
    tests: result.tests,
    exitCode: result.exitCode,
    ...(result.error === undefined ? {} : { error: result.error })
  })),
  historicalV06Reference: historicalReference
};
const effectiveAudit = {
  ...currentAudit,
  validation: {
    ...currentAudit.validation,
    deterministicTests: execution.validation.map((result) => ({ command: result.command, passed: result.passed, tests: result.tests }))
  }
};
const report = {
  schemaVersion: 'SOULS Balance Lab v0.7.1',
  execution,
  totalGames: effectiveAudit.totalGames,
  currentAudit: effectiveAudit,
  comparison: comparison(effectiveAudit, oldAudit, historicalReference, currentRows),
  economy: { byStrategy: economy.byStrategy, overall: economy.overall, levels },
  exhaustion: economy.overall,
  experiments: [
    { id: 'official-v07-replay', status: 'executed', games: effectiveAudit.totalGames, explanation: 'Auditoria oficial v0.7 com dez confrontos e quatro células equilibradas.' },
    { id: 'historical-v06-matched-reference', status: oldAudit ? 'matched-historical-reference' : 'not-executed', games: oldAudit?.totalGames ?? 0, explanation: oldAudit ? 'Referência histórica emparelhada; não reexecutada nesta sessão.' : 'Não existe referência v0.6 verificável.' },
    { id: 'isolated-economy-vs-attributes', status: 'not-executed', games: 0, explanation: 'Sem motor v0.6 configurável; executar exigiria duplicação/parametrização das regras oficiais.' },
    { id: 'deck-size-and-draw-frequency', status: 'not-executed', games: 0, explanation: 'Tamanho de baralho e frequência de compra são oficiais e fixos; não foram alterados.' }
  ]
};
for (const path of writeReports(report)) console.log(path);
console.log(`Balance Lab v0.7.1: ${report.totalGames} partidas, ${effectiveAudit.validation.completedGames} concluídas.`);
console.log(`Testes capturados: ${verification.find((item) => item.command.includes('test:ci'))?.tests ?? 0}.`);
rmSync(temporaryOutput, { recursive: true, force: true });
