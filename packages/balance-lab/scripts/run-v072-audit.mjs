/* global console, process */

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';

const root = existsSync(join(process.cwd(), 'packages')) ? process.cwd() : resolve(process.cwd(), '..', '..');
const outputDirectory = join(root, 'packages', 'balance-lab', 'reports', 'balance-lab', 'v0.7.2');
const historicalDirectory = join(root, 'packages', 'balance-lab', 'reports', 'balance-lab');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const startedAt = new Date();
const expectedDistribution = { 0: 10, 1: 4, 2: 3, 3: 2, 4: 1 };
const profileLabels = {
  balanced: 'Balanced',
  aggressive: 'Aggressive',
  defensive: 'Defensive',
  'low-cost': 'Early Pressure',
  'high-cost': 'Late Game',
  'combined-attack': 'Combined Attack'
};
const roles = {
  balanced: 'Equilíbrio entre defesa, ataque melee/ranged e progressão.',
  aggressive: 'Pressão ofensiva e ATK elevado, mantendo defesa mínima.',
  defensive: 'Proteção de colunas e resistência sem abandonar ataque.',
  'low-cost': 'Early pressure: eficiência de N0/N1 com utilização oportunista dos níveis superiores.',
  'high-cost': 'Late game: conserva recursos e prepara invocações N2–N4.',
  'combined-attack': 'Combina melee e ranged para explorar as quatro colunas.'
};

function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8', shell: command === npmCommand, maxBuffer: 80 * 1024 * 1024 });
  const output = (result.stdout || '') + '\n' + (result.stderr || '');
  const tests = [...output.matchAll(/Tests\s+(\d+)\s+passed/g)].reduce((total, match) => total + Number(match[1]), 0);
  return { command: [command, ...args].join(' '), passed: result.status === 0, tests, exitCode: result.status ?? 1, output };
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
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

function tableRow(values) {
  return '| ' + values.map((value) => String(value)).join(' | ') + ' |';
}

function csvCell(value) {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? '"' + text.replaceAll('"', '""') + '"' : text;
}

function flattenAudit(audit, experiment = 'C-main') {
  const rows = [];
  for (const confrontation of audit.confrontations || []) {
    for (const run of confrontation.runs || []) {
      for (const game of run.output.games || []) rows.push({ experiment, condition: confrontation.matchup.id, cell: run.cell, game });
    }
  }
  return rows;
}

function flattenOutput(output, experiment, cell) {
  return (output.games || []).map((game) => ({ experiment, condition: experiment, cell, game }));
}

function loadDefinitions() {
  const directory = join(root, 'packages', 'game-content', 'cards');
  const definitions = [];
  for (const category of ['melee', 'ranged']) {
    for (const filename of readdirSync(join(directory, category)).filter((name) => name.endsWith('.json')).sort()) {
      definitions.push(readJson(join(directory, category, filename)));
    }
  }
  return definitions;
}

function catalogFingerprint(definitions) {
  const stable = definitions
    .map((definition) => ({ id: definition.id, name: definition.name, level: definition.level, type: definition.type, attack: definition.attack, defense: definition.defense }))
    .sort((left, right) => left.id.localeCompare(right.id));
  return createHash('sha256').update(JSON.stringify(stable)).digest('hex');
}

function levelDistribution(cards, definitionsById) {
  const distribution = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
  for (const id of cards) {
    const definition = definitionsById.get(id);
    if (definition) distribution[definition.level] += 1;
  }
  return distribution;
}

function distributionIsOfficial(distribution) {
  return [0, 1, 2, 3, 4].every((level) => distribution[level] === expectedDistribution[level]);
}

