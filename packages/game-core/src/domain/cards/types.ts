export type CardDefinitionId = string;
export type CardInstanceId = string;
export type CardType = 'melee' | 'ranged';
export type CardCategory = CardType;
export type CardLevel = 0 | 1 | 2 | 3 | 4;

export interface CardDefinition {
  readonly id: CardDefinitionId;
  readonly name: string;
  readonly level: CardLevel;
  readonly type: CardType;
  readonly attack: number;
  readonly defense: number;
  readonly image: string;
}

export interface CardInstance {
  readonly instanceId: CardInstanceId;
  readonly cardDefinitionId: CardDefinitionId;
  readonly ownerId: 1 | 2;
}