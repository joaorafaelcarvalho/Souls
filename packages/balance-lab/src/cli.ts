import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { analyzeCatalog } from './catalogAnalysis.js';
import { runBalanceAudit, writeAuditReports } from './audit.js';
import { loadNodeCardCatalog, loadNodeLoreCatalog } from './catalog.js';
import { createDeckFixture } from './decks.js';
import { catalogAnalysisMarkdown, writePairedReports, writeSimulationReports } from './reports.js';
import { runPairedSimulation, runSimulation } from './simulation.js';
import type { AgentStrategy, DeckProfile, LabRunMode, SimulationConfig } from './types.js';

function argument(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function numberArgument(name: string, fallback: number): number {
  const value = Number(argument(name));
  return Number.isFinite(value) ? value : fallback;
}

function modeConfig(mode: LabRunMode): number {
  return mode === 'smoke' ? 20 : mode === 'balance' ? 100 : 500;
}

function strategyArgument(name: string, fallback: AgentStrategy): AgentStrategy {
  const value = argument(name);
  const strategies: readonly AgentStrategy[] = ['random-legal', 'balanced', 'aggressive', 'defensive', 'low-cost', 'high-cost', 'combined-attack'];
  return value !== undefined && strategies.includes(value as AgentStrategy) ? value as AgentStrategy : fallback;
}

function deckProfileArgument(name: string, fallback: DeckProfile): DeckProfile {
  const value = argument(name);
  const profiles: readonly DeckProfile[] = ['random-legal', 'balanced', 'aggressive', 'defensive', 'low-cost', 'high-cost', 'combined-attack', 'expensive-negative'];
  return value !== undefined && profiles.includes(value as DeckProfile) ? value as DeckProfile : fallback;
}

function eventGamesArgument(): readonly number[] | undefined {
  const value = argument('--event-games');
  if (value === undefined) return undefined;
  return value.split(',')
    .map((entry) => Number(entry.trim()))
    .filter((entry) => Number.isInteger(entry) && entry > 0);
}

const catalog = loadNodeCardCatalog();
if (process.argv.includes('--audit')) {
  const audit = runBalanceAudit(catalog.byId);
  const directory = resolve(process.cwd(), argument('--out') ?? 'reports/balance-lab/v1.1/audit-final');
  const paths = writeAuditReports(audit, directory);
  console.log(`Balance Lab audit: ${audit.totalGames} partidas, ${audit.validation.completedGames} concluídas.`);
  console.log(paths.join('\n'));
  process.exit(0);
}
if (process.argv.includes('--catalog')) {
  const analysis = analyzeCatalog(catalog, loadNodeLoreCatalog());
  const directory = resolve(process.cwd(), argument('--out') ?? 'reports/balance-lab');
  mkdirSync(directory, { recursive: true });
  const prefix = `catalog-${analysis.totalDefinitions}`;
  writeFileSync(join(directory, `${prefix}.json`), JSON.stringify(analysis, null, 2), 'utf8');
  writeFileSync(join(directory, `${prefix}.md`), catalogAnalysisMarkdown(analysis), 'utf8');
  console.log(`Catalog analysis: ${analysis.totalDefinitions} definitions.`);
  console.log(join(directory, `${prefix}.json`));
  console.log(join(directory, `${prefix}.md`));
  process.exit(0);
}
const mode = (argument('--mode') ?? 'smoke') as LabRunMode;
const playerOneStrategy = strategyArgument('--strategy-a', 'balanced');
const playerTwoStrategy = strategyArgument('--strategy-b', 'aggressive');
const playerOneDeckProfile = deckProfileArgument('--deck-a', playerOneStrategy);
const playerTwoDeckProfile = deckProfileArgument('--deck-b', playerTwoStrategy);
const selectedEventGames = eventGamesArgument();
const config: SimulationConfig = {
  games: Math.max(1, numberArgument('--games', modeConfig(mode))),
  seed: numberArgument('--seed', 20261113),
  maxRounds: Math.max(1, numberArgument('--max-rounds', 200)),
  maxActions: Math.max(10, numberArgument('--max-actions', 2_000)),
  playerOneStrategy,
  playerTwoStrategy,
  playerOneDeck: createDeckFixture(catalog, playerOneStrategy, playerOneDeckProfile),
  playerTwoDeck: createDeckFixture(catalog, playerTwoStrategy, playerTwoDeckProfile),
  rulesVersion: 'SOULS v0.7',
  catalogVersion: `local-${catalog.definitions.length}-definitions`,
  includeEvents: process.argv.includes('--events'),
  ...(selectedEventGames === undefined ? {} : { eventGames: selectedEventGames })
};

const paired = process.argv.includes('--swap') ? runPairedSimulation(config, catalog.byId) : undefined;
const output = paired?.baseline ?? runSimulation(config, catalog.byId);
const outputDirectory = resolve(process.cwd(), argument('--out') ?? 'reports/balance-lab');
const prefix = `balance-${mode}-${config.seed}`;
const paths = writeSimulationReports(output, outputDirectory, prefix);

console.log(`Balance Lab: ${output.aggregate.completedGames}/${output.aggregate.games} partidas concluídas.`);
console.log(`Vitórias J1/J2: ${output.aggregate.winsByPlayer[1]}/${output.aggregate.winsByPlayer[2]}.`);
console.log(`Cobertura determinística de níveis 0–4: ${output.invocationCoverage.allLevelsCovered ? 'OK' : 'INCOMPLETA'}.`);
console.log(paths.join('\n'));

if (paired !== undefined) {
  const swappedPaths = writeSimulationReports(paired.swapped, outputDirectory, `${prefix}-swapped`);
  const comparisonPaths = writePairedReports(paired, outputDirectory, `${prefix}-paired`);
  console.log('Matriz trocada:');
  console.log(swappedPaths.join('\n'));
  console.log('Comparação emparelhada:');
  console.log(comparisonPaths.join('\n'));
}