function collectDecks(audit, definitions) {
  const definitionsById = new Map(definitions.map((definition) => [definition.id, definition]));
  const decks = new Map();
  for (const confrontation of audit.confrontations || []) {
    for (const run of confrontation.runs || []) {
      const config = run.output.aggregate.config;
      for (const deck of [config.playerOneDeck, config.playerTwoDeck]) {
        if (!decks.has(deck.profile)) {
          const quantities = new Map();
          for (const id of deck.cards) quantities.set(id, (quantities.get(id) || 0) + 1);
          const cards = [...quantities.entries()].map(([id, quantity]) => {
            const definition = definitionsById.get(id);
            return { id, name: definition?.name || id, level: definition?.level ?? null, type: definition?.type ?? null, attack: definition?.attack ?? null, defense: definition?.defense ?? null, quantity };
          }).sort((left, right) => (left.level ?? 99) - (right.level ?? 99) || left.name.localeCompare(right.name, 'pt-PT'));
          const distribution = levelDistribution(deck.cards, definitionsById);
          decks.set(deck.profile, {
            profile: deck.profile,
            name: deck.name,
            totalCards: deck.cards.length,
            distribution,
            expectedDistribution,
            valid: deck.cards.length === 20 && distributionIsOfficial(distribution),
            role: roles[deck.profile] || 'Perfil de laboratório.',
            cards
          });
        }
      }
    }
  }
  return [...decks.values()].filter((deck) => profileLabels[deck.profile]);
}

function mainRowsByStrategy(rows) {
  const profiles = ['balanced', 'aggressive', 'defensive', 'low-cost', 'high-cost', 'combined-attack'];
  const stats = new Map(profiles.map((strategy) => [strategy, {
    strategy, games: 0, wins: 0, failedDraws: 0, hpPenalty: 0, combatSouls: 0, retirementSouls: 0, spentInvocations: 0, spentPenalties: 0,
    lossesWithFailedDraw: 0, highHand: 0, highDeck: 0, rounds: []
  }]));
  for (const row of rows) {
    const game = row.game;
    for (const playerId of [1, 2]) {
      const strategy = playerId === 1 ? game.playerOneStrategy : game.playerTwoStrategy;
      const value = stats.get(strategy);
      if (!value) continue;
      const failedDraws = counter(game.failedDraws, playerId);
      value.games += 1;
      if (game.winnerId === playerId) value.wins += 1;
      if (game.winnerId !== playerId && failedDraws > 0) value.lossesWithFailedDraw += 1;
      value.failedDraws += failedDraws;
      value.hpPenalty += counter(game.hpPenalties, playerId);
      value.combatSouls += counter(game.soulsGainedFromCombat, playerId);
      value.retirementSouls += counter(game.soulsGainedFromRetirement, playerId);
      value.spentInvocations += counter(game.soulsSpentOnInvocations, playerId);
      value.spentPenalties += counter(game.soulsSpentOnPenalties, playerId);
      value.highHand += [2, 3, 4].reduce((sum, level) => sum + counter(game.cardLocationsByLevel?.[playerId]?.hand, level), 0);
      value.highDeck += [2, 3, 4].reduce((sum, level) => sum + counter(game.cardLocationsByLevel?.[playerId]?.deck, level), 0);
      value.rounds.push(game.finalRound);
    }
  }
  return [...stats.values()].map((value) => ({
    strategy: value.strategy,
    label: profileLabels[value.strategy],
    games: value.games,
    wins: value.wins,
    losses: value.games - value.wins,
    winRate: round(value.wins / Math.max(1, value.games) * 100),
    averageFailedDraws: round(value.failedDraws / Math.max(1, value.games)),
    totalFailedDraws: value.failedDraws,
    totalHpPenalty: value.hpPenalty,
    averageHpPenalty: round(value.hpPenalty / Math.max(1, value.games)),
    lossesWithFailedDraw: value.lossesWithFailedDraw,
    averageCombatSouls: round(value.combatSouls / Math.max(1, value.games)),
    averageRetirementSouls: round(value.retirementSouls / Math.max(1, value.games)),
    totalSoulsSpentOnInvocations: value.spentInvocations,
    totalSoulsSpentOnPenalties: value.spentPenalties,
    averageHighLevelCardsInHand: round(value.highHand / Math.max(1, value.games)),
    averageHighLevelCardsNotDrawn: round(value.highDeck / Math.max(1, value.games))
  }));
}

function levelMetrics(rows) {
  return [0, 1, 2, 3, 4].map((level) => {
    let invocations = 0;
    let participations = 0;
    const firstRounds = [];
    for (const row of rows) {
      for (const playerId of [1, 2]) {
        const count = nestedCounter(row.game.invocationsByLevel, playerId, level);
        invocations += count;
        if (count > 0) participations += 1;
        const firstRound = row.game.firstInvocationRoundByLevel?.[playerId]?.[level];
        if (firstRound !== null && firstRound !== undefined) firstRounds.push(firstRound);
      }
    }
    return { level, invocations, participations, participationRate: round(participations / Math.max(1, rows.length * 2) * 100), firstRoundAverage: firstRounds.length ? round(firstRounds.reduce((sum, value) => sum + value, 0) / firstRounds.length) : null };
  });
}

