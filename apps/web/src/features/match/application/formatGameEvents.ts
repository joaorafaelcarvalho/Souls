import type {
  CombatColumnTrace,
  GameEvent,
  GameState,
  PlayerId,
  TurnPhase
} from '@souls/game-core';

const phaseLabels: Record<TurnPhase, string> = {
  'first-round-positioning': 'posicionamento inicial',
  draw: 'compra',
  positioning: 'posicionamento',
  attack: 'ataque'
};

function playerLabel(playerId: PlayerId, labels?: Readonly<Record<PlayerId, string>>): string {
  return labels?.[playerId] ?? 'Jogador ' + playerId;
}

function cardName(state: GameState, instanceId: string): string {
  const instance = state.cardInstances[instanceId];
  const definition = instance === undefined
    ? undefined
    : state.cardDefinitions[instance.cardDefinitionId];

  return definition?.name ?? 'Uma carta';
}

function soulLabel(amount: number): string {
  return amount === 1 ? 'Soul' : 'Souls';
}

export function formatGameEvents(
  events: readonly GameEvent[],
  previousState: GameState,
  nextState: GameState,
  options: { readonly playerLabels?: Readonly<Record<PlayerId, string>> } = {}
): readonly string[] {
  const messages = events.map((event): string => {
    switch (event.type) {
      case 'card-invoked':
        return playerLabel(event.playerId, options.playerLabels) + ' invocou ' + cardName(nextState, event.instanceId) + '.';
      case 'card-retired':
        return playerLabel(event.playerId, options.playerLabels) + ' retirou ' + cardName(nextState, event.instanceId) + ' do campo e consumiu uma ação de posicionamento.';
      case 'card-drawn':
        return playerLabel(event.playerId, options.playerLabels) + ' comprou uma carta.';
      case 'draw-failed':
        return event.penalty === 'soul'
          ? playerLabel(event.playerId, options.playerLabels) + ' falhou uma compra e perdeu 1 Soul.'
          : playerLabel(event.playerId, options.playerLabels) + ' falhou uma compra e sofreu uma penalização de HP.';
      case 'card-destroyed':
        return cardName(nextState, event.instanceId) + ' foi destruído.';
      case 'souls-gained':
        return event.reason === 'retirement'
          ? playerLabel(event.playerId, options.playerLabels) + ' recebeu ' + event.amount + ' ' + soulLabel(event.amount) + ' por retirada estratégica.'
          : playerLabel(event.playerId, options.playerLabels) + ' ganhou ' + event.amount + ' ' + soulLabel(event.amount) + '.';
      case 'souls-spent':
        return playerLabel(event.playerId, options.playerLabels) + ' gastou ' + event.amount + ' ' + soulLabel(event.amount) + '.';
      case 'damage-dealt':
        return event.reason === 'failed-draw'
          ? playerLabel(event.targetPlayerId, options.playerLabels) + ' perdeu ' + event.amount + ' HP por falha de compra.'
          : playerLabel(event.targetPlayerId, options.playerLabels) + ' perdeu ' + event.amount + ' HP.';
      case 'turn-started':
        return event.round !== previousState.turn.round
          ? 'Ronda ' + event.round + ' começou. ' + playerLabel(event.playerId, options.playerLabels) + ' iniciou a fase de ' + phaseLabels[event.phase] + '.'
          : playerLabel(event.playerId, options.playerLabels) + ' iniciou a fase de ' + phaseLabels[event.phase] + '.';
      case 'game-ended':
        return playerLabel(event.winnerId, options.playerLabels) + ' venceu a partida.';
    }
  });

  if (
    previousState.turn.phase === 'positioning' &&
    nextState.turn.phase === 'attack' &&
    !events.some((event) => event.type === 'turn-started')
  ) {
    messages.push(playerLabel(previousState.turn.activePlayerId, options.playerLabels) + ' terminou o posicionamento.');
  }

  return messages;
}
export function formatCombatColumnTrace(column: CombatColumnTrace, state: GameState): readonly string[] {
  const attackerNames = column.attackerIds
    .map((instanceId) => cardName(state, instanceId))
    .join(' + ');
  const messages = [`Coluna ${column.column + 1}: ${attackerNames} iniciou o ataque.`];

  for (const exchange of column.result.exchanges) {
    const targetName = exchange.targetId === undefined ? undefined : cardName(state, exchange.targetId);

    if (exchange.kind === 'defense') {
      messages.push(
        exchange.outcome === 'destroyed'
          ? `A defesa de ${targetName ?? 'uma carta'} foi destruída; o ataque prosseguiu.`
          : exchange.outcome === 'blocked'
            ? 'A defesa bloqueou o ataque.'
            : 'Ataque e defesa empataram.'
      );
      continue;
    }

    if (exchange.kind === 'offense') {
      messages.push(
        exchange.outcome === 'attacker-wins'
          ? `O ataque venceu o confronto contra ${targetName ?? 'uma carta'}.`
          : exchange.outcome === 'attacker-loses'
            ? `O ataque perdeu o confronto contra ${targetName ?? 'uma carta'}.`
            : `Ataque e ${targetName ?? 'a carta defensora'} empataram.`
      );
      continue;
    }

    messages.push(`Ataque direto causou ${exchange.hpDamage} de dano.`);
  }

  return messages;
}
