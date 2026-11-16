import type {
  BoardCellType,
  BoardColumn,
  BoardPosition,
  BoardPositionKey,
  BoardRow,
  BoardState
} from './types.js';

export const BOARD_ROWS = 6;
export const BOARD_COLUMNS = 4;

export function boardPositionKey(row: BoardRow, column: BoardColumn): BoardPositionKey {
  return `${row},${column}`;
}

export function getBoardCellType(row: BoardRow): BoardCellType {
  if (row === 0 || row === 5) {
    return 'ranged';
  }

  if (row === 1 || row === 4) {
    return 'melee';
  }

  return 'defense';
}

export function getBoardOwner(row: BoardRow): 1 | 2 {
  return row <= 2 ? 2 : 1;
}

export function getBoardPosition(row: number, column: number): BoardPosition {
  if (!Number.isInteger(row) || row < 0 || row >= BOARD_ROWS) {
    throw new RangeError(`Invalid board row: ${row}`);
  }

  if (!Number.isInteger(column) || column < 0 || column >= BOARD_COLUMNS) {
    throw new RangeError(`Invalid board column: ${column}`);
  }

  const typedRow = row as BoardRow;
  const typedColumn = column as BoardColumn;

  return {
    row: typedRow,
    column: typedColumn,
    key: boardPositionKey(typedRow, typedColumn),
    type: getBoardCellType(typedRow),
    ownerId: getBoardOwner(typedRow)
  };
}

export function createEmptyBoard(): BoardState {
  const occupants = {} as Record<BoardPositionKey, null>;

  for (let row = 0; row < BOARD_ROWS; row += 1) {
    for (let column = 0; column < BOARD_COLUMNS; column += 1) {
      const position = getBoardPosition(row, column);
      occupants[position.key] = null;
    }
  }

  return { occupants };
}