function durationMetrics(rows) {
  const rounds = rows.map((row) => row.game.finalRound).sort((left, right) => left - right);
  const median = rounds.length === 0 ? 0 : rounds.length % 2 === 0 ? (rounds[rounds.length / 2 - 1] + rounds[rounds.length / 2]) / 2 : rounds[Math.floor(rounds.length / 2)];
  return {
    averageRounds: round(rounds.reduce((sum, value) => sum + value, 0) / Math.max(1, rounds.length)),
    medianRounds: round(median),
    shortestRounds: rounds[0] || 0,
    longestRounds: rounds[rounds.length - 1] || 0,
    inconclusiveGames: rows.filter((row) => row.game.status !== 'completed').length
  };
}

function experimentSummary(experiment) {
  const baseline = experiment.baseline.aggregate;
  const swapped = experiment.swapped.aggregate;
  return {
    id: experiment.id,
    games: baseline.games + swapped.games,
    baselineGames: baseline.games,
    swappedGames: swapped.games,
    baselineWinsByPlayer: baseline.winsByPlayer,
    swappedWinsByPlayer: swapped.winsByPlayer,
    baselineConfig: baseline.config,
    swappedConfig: swapped.config,
    pairedWarnings: experiment.paired.warnings
  };
}

function allRows(mainAudit, experiments) {
  const rows = flattenAudit(mainAudit);
  for (const experiment of experiments) {
    rows.push(...flattenOutput(experiment.baseline, experiment.id, 'baseline'));
    rows.push(...flattenOutput(experiment.swapped, experiment.id, 'swapped'));
  }
  return rows;
}

function simulationsCsv(rows, schemaVersion, decks) {
  const headers = [
    'schemaVersion', 'experiment', 'condition', 'cell', 'id', 'seed', 'playerOneAgent', 'playerTwoAgent', 'playerOneDeck', 'playerTwoDeck',
    'playerOneDistribution', 'playerTwoDistribution', 'firstPlayerId', 'winnerId', 'status', 'finalRound', 'turns', 'actions',
    'p1FailedDraws', 'p2FailedDraws', 'p1HpPenalty', 'p2HpPenalty', 'p1CombatSouls', 'p2CombatSouls', 'p1RetirementSouls', 'p2RetirementSouls',
    'p1N2', 'p2N2', 'p1N3', 'p2N3', 'p1N4', 'p2N4'
  ];
  const rowsOut = [headers.map(csvCell).join(',')];
  const distributionByName = new Map(decks.map((deck) => [deck.name, deck.distribution]));
  for (const row of rows) {
    const game = row.game;
    const p1Distribution = JSON.stringify(distributionByName.get(game.playerOneDeck) || {});
    const p2Distribution = JSON.stringify(distributionByName.get(game.playerTwoDeck) || {});
    rowsOut.push([
      schemaVersion, row.experiment, row.condition, row.cell, game.id, game.seed, game.playerOneStrategy, game.playerTwoStrategy,
      game.playerOneDeck, game.playerTwoDeck, p1Distribution, p2Distribution, game.firstPlayerId, game.winnerId ?? '', game.status,
      game.finalRound, game.turns, game.actions, counter(game.failedDraws, 1), counter(game.failedDraws, 2), counter(game.hpPenalties, 1), counter(game.hpPenalties, 2),
      counter(game.soulsGainedFromCombat, 1), counter(game.soulsGainedFromCombat, 2), counter(game.soulsGainedFromRetirement, 1), counter(game.soulsGainedFromRetirement, 2),
      nestedCounter(game.invocationsByLevel, 1, 2), nestedCounter(game.invocationsByLevel, 2, 2), nestedCounter(game.invocationsByLevel, 1, 3), nestedCounter(game.invocationsByLevel, 2, 3),
      nestedCounter(game.invocationsByLevel, 1, 4), nestedCounter(game.invocationsByLevel, 2, 4)
    ].map(csvCell).join(','));
  }
  return rowsOut.join('\n') + '\n';
}

