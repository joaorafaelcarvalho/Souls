import {
  finishPositioningPhase,
  initializeGame,
  placeCard,
  retireCard,
  resolveAttackPhase,
  resolveDrawPhase,
  type GameEvent,
  type GameState,
  type PlayerId
} from '@souls/game-core';
import { createAgent, createLabObservation, getHandPlacementDiagnostics, getLegalPlacements, getLegalRetirements } from './agents.js';
import { runInvocationCoverage } from './coverage.js';
import { analyzeDeckFixture, assertOfficialDeckFixtures } from './decks.js';
import { createDeterministicUuidGenerator, createSeededRandom, createSimulationRandom } from './random.js';
import type {
  AggregateReport,
  AggregateStrategyResult,
  CardLocationMetrics,
  CardLevel,
  DeckDistribution,
  InvocationDiagnostics,
  LevelCounter,
  PlayerCounter,
  PlayerLevelCounter,
  SimulationConfig,
  SimulationMetrics,
  SimulationOutput,
  PairedSimulationOutput
} from './types.js';
import type { CombatResolutionTrace } from '@souls/game-core';

function playerCounter(): PlayerCounter { return { 1: 0, 2: 0 }; }
function levelCounter(): LevelCounter { return { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 }; }
function playerLevelCounter(): PlayerLevelCounter { return { 1: levelCounter(), 2: levelCounter() }; }

function definitionCounter(definitions: GameState['cardDefinitions']): Record<string, number> {
  return Object.fromEntries(Object.keys(definitions).map((definitionId) => [definitionId, 0]));
}

function playerDefinitionCounter(definitions: GameState['cardDefinitions']): Record<PlayerId, Record<string, number>> {
  return { 1: definitionCounter(definitions), 2: definitionCounter(definitions) };
}

function levelCounterWithNull(): Record<CardLevel, number | null> {
  return { 0: null, 1: null, 2: null, 3: null, 4: null };
}

function diagnostics(): InvocationDiagnostics {
  return {
    insufficientSouls: levelCounter(),
    availableNotChosen: levelCounter(),
    noSpace: levelCounter(),
    placementLimit: levelCounter()
  };
}

function playerDiagnostics(): Record<PlayerId, InvocationDiagnostics> {
  return { 1: diagnostics(), 2: diagnostics() };
}

function locations(): CardLocationMetrics {
  return { hand: levelCounter(), deck: levelCounter(), discard: levelCounter() };
}

function playerLocations(): Record<PlayerId, CardLocationMetrics> {
  return { 1: locations(), 2: locations() };
}

function addLevelCounter(target: LevelCounter, source: LevelCounter): void {
  for (const level of [0, 1, 2, 3, 4] as const) target[level] += source[level];
}

function addDiagnostics(target: InvocationDiagnostics, source: InvocationDiagnostics): void {
  addLevelCounter(target.insufficientSouls, source.insufficientSouls);
  addLevelCounter(target.availableNotChosen, source.availableNotChosen);
  addLevelCounter(target.noSpace, source.noSpace);
  addLevelCounter(target.placementLimit, source.placementLimit);
}

function combatDamageSource(
  trace: CombatResolutionTrace,
  beforeState: GameState,
  columnIndex: number,
  targetPlayerId: PlayerId
): PlayerId | undefined {
  const column = trace.columns[columnIndex];
  if (column === undefined) return undefined;
  const attackerId = column.attackerIds[0];
  const attacker = attackerId === undefined ? undefined : beforeState.cardInstances[attackerId];
  const attackerOwner = attacker?.ownerId;
  if (attackerOwner === undefined) return undefined;

  const offensiveTargetId = column.result.exchanges.find((exchange) => exchange.kind === 'offense')?.targetId;
  if (offensiveTargetId === undefined) return attackerOwner;
  const target = beforeState.cardInstances[offensiveTargetId];
  if (target === undefined) return undefined;
  return targetPlayerId === attackerOwner ? target.ownerId : attackerOwner;
}

interface EventContext {
  readonly beforeState: GameState;
  readonly combatTrace?: CombatResolutionTrace;
}

