import type { CardInstanceId } from '../cards/types.js';

export type PlayerId = 1 | 2;

export interface PlayerState {
  readonly id: PlayerId;
  readonly hp: number;
  readonly souls: number;
  readonly hand: readonly CardInstanceId[];
  readonly deck: readonly CardInstanceId[];
  readonly discard: readonly CardInstanceId[];
}