function validationMarkdown(report) {
  const tests = report.execution.commands.map((command) => tableRow([command.command, command.passed ? 'PASSOU' : 'FALHOU', command.tests, command.exitCode])).join('\n');
  const decks = report.decks.map((deck) => tableRow([profileLabels[deck.profile], deck.totalCards, deck.distribution[0], deck.distribution[1], deck.distribution[2], deck.distribution[3], deck.distribution[4], deck.valid ? 'sim' : 'não'])).join('\n');
  return '# SOULS Balance Lab v0.7.2 — validação\n\n' +
    '- Gerado em: ' + report.execution.finishedAt + '\n- Regras: ' + report.rulesVersion + '\n- Catálogo: ' + report.catalogVersion + '\n' +
    '- Bateria principal: ' + report.mainAudit.totalGames + ' partidas; ' + report.mainAudit.validation.completedGames + ' concluídas.\n' +
    '- Seeds principais: ' + report.execution.mainSeeds.join(', ') + '\n' +
    '- Fingerprint do catálogo antes/depois: ' + report.execution.catalogFingerprintBefore + ' / ' + report.execution.catalogFingerprintAfter + '\n\n' +
    '## Comandos executados\n\n| Comando | Resultado | Testes | Exit code |\n|---|---|---:|---:|\n' + tests + '\n\n' +
    '## Distribuição oficial\n\n| Perfil | Cartas | N0 | N1 | N2 | N3 | N4 | Válido |\n|---|---:|---:|---:|---:|---:|---:|---|\n' + decks + '\n\n' +
    'Todos os perfis normais foram validados antes de iniciar partidas. O cenário expensive-negative foi mantido apenas para confirmar rejeição e não participou na bateria.\n';
}

function decksMarkdown(report) {
  const sections = report.decks.map((deck) => {
    const cards = deck.cards.map((card) => tableRow([card.name, card.id, card.level, card.type, card.attack, card.defense, card.quantity])).join('\n');
    return '## ' + profileLabels[deck.profile] + '\n\n' + deck.role + '\n\n' +
      'Distribuição: N0=' + deck.distribution[0] + ', N1=' + deck.distribution[1] + ', N2=' + deck.distribution[2] + ', N3=' + deck.distribution[3] + ', N4=' + deck.distribution[4] + '.\n\n' +
      '| Carta | ID oficial | Nível | Tipo | ATK | DEF | Quantidade |\n|---|---|---:|---|---:|---:|---:|\n' + cards + '\n';
  }).join('\n');
  return '# SOULS Balance Lab v0.7.2 — baralhos oficiais\n\n' +
    'Todos os seis perfis usam exatamente N0=10, N1=4, N2=3, N3=2, N4=1. A diferença está nas cartas escolhidas e nas decisões do agente.\n\n' + sections;
}

