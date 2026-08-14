export type Difficulty = 'beginner' | 'intermediate' | 'expert';
export type GameStatus = 'ready' | 'playing' | 'won' | 'lost';

export interface Cell {
  row: number;
  column: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
}