function recordEvents(
  events: readonly GameEvent[],
  state: GameState,
  round: number,
  counters: {
    readonly soulsGained: PlayerCounter;
    readonly soulsGainedFromCombat: PlayerCounter;
    readonly soulsGainedFromRetirement: PlayerCounter;
    readonly soulsSpent: PlayerCounter;
    readonly soulsSpentOnInvocations: PlayerCounter;
    readonly soulsSpentOnPenalties: PlayerCounter;
    readonly firstSoulRound: Record<PlayerId, number | null>;
    readonly cardsDrawn: PlayerCounter;
    readonly cardsInvoked: PlayerCounter;
    readonly cardsDestroyed: PlayerCounter;
    readonly cardsRetired: PlayerCounter;
    readonly failedDraws: PlayerCounter;
    readonly cardsDrawnByDefinition: Record<PlayerId, Record<string, number>>;
    readonly cardsInvokedByDefinition: Record<PlayerId, Record<string, number>>;
    readonly cardsDestroyedByDefinition: Record<PlayerId, Record<string, number>>;
    readonly damageDealt: PlayerCounter;
    readonly damageReceived: PlayerCounter;
    readonly combatDamageDealt: PlayerCounter;
    readonly combatDamageReceived: PlayerCounter;
    readonly hpPenalties: PlayerCounter;
    readonly excessDamage: PlayerCounter;
    readonly invocationsByLevel: PlayerLevelCounter;
    readonly firstInvocationRoundByLevel: Record<PlayerId, Record<0 | 1 | 2 | 3 | 4, number | null>>;
    readonly metricWarnings: string[];
    readonly turns: { value: number };
  },
  context: EventContext
): void {
  const classification = new Map<GameEvent, { readonly penalty: boolean; readonly sourcePlayerId: PlayerId | undefined }>();
  for (const [columnIndex, column] of (context.combatTrace?.columns ?? []).entries()) {
    const sourcePlayerId = combatDamageSource(context.combatTrace!, context.beforeState, columnIndex, column.result.hpDamageTarget ?? 1);
    for (const event of column.events) {
      if (event.type !== 'damage-dealt') continue;
      classification.set(event, { penalty: false, sourcePlayerId });
    }

    const actualDamage = column.events
      .filter((event) => event.type === 'damage-dealt' && event.reason === 'combat')
      .filter((event) => !classification.get(event)?.penalty)
      .reduce((sum, event) => sum + (event.type === 'damage-dealt' ? event.amount : 0), 0);
    if (actualDamage !== column.result.hpDamage) {
      counters.metricWarnings.push(`A coluna ${column.column} reportou ${column.result.hpDamage} dano de combate no trace, mas os eventos somam ${actualDamage}.`);
    }
  }

  const hpBefore: PlayerCounter = {
    1: context.beforeState.players[1].hp,
    2: context.beforeState.players[2].hp
  };
  for (const event of events) {
    switch (event.type) {
      case 'souls-gained':
        counters.soulsGained[event.playerId] += event.amount;
        if (event.reason === 'combat') counters.soulsGainedFromCombat[event.playerId] += event.amount;
        if (event.reason === 'retirement') counters.soulsGainedFromRetirement[event.playerId] += event.amount;
        if (counters.firstSoulRound[event.playerId] === null) counters.firstSoulRound[event.playerId] = round;
        break;
      case 'souls-spent':
        counters.soulsSpent[event.playerId] += event.amount;
        if (event.reason === 'invocation') counters.soulsSpentOnInvocations[event.playerId] += event.amount;
        else counters.soulsSpentOnPenalties[event.playerId] += event.amount;
        break;
      case 'card-drawn': {
        counters.cardsDrawn[event.playerId] += 1;
        const instance = state.cardInstances[event.instanceId];
        if (instance !== undefined) {
          const definitionCounts = counters.cardsDrawnByDefinition[event.playerId];
          if (definitionCounts !== undefined) definitionCounts[instance.cardDefinitionId] = (definitionCounts[instance.cardDefinitionId] ?? 0) + 1;
        }
        break;
      }
      case 'card-retired': counters.cardsRetired[event.playerId] += 1; break;
      case 'draw-failed': counters.failedDraws[event.playerId] += 1; break;
      case 'damage-dealt': {
        const excess = Math.max(0, event.amount - hpBefore[event.targetPlayerId]);
        counters.excessDamage[event.targetPlayerId] += excess;
        hpBefore[event.targetPlayerId] = Math.max(0, hpBefore[event.targetPlayerId] - event.amount);
        const combat = event.reason === 'combat' ? classification.get(event) : undefined;
        if (event.reason === 'failed-draw' || combat?.penalty === true) {
          counters.hpPenalties[event.targetPlayerId] += event.amount;
          break;
        }
        counters.damageReceived[event.targetPlayerId] += event.amount;
        counters.combatDamageReceived[event.targetPlayerId] += event.amount;
        if (combat?.sourcePlayerId === undefined) {
          counters.metricWarnings.push(`Não foi possível determinar o jogador que causou ${event.amount} dano a J${event.targetPlayerId}.`);
          break;
        }
        counters.damageDealt[combat.sourcePlayerId] += event.amount;
        counters.combatDamageDealt[combat.sourcePlayerId] += event.amount;
        break;
      }
      case 'turn-started': counters.turns.value += 1; break;
      case 'card-destroyed': {
        counters.cardsDestroyed[event.ownerId] += 1;
        const instance = state.cardInstances[event.instanceId];
        if (instance !== undefined) {
          const definitionCounts = counters.cardsDestroyedByDefinition[event.ownerId];
          if (definitionCounts !== undefined) definitionCounts[instance.cardDefinitionId] = (definitionCounts[instance.cardDefinitionId] ?? 0) + 1;
        }
        break;
      }
      case 'card-invoked': {
        counters.cardsInvoked[event.playerId] += 1;
        const instance = state.cardInstances[event.instanceId];
        const definition = instance === undefined ? undefined : state.cardDefinitions[instance.cardDefinitionId];
        if (definition === undefined) break;
        const level = definition.level;
        counters.invocationsByLevel[event.playerId][level] += 1;
        const definitionCounts = counters.cardsInvokedByDefinition[event.playerId];
        if (definitionCounts !== undefined) definitionCounts[definition.id] = (definitionCounts[definition.id] ?? 0) + 1;
        if (counters.firstInvocationRoundByLevel[event.playerId][level] === null) {
          counters.firstInvocationRoundByLevel[event.playerId][level] = round;
        }
        break;
      }
    }
  }
}