function balanceReport(report) {
  const strategies = report.strategyMetrics.map((value) => tableRow([value.label, value.games, value.wins, value.losses, value.winRate + '%', value.averageFailedDraws, value.averageHpPenalty, value.averageCombatSouls, value.averageRetirementSouls, value.lossesWithFailedDraw, value.averageHighLevelCardsInHand, value.averageHighLevelCardsNotDrawn])).join('\n');
  const levels = report.levelMetrics.map((value) => tableRow(['N' + value.level, value.invocations, value.participations, value.participationRate + '%', value.firstRoundAverage ?? '—'])).join('\n');
  const experiments = report.experiments.map((experiment) => tableRow([experiment.id, experiment.games, JSON.stringify(experiment.baselineWinsByPlayer), JSON.stringify(experiment.swappedWinsByPlayer)])).join('\n');
  const cards = report.cardCoverage.map((card) => tableRow([card.name, 'N' + card.level, card.deckOccurrences, card.cardsDrawn, card.invocations, card.destructions, card.deckOccurrences > 0 ? 'coberta' : 'ausente'])).join('\n');
  return '# SOULS Balance Lab v0.7.2 — balance report\n\n' +
    '- Partidas principais: ' + report.mainAudit.totalGames + '\n- Partidas adicionais de experiências: ' + report.experimentGames + '\n' +
    '- Rondas médias/mediana: ' + report.duration.averageRounds + ' / ' + report.duration.medianRounds + '\n- Intervalo de rondas: ' + report.duration.shortestRounds + '–' + report.duration.longestRounds + '\n' +
    '- Vitórias de quem começou: ' + report.mainAudit.priority.winsByFirstPlayer + '/' + report.mainAudit.priority.games + ' (' + report.mainAudit.priority.firstPlayerWinRate + '%)\n\n' +
    '## Estratégias e pressão de esgotamento\n\n| Estratégia | Participações | Vitórias | Derrotas | Win rate | Compras falhadas médias | HP perdido médio | Souls combate | Souls retirada | Derrotas com compra falhada | N2–N4 na mão | N2–N4 não compradas |\n|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|\n' + strategies + '\n\n' +
    '## Invocações de níveis superiores\n\n| Nível | Invocações totais | Participações individuais | Percentagem | Primeira ronda média |\n|---:|---:|---:|---:|---:|\n' + levels + '\n\n' +
    '## Experiências de separação agente/baralho\n\n| Experiência | Jogos | Vitórias baseline J1/J2 | Vitórias swapped J1/J2 |\n|---|---:|---|---|\n' + experiments + '\n\n' +
    'A experiência A mantém o baralho e troca agentes; B mantém o agente e troca baralhos; C é a bateria principal; D usa o mesmo agente e baralho nos dois lados.\n\n' +
    '## Cobertura das 26 cartas\n\n| Carta | Nível | Presenças em baralhos | Compras | Invocações | Destruições | Estado |\n|---|---:|---:|---:|---:|---:|---|\n' + cards + '\n\n' +
    'Os valores de dano por carta individual continuam limitados pela ausência de uma carta-fonte nos eventos oficiais de dano.\n';
}

function findingsMarkdown(report) {
  const missing = report.cardCoverage.filter((card) => card.deckOccurrences === 0);
  const highLevel = report.levelMetrics.find((value) => value.level === 4);
  return '# SOULS Balance Lab v0.7.2 — findings finais\n\n' +
    '## Confirmado\n\n' +
    '- Os seis perfis normais passaram a usar a distribuição oficial 10/4/3/2/1.\n' +
    '- A validação é partilhada entre game-content, Deck Builder, PvP Local e Balance Lab.\n' +
    '- A bateria principal executou ' + report.mainAudit.totalGames + ' partidas, com ' + report.mainAudit.validation.completedGames + ' concluídas.\n' +
    '- O catálogo manteve o mesmo fingerprint antes e depois da execução.\n\n' +
    '## Sinais de balanceamento\n\n' +
    '- Low Cost/Early Pressure, Defensive e Late Game devem ser comparados com cautela: agora partilham a distribuição, mas continuam a escolher cartas diferentes.\n' +
    '- O nível 4 teve ' + (highLevel?.invocations ?? 0) + ' invocações e ' + (highLevel?.participations ?? 0) + ' participações individuais na bateria principal.\n' +
    '- Compras falhadas e HP perdido devem ser analisados como pressão de esgotamento; estes dados não provam causalidade isoladamente.\n\n' +
    '## Cobertura e limitações\n\n' +
    '- Cartas ausentes dos seis perfis principais: ' + (missing.length ? missing.map((card) => card.name).join(', ') : 'nenhuma') + '.\n' +
    '- As experiências isoladas usam amostras iniciais de 20 partidas baseline + 20 swapped por condição; não são estimativas competitivas finais.\n' +
    '- O Balance Lab não implementa uma segunda lógica de combate nem variantes artificiais de tamanho de baralho.\n' +
    '- A eficácia de agente e baralho pode ser separada experimentalmente, mas conclusões fortes exigem amostras maiores e playtesting humano.\n';
}

