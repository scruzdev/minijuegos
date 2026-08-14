import { GameDefinition } from './game-definition.model';

export const GAME_REGISTRY: GameDefinition[] = [
  {
    id: 'minesweeper',
    name: 'Minesweeper',
    description: 'Classic Minesweeper',
    route: '/games/minesweeper',
  },
];
