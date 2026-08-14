import { GameDefinition } from './game-definition.model';

export const GAME_REGISTRY: GameDefinition[] = [
  {
    id: 'minesweeper',
    name: 'Minesweeper',
    description: 'Classic Minesweeper',
    route: '/games/minesweeper',
    image: 'minesweeper',
  },
  {
    id: 'snake',
    name: 'Snake',
    description: 'Classic Snake',
    route: '/games/snake',
    image: 'snake',
  },
];