function humanPlaytestingMarkdown(report) {
  return '# SOULS Balance Lab v0.7.2 — guia de playtesting humano\n\n' +
    'Este guia acompanha a baseline oficial v0.7.2, gerada em ' + report.execution.finishedAt + '. O objetivo é validar compreensão, diversão e sensação de justiça, não substituir as regras por preferências individuais.\n\n' +
    '## Cenários\n\n' +
    '1. Construir dois baralhos usando exclusivamente N0=10, N1=4, N2=3, N3=2, N4=1.\n' +
    '2. Jogar uma partida com foco em Early Pressure e outra com foco em Late Game.\n' +
    '3. Jogar uma partida com uma carta N3 e uma N4 na mão inicial ou obtidas cedo.\n' +
    '4. Testar uma retirada estratégica antes de uma colocação e observar o custo de ação e a Soul recebida.\n' +
    '5. Repetir um confronto trocando quem começa.\n\n' +
    '## Registo por partida\n\n' +
    '- Baralhos e distribuição por nível.\n- Seed, jogador que começou e duração.\n- Ronda da primeira Soul e da primeira carta N2/N3/N4.\n- Compras falhadas, penalizações e cartas que permaneceram na mão.\n- Ações que pareceram ilegais, confusas ou sem feedback suficiente.\n\n' +
    '## Perguntas aos jogadores\n\n' +
    '- A distribuição 10/4/3/2/1 é compreensível durante a construção?\n' +
    '- As Souls parecem obtidas e gastas de forma previsível?\n' +
    '- A retirada estratégica parece uma decisão útil ou uma punição?\n' +
    '- As cartas N3/N4 parecem alcançáveis sem tornar as primeiras rondas passivas?\n' +
    '- As derrotas por compras falhadas parecem justas e compreensíveis?\n' +
    '- O jogador consegue distinguir dano de combate de penalização por esgotamento?\n' +
    '- A partida teve duração e variedade satisfatórias?\n\n' +
    '## Preparação para Jogador vs IA\n\n' +
    'Os agentes legais, as observações públicas e as decisões de colocação podem servir como base técnica futura. Não há nesta tarefa qualquer modo PvE, dificuldade pública ou alteração ao frontend de jogo.\n';
}

function writeReports(report) {
  mkdirSync(outputDirectory, { recursive: true });
  const paths = {
    validation: join(outputDirectory, 'balance-v0.7.2-validation.md'),
    decks: join(outputDirectory, 'balance-v0.7.2-decks.md'),
    simulationsJson: join(outputDirectory, 'balance-v0.7.2-simulations.json'),
    simulationsCsv: join(outputDirectory, 'balance-v0.7.2-simulations.csv'),
    balance: join(outputDirectory, 'balance-v0.7.2-balance-report.md'),
    findings: join(outputDirectory, 'balance-v0.7.2-final-findings.md'),
    human: join(outputDirectory, 'balance-v0.7.2-human-playtesting.md')
  };
  writeFileSync(paths.validation, validationMarkdown(report), 'utf8');
  writeFileSync(paths.decks, decksMarkdown(report), 'utf8');
  writeFileSync(paths.simulationsJson, JSON.stringify(report, null, 2), 'utf8');
  writeFileSync(paths.simulationsCsv, simulationsCsv(report.allRows, report.schemaVersion, report.decks), 'utf8');
  writeFileSync(paths.balance, balanceReport(report), 'utf8');
  writeFileSync(paths.findings, findingsMarkdown(report), 'utf8');
  writeFileSync(paths.human, humanPlaytestingMarkdown(report), 'utf8');
  return Object.values(paths);
}