function recordFinalCardLocations(state: GameState, locationsByPlayer: Record<PlayerId, CardLocationMetrics>): void {
  for (const playerId of [1, 2] as const) {
    const locations = locationsByPlayer[playerId];
    for (const [location, instanceIds] of [
      ['hand', state.players[playerId].hand],
      ['deck', state.players[playerId].deck],
      ['discard', state.players[playerId].discard]
    ] as const) {
      for (const instanceId of instanceIds) {
        const instance = state.cardInstances[instanceId];
        const definition = instance === undefined ? undefined : state.cardDefinitions[instance.cardDefinitionId];
        if (definition !== undefined) locations[location][definition.level] += 1;
      }
    }
  }
}

function simulateState(config: SimulationConfig, seed: number, gameIndex: number, initial: GameState): SimulationMetrics {
  let state = initial;
  const agents = { 1: createAgent(config.playerOneStrategy), 2: createAgent(config.playerTwoStrategy) } as const;
  const counters = {
    soulsGained: playerCounter(), soulsGainedFromCombat: playerCounter(), soulsGainedFromRetirement: playerCounter(), soulsSpent: playerCounter(), soulsSpentOnInvocations: playerCounter(), soulsSpentOnPenalties: playerCounter(),
    firstSoulRound: { 1: null, 2: null }, cardsDrawn: playerCounter(), cardsInvoked: playerCounter(),
    cardsDestroyed: playerCounter(), cardsRetired: playerCounter(), failedDraws: playerCounter(), damageDealt: playerCounter(),
    damageReceived: playerCounter(), combatDamageDealt: playerCounter(), combatDamageReceived: playerCounter(),
    hpPenalties: playerCounter(), excessDamage: playerCounter(), invocationsByLevel: playerLevelCounter(),
    firstInvocationRoundByLevel: { 1: levelCounterWithNull(), 2: levelCounterWithNull() },
    cardsDrawnByDefinition: playerDefinitionCounter(initial.cardDefinitions),
    cardsInvokedByDefinition: playerDefinitionCounter(initial.cardDefinitions),
    cardsDestroyedByDefinition: playerDefinitionCounter(initial.cardDefinitions),
    invocationDiagnostics: playerDiagnostics(), cardLocationsByLevel: playerLocations(),
    metricWarnings: [] as string[], turns: { value: 0 }
  };
  const allEvents: GameEvent[] = [];
  let actions = 0;
  let status: SimulationMetrics['status'] = 'completed';
  let reason: SimulationMetrics['reason'] = 'game-ended';

  while (state.status === 'active') {
    if (state.turn.round > config.maxRounds) { status = 'inconclusive'; reason = 'round-limit'; break; }
    if (actions >= config.maxActions) { status = 'inconclusive'; reason = 'action-limit'; break; }

    const playerId = state.turn.activePlayerId;
    const agent = agents[playerId];

    if (state.turn.phase === 'first-round-positioning' || state.turn.phase === 'positioning') {
      if (state.turn.placementsMade === 0 && !state.turn.hasRetired) {
        const retirementOptions = getLegalRetirements(state, playerId);
        const retirement = agent.chooseRetirement(
          createLabObservation(state, playerId),
          retirementOptions,
          createSeededRandom(seed + actions + gameIndex + 10_000)
        );
        if (retirement !== null) {
          const beforeState = state;
          const result = retireCard(state, { playerId, instanceId: retirement.instanceId });
          state = result.state;
          actions += 1;
          allEvents.push(...result.events);
          recordEvents(result.events, state, state.turn.round, counters, { beforeState });
        }
      }

      for (let placement = 0; placement < 2; placement += 1) {
        const diagnosticByInstance = getHandPlacementDiagnostics(state, playerId);
        for (const diagnostic of diagnosticByInstance) {
          if (diagnostic.reason === 'insufficient-souls') counters.invocationDiagnostics[playerId].insufficientSouls[diagnostic.level] += 1;
          if (diagnostic.reason === 'no-space') counters.invocationDiagnostics[playerId].noSpace[diagnostic.level] += 1;
          if (diagnostic.reason === 'placement-limit') counters.invocationDiagnostics[playerId].placementLimit[diagnostic.level] += 1;
        }

        const options = getLegalPlacements(state, playerId);
        const availableByInstance = new Map(options.map((option) => [option.instanceId, option] as const));
        const choice = agent.choosePlacement(
          createLabObservation(state, playerId),
          options,
          createSeededRandom(seed + actions + placement + gameIndex)
        );
        if (choice === null) break;
        for (const [instanceId, option] of availableByInstance) {
          if (instanceId !== choice.instanceId) counters.invocationDiagnostics[playerId].availableNotChosen[option.definition.level] += 1;
        }
        const beforeState = state;
        const result = placeCard(state, { playerId, instanceId: choice.instanceId, row: choice.position.row, column: choice.position.column });
        state = result.state;
        actions += 1;
        allEvents.push(...result.events);
        recordEvents(result.events, state, state.turn.round, counters, { beforeState });
      }
      const beforeState = state;
      const result = finishPositioningPhase(state);
      state = result.state;
      actions += 1;
      allEvents.push(...result.events);
      recordEvents(result.events, state, state.turn.round, counters, { beforeState });
      continue;
    }

    if (state.turn.phase === 'draw') {
      const beforeState = state;
      const result = resolveDrawPhase(state);
      state = result.state;
      actions += 1;
      allEvents.push(...result.events);
      recordEvents(result.events, state, state.turn.round, counters, { beforeState });
      continue;
    }

    const beforeState = state;
    const result = resolveAttackPhase(state);
    state = result.state;
    actions += 1;
    allEvents.push(...result.events);
    const context = result.combatTrace === undefined ? { beforeState } : { beforeState, combatTrace: result.combatTrace };
    recordEvents(result.events, state, state.turn.round, counters, context);
  }

  recordFinalCardLocations(state, counters.cardLocationsByLevel);
  const includeEvents = config.includeEvents === true || config.eventGames?.includes(gameIndex + 1) === true;
  return {
    id: `simulation-${seed}-${gameIndex + 1}`,
    seed,
    playerOneStrategy: config.playerOneStrategy,
    playerTwoStrategy: config.playerTwoStrategy,
    playerOneDeck: config.playerOneDeck.name,
    playerTwoDeck: config.playerTwoDeck.name,
    status,
    ...(reason === undefined ? {} : { reason }),
    ...(state.winnerId === undefined ? {} : { winnerId: state.winnerId }),
    firstPlayerId: initial.turn.firstPlayerId,
    finalRound: state.turn.round,
    turns: counters.turns.value,
    actions,
    finalHp: { 1: state.players[1].hp, 2: state.players[2].hp },
    finalSouls: { 1: state.players[1].souls, 2: state.players[2].souls },
    soulsGained: counters.soulsGained,
    soulsGainedFromCombat: counters.soulsGainedFromCombat,
    soulsGainedFromRetirement: counters.soulsGainedFromRetirement,
    soulsSpent: counters.soulsSpent,
    soulsSpentOnInvocations: counters.soulsSpentOnInvocations,
    soulsSpentOnPenalties: counters.soulsSpentOnPenalties,
    firstSoulRound: counters.firstSoulRound,
    cardsDrawn: counters.cardsDrawn,
    cardsInvoked: counters.cardsInvoked,
    cardsDestroyed: counters.cardsDestroyed,
    cardsRetired: counters.cardsRetired,
    failedDraws: counters.failedDraws,
    cardsDrawnByDefinition: counters.cardsDrawnByDefinition,
    cardsInvokedByDefinition: counters.cardsInvokedByDefinition,
    cardsDestroyedByDefinition: counters.cardsDestroyedByDefinition,
    damageDealt: counters.damageDealt,
    damageReceived: counters.damageReceived,
    combatDamageDealt: counters.combatDamageDealt,
    combatDamageReceived: counters.combatDamageReceived,
    hpPenalties: counters.hpPenalties,
    excessDamage: counters.excessDamage,
    invocationsByLevel: counters.invocationsByLevel,
    firstInvocationRoundByLevel: counters.firstInvocationRoundByLevel,
    invocationDiagnostics: counters.invocationDiagnostics,
    cardLocationsByLevel: counters.cardLocationsByLevel,
    metricWarnings: counters.metricWarnings,
    ...(includeEvents ? { events: allEvents } : {})
  };
}

