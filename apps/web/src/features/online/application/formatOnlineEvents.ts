import type { OnlineGameEvent, AuthorizedGameView } from '@souls/game-online';

function cardName(view: AuthorizedGameView, instanceId: string | undefined): string {
  if (instanceId === undefined) return 'uma carta';
  const instance = view.visibleCardInstances[instanceId];
  return instance === undefined ? 'uma carta' : view.cardDefinitions[instance.cardDefinitionId]?.name ?? 'uma carta';
}

export function formatOnlineEvents(events: readonly OnlineGameEvent[], view: AuthorizedGameView): readonly string[] {
  return events.map((event) => {
    switch (event.type) {
      case 'card-invoked':
        return `Jogador ${event.playerId} invocou ${cardName(view, event.instanceId)}.`;
      case 'card-retired':
        return `Jogador ${event.playerId} retirou ${cardName(view, event.instanceId)} do campo.`;
      case 'card-drawn':
        return `Jogador ${event.playerId} comprou ${cardName(view, event.instanceId)}.`;
      case 'draw-failed':
        return event.penalty === 'soul'
          ? `Jogador ${event.playerId} falhou uma compra e perdeu 1 Soul.`
          : `Jogador ${event.playerId} falhou uma compra e sofreu uma penalização de HP.`;
      case 'card-destroyed':
        return `${cardName(view, event.instanceId)} foi destruído.`;
      case 'souls-gained':
        return `Jogador ${event.playerId} ganhou ${event.amount} Soul${event.amount === 1 ? '' : 's'}.`;
      case 'souls-spent':
        return `Jogador ${event.playerId} gastou ${event.amount} Soul${event.amount === 1 ? '' : 's'}.`;
      case 'damage-dealt':
        return `Jogador ${event.targetPlayerId} perdeu ${event.amount} HP.`;
      case 'turn-started':
        return `Jogador ${event.playerId} iniciou a fase ${event.phase}.`;
      case 'game-ended':
        return `Jogador ${event.winnerId} venceu a partida.`;
    }
  });
}

export function onlineEventMessage(events: readonly OnlineGameEvent[]): string {
  if (events.some((event) => event.type === 'game-ended')) return 'A partida terminou.';
  if (events.some((event) => event.type === 'card-destroyed')) return 'Ataque resolvido: cartas destruídas e consequências aplicadas.';
  if (events.some((event) => event.type === 'draw-failed')) return 'Compra concluída com penalizações por baralho vazio.';
  if (events.some((event) => event.type === 'card-drawn')) return 'Compra concluída. Escolhe uma carta e uma casa para posicionar.';
  if (events.some((event) => event.type === 'card-retired')) return 'Carta retirada para o descarte.';
  if (events.some((event) => event.type === 'card-invoked')) return 'Carta colocada no tabuleiro.';
  if (events.some((event) => event.type === 'turn-started')) return 'Novo turno iniciado.';
  return 'Estado atualizado.';
}
