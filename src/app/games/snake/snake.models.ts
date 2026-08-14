export interface SnakePosition {
  row: number;
  column: number;
}

export type SnakeDirection = 'up' | 'down' | 'left' | 'right';

export type SnakeGameStatus = 'ready' | 'playing' | 'paused' | 'lost';