function average(values: readonly number[]): number {
  return values.length === 0 ? 0 : Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
}

function averageCounter(games: readonly SimulationMetrics[], selector: (game: SimulationMetrics, playerId: PlayerId) => number): PlayerCounter {
  return {
    1: average(games.map((game) => selector(game, 1))),
    2: average(games.map((game) => selector(game, 2)))
  };
}

function averageLevelCounter(games: readonly SimulationMetrics[], selector: (game: SimulationMetrics, playerId: PlayerId) => LevelCounter): PlayerLevelCounter {
  const result = playerLevelCounter();
  for (const playerId of [1, 2] as const) {
    for (const level of [0, 1, 2, 3, 4] as const) {
      result[playerId][level] = average(games.map((game) => selector(game, playerId)[level]));
    }
  }
  return result;
}

function sumLevelCounters(games: readonly SimulationMetrics[], playerId: PlayerId): LevelCounter {
  const result = levelCounter();
  for (const game of games) addLevelCounter(result, game.invocationsByLevel[playerId]);
  return result;
}

function firstInvocationRounds(games: readonly SimulationMetrics[]): Readonly<Record<PlayerId, Readonly<Record<CardLevel, number | null>>>> {
  const result = { 1: levelCounterWithNull(), 2: levelCounterWithNull() };
  for (const playerId of [1, 2] as const) {
    for (const level of [0, 1, 2, 3, 4] as const) {
      const values = games
        .map((game) => game.firstInvocationRoundByLevel[playerId][level])
        .filter((value): value is number => value !== null);
      result[playerId][level] = values.length === 0 ? null : Math.min(...values);
    }
  }
  return result;
}

