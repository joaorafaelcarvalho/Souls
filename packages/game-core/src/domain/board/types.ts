import type { CardInstanceId } from '../cards/types.js';
import type { PlayerId } from '../players/types.js';

export type BoardRow = 0 | 1 | 2 | 3 | 4 | 5;
export type BoardColumn = 0 | 1 | 2 | 3;
export type BoardPositionKey = `${BoardRow},${BoardColumn}`;
export type BoardCellType = 'defense' | 'melee' | 'ranged';

export interface BoardPosition {
  readonly row: BoardRow;
  readonly column: BoardColumn;
  readonly key: BoardPositionKey;
  readonly type: BoardCellType;
  readonly ownerId: PlayerId;
}

export interface BoardState {
  readonly occupants: Readonly<Record<BoardPositionKey, CardInstanceId | null>>;
}