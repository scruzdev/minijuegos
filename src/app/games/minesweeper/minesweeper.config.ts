import { Difficulty } from './minesweeper.models';

export interface DifficultyConfig {
  rows: number;
  columns: number;
  mines: number;
  label: string;
}

export const MINESWEEPER_DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  beginner: { rows: 9, columns: 9, mines: 10, label: 'Beginner' },
  intermediate: { rows: 16, columns: 16, mines: 40, label: 'Intermediate' },
  expert: { rows: 16, columns: 30, mines: 99, label: 'Expert' },
};