function uniqueWarnings(warnings: readonly string[]): string[] {
  return [...new Set(warnings)];
}

function aggregate(
  config: SimulationConfig,
  games: readonly SimulationMetrics[],
  cardDefinitions: GameState['cardDefinitions'],
  invocationCoverage: ReturnType<typeof runInvocationCoverage>
): AggregateReport {
  const completed = games.filter((game) => game.status === 'completed');
  const winsByPlayer = { 1: games.filter((game) => game.winnerId === 1).length, 2: games.filter((game) => game.winnerId === 2).length } as const;
  const deckDistributions: DeckDistribution[] = [
    analyzeDeckFixture(1, config.playerOneDeck, cardDefinitions),
    analyzeDeckFixture(2, config.playerTwoDeck, cardDefinitions)
  ];
  const playerResult = (playerId: PlayerId, strategy: SimulationConfig['playerOneStrategy'], deck: string): AggregateStrategyResult => {
    const wins = games.filter((game) => game.winnerId === playerId).length;
    return {
      playerId,
      strategy,
      deck,
      games: games.length,
      wins,
      losses: games.filter((game) => game.winnerId !== undefined && game.winnerId !== playerId).length,
      inconclusive: games.filter((game) => game.status === 'inconclusive').length,
      firstPlayerGames: games.filter((game) => game.firstPlayerId === playerId).length,
      firstPlayerWins: games.filter((game) => game.firstPlayerId === playerId && game.winnerId === playerId).length,
      winRate: games.length === 0 ? 0 : Number(((wins / games.length) * 100).toFixed(2)),
      averageRounds: average(games.map((game) => game.finalRound)),
      averageFinalHp: average(games.map((game) => game.finalHp[playerId])),
      averageSoulsGained: average(games.map((game) => game.soulsGained[playerId])),
      averageSoulsGainedFromCombat: average(games.map((game) => game.soulsGainedFromCombat[playerId])),
      averageSoulsGainedFromRetirement: average(games.map((game) => game.soulsGainedFromRetirement[playerId])),
      averageSoulsSpent: average(games.map((game) => game.soulsSpent[playerId])),
      averageDamageDealt: average(games.map((game) => game.damageDealt[playerId])),
      averageDamageReceived: average(games.map((game) => game.damageReceived[playerId]))
    };
  };
  const invocationsByPlayerAndLevel = { 1: sumLevelCounters(games, 1), 2: sumLevelCounters(games, 2) };
  const invocationsByLevel = levelCounter();
  addLevelCounter(invocationsByLevel, invocationsByPlayerAndLevel[1]);
  addLevelCounter(invocationsByLevel, invocationsByPlayerAndLevel[2]);
  const invocationDiagnostics = playerDiagnostics();
  for (const game of games) {
    addDiagnostics(invocationDiagnostics[1], game.invocationDiagnostics[1]);
    addDiagnostics(invocationDiagnostics[2], game.invocationDiagnostics[2]);
  }

  const warnings: string[] = [];
  for (const distribution of deckDistributions) {
    warnings.push(...distribution.validationErrors.map((error) => `J${distribution.playerId}: ${error}`));
    if (!distribution.practicalToStart) warnings.push(`J${distribution.playerId}: o baralho ${distribution.name} não tem cartas de nível 0 e não consegue iniciar uma invocação com zero Souls.`);
    for (const level of [0, 1, 2, 3, 4] as const) {
      if (distribution.byLevel[level] === 0) warnings.push(`J${distribution.playerId}: a bateria não contém cartas de nível ${level}.`);
      if (distribution.byLevel[level] > 0 && invocationsByPlayerAndLevel[distribution.playerId][level] === 0) {
        warnings.push(`J${distribution.playerId}: existem cartas de nível ${level} no baralho, mas nenhuma foi invocada.`);
      }
    }
  }
  if (games.length > 0 && games.filter((game) => game.status === 'inconclusive').length / games.length > 0.2) warnings.push('Mais de 20% das simulações foram inconclusivas; os resultados não permitem avaliar completamente o balanceamento.');
  if (completed.length > 0 && Math.abs(winsByPlayer[1] - winsByPlayer[2]) / completed.length > 0.3) warnings.push('Existe uma diferença relevante entre as vitórias dos dois jogadores; isto é um alerta diagnóstico, não uma conclusão de balanceamento.');
  if (!invocationCoverage.allLevelsCovered) warnings.push(...invocationCoverage.warnings);
  for (const game of games) warnings.push(...game.metricWarnings);
  for (const [index, distribution] of deckDistributions.entries()) {
    const playerId = index === 0 ? 1 : 2;
    if (distribution.byLevel[2] + distribution.byLevel[3] + distribution.byLevel[4] > 0 && games.every((game) => game.invocationsByLevel[playerId][2] + game.invocationsByLevel[playerId][3] + game.invocationsByLevel[playerId][4] === 0)) {
      warnings.push(`J${playerId}: a cobertura de níveis 2–4 não foi observada nas partidas; use o cenário determinístico de invocação para separar falha de cobertura de equilíbrio.`);
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    config,
    games: games.length,
    completedGames: completed.length,
    inconclusiveGames: games.length - completed.length,
    winsByPlayer,
    strategyResults: [
      playerResult(1, config.playerOneStrategy, config.playerOneDeck.name),
      playerResult(2, config.playerTwoStrategy, config.playerTwoDeck.name)
    ],
    averageRounds: average(games.map((game) => game.finalRound)),
    averageTurns: average(games.map((game) => game.turns)),
    averageFinalHp: { 1: average(games.map((game) => game.finalHp[1])), 2: average(games.map((game) => game.finalHp[2])) },
    averageSoulsGained: averageCounter(games, (game, playerId) => game.soulsGained[playerId]),
    averageSoulsGainedFromCombat: averageCounter(games, (game, playerId) => game.soulsGainedFromCombat[playerId]),
    averageSoulsGainedFromRetirement: averageCounter(games, (game, playerId) => game.soulsGainedFromRetirement[playerId]),
    averageSoulsSpent: averageCounter(games, (game, playerId) => game.soulsSpent[playerId]),
    averageDamageDealt: averageCounter(games, (game, playerId) => game.damageDealt[playerId]),
    averageDamageReceived: averageCounter(games, (game, playerId) => game.damageReceived[playerId]),
    averageCombatDamageDealt: averageCounter(games, (game, playerId) => game.combatDamageDealt[playerId]),
    averageCombatDamageReceived: averageCounter(games, (game, playerId) => game.combatDamageReceived[playerId]),
    averageHpPenalties: averageCounter(games, (game, playerId) => game.hpPenalties[playerId]),
    averageExcessDamage: averageCounter(games, (game, playerId) => game.excessDamage[playerId]),
    invocationsByLevel,
    invocationsByPlayerAndLevel,
    firstInvocationRoundByPlayerAndLevel: firstInvocationRounds(games),
    invocationDiagnostics,
    averageCardsRemainingInHand: averageLevelCounter(games, (game, playerId) => game.cardLocationsByLevel[playerId].hand),
    averageCardsRemainingInDeck: averageLevelCounter(games, (game, playerId) => game.cardLocationsByLevel[playerId].deck),
    deckDistributions,
    invocationCoverage,
    warnings: uniqueWarnings(warnings)
  };
}

function simulateOneGame(config: SimulationConfig, catalogDefinitions: GameState['cardDefinitions'], seed: number, gameIndex: number): SimulationMetrics {
  const state = initializeGame({
    cardDefinitions: Object.values(catalogDefinitions),
    players: [{ id: 1, deck: config.playerOneDeck.cards }, { id: 2, deck: config.playerTwoDeck.cards }],
    random: createSimulationRandom(seed, config.firstPlayerId),
    uuidGenerator: createDeterministicUuidGenerator()
  });
  return simulateState(config, seed, gameIndex, state);
}

export function runSimulation(config: SimulationConfig, cardDefinitions: GameState['cardDefinitions']): SimulationOutput {
  assertOfficialDeckFixtures([config.playerOneDeck, config.playerTwoDeck], cardDefinitions);
  const games = Array.from({ length: config.games }, (_, index) => simulateOneGame(config, cardDefinitions, config.seed + index, index));
  const invocationCoverage = runInvocationCoverage(cardDefinitions);
  return { games, aggregate: aggregate(config, games, cardDefinitions, invocationCoverage), invocationCoverage };
}

export function runPairedSimulation(config: SimulationConfig, cardDefinitions: GameState['cardDefinitions']): PairedSimulationOutput {
  const baseline = runSimulation({ ...config, firstPlayerId: 1 }, cardDefinitions);
  const swapped = runSimulation({
    ...config,
    firstPlayerId: 2,
    playerOneStrategy: config.playerTwoStrategy,
    playerTwoStrategy: config.playerOneStrategy,
    playerOneDeck: config.playerTwoDeck,
    playerTwoDeck: config.playerOneDeck
  }, cardDefinitions);
  const comparisons = baseline.games.map((game, index) => {
    const swappedGame = swapped.games[index];
    if (swappedGame === undefined) throw new Error(`O par ${index + 1} não tem execução trocada.`);
    return {
      pairIndex: index + 1,
      seed: game.seed,
      baselineSimulationId: game.id,
      swappedSimulationId: swappedGame.id,
      baselineFirstPlayerId: game.firstPlayerId,
      swappedFirstPlayerId: swappedGame.firstPlayerId,
      ...(game.winnerId === undefined ? {} : { baselineWinnerId: game.winnerId }),
      ...(swappedGame.winnerId === undefined ? {} : { swappedWinnerId: swappedGame.winnerId })
    };
  });
  const warnings = comparisons.some((comparison) => comparison.seed !== baseline.games[comparison.pairIndex - 1]?.seed)
    ? ['A matriz emparelhada contém seeds diferentes entre as posições.']
    : [];
  return { baseline, swapped, comparisons, warnings };
}