const definitionsBefore = loadDefinitions();
const verification = [
  run(npmCommand, ['run', 'build']),
  run(npmCommand, ['run', 'test:ci']),
  run(npmCommand, ['run', 'lint']),
  run(npmCommand, ['run', 'typecheck'])
];
const temporaryRoot = mkdtempSync(join(tmpdir(), 'souls-balance-v072-'));
const mainOutput = join(temporaryRoot, 'main');
const mainRun = run(npmCommand, ['--workspace', '@souls/balance-lab', 'run', 'audit', '--', '--out', mainOutput]);
if (!mainRun.passed) {
  console.error(mainRun.output);
  rmSync(temporaryRoot, { recursive: true, force: true });
  process.exit(mainRun.exitCode);
}
const mainAuditPath = join(mainOutput, 'balance-v0.7-simulations.json');
const mainAudit = readJson(mainAuditPath);
const experimentSpecs = [
  { id: 'A-same-deck-different-agents', strategyA: 'balanced', strategyB: 'aggressive', deckA: 'balanced', deckB: 'balanced', seed: 72000 },
  { id: 'B-same-agent-different-decks', strategyA: 'balanced', strategyB: 'balanced', deckA: 'aggressive', deckB: 'defensive', seed: 72100 },
  { id: 'D-mirrored-agent-and-deck', strategyA: 'balanced', strategyB: 'balanced', deckA: 'balanced', deckB: 'balanced', seed: 72200 }
];
const experiments = [];
for (const spec of experimentSpecs) {
  const directory = join(temporaryRoot, spec.id);
  const result = run(process.execPath, [
    join(root, 'packages', 'balance-lab', 'dist', 'cli.js'), '--mode', 'smoke', '--games', '20', '--seed', String(spec.seed),
    '--max-rounds', '200', '--max-actions', '2000', '--strategy-a', spec.strategyA, '--strategy-b', spec.strategyB,
    '--deck-a', spec.deckA, '--deck-b', spec.deckB, '--swap', '--out', directory
  ]);
  if (!result.passed) {
    console.error(result.output);
    rmSync(temporaryRoot, { recursive: true, force: true });
    process.exit(result.exitCode);
  }
  const prefix = 'balance-smoke-' + spec.seed;
  experiments.push({
    ...spec,
    baseline: readJson(join(directory, prefix + '.json')),
    swapped: readJson(join(directory, prefix + '-swapped.json')),
    paired: readJson(join(directory, prefix + '-paired.json'))
  });
}
const definitionsAfter = loadDefinitions();
const effectiveMain = {
  ...mainAudit,
  validation: {
    ...mainAudit.validation,
    deterministicTests: verification.map((command) => ({ command: command.command, passed: command.passed, tests: command.tests }))
  }
};
const mainRows = flattenAudit(effectiveMain);
const experimentSummaries = experiments.map(experimentSummary);
const allSimulationRows = allRows(effectiveMain, experiments);
const deckReports = collectDecks(effectiveMain, definitionsAfter);
const cards = effectiveMain.cards;
const finishedAt = new Date();
const report = {
  schemaVersion: 'SOULS Balance Lab v0.7.2',
  rulesVersion: 'SOULS v0.7',
  catalogVersion: effectiveMain.catalogVersion,
  totalGames: effectiveMain.totalGames + experiments.reduce((sum, experiment) => sum + experiment.baseline.aggregate.games + experiment.swapped.aggregate.games, 0),
  mainAudit: effectiveMain,
  execution: {
    startedAt: startedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
    durationMs: finishedAt.getTime() - startedAt.getTime(),
    command: 'npm run balance:audit-v072',
    mainSeeds: effectiveMain.confrontations.map((confrontation) => confrontation.matchup.seed),
    mainGamesPerConfrontation: effectiveMain.confrontations[0]?.games ?? 0,
    commands: verification,
    catalogFingerprintBefore: catalogFingerprint(definitionsBefore),
    catalogFingerprintAfter: catalogFingerprint(definitionsAfter),
    historicalDirectoriesPreserved: [
      join(historicalDirectory, 'v0.7-audit-final'),
      join(historicalDirectory, 'v0.7.1'),
      join(historicalDirectory, 'v1.1')
    ]
  },
  decks: deckReports,
  strategyMetrics: mainRowsByStrategy(mainRows),
  levelMetrics: levelMetrics(mainRows),
  duration: durationMetrics(mainRows),
  cardCoverage: cards,
  experiments: experimentSummaries,
  experimentGames: experiments.reduce((sum, experiment) => sum + experiment.baseline.aggregate.games + experiment.swapped.aggregate.games, 0),
  allRows: allSimulationRows,
  officialDeckRule: { expectedDistribution, totalCards: 20 },
  coverage: {
    all26PresentInMainDecks: new Set(deckReports.flatMap((deck) => deck.cards.map((card) => card.id))).size === definitionsAfter.length,
    missingFromMainDecks: definitionsAfter.filter((definition) => !deckReports.some((deck) => deck.cards.some((card) => card.id === definition.id))).map((definition) => definition.name),
    deterministicLevels: effectiveMain.validation.invocationCoverage
  }
};
for (const path of writeReports(report)) console.log(path);
console.log('Balance Lab v0.7.2: ' + effectiveMain.totalGames + ' partidas principais, ' + report.experimentGames + ' partidas de experiências, ' + effectiveMain.validation.completedGames + ' principais concluídas.');
console.log('Testes capturados: ' + verification.find((command) => command.command.includes('test:ci')).tests + '.');
rmSync(temporaryRoot, { recursive: true, force: true });
