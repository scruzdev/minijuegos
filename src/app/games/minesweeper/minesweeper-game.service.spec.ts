import { MinesweeperGameService } from './minesweeper-game.service';

describe('MinesweeperGameService', () => {
  it('creates the classic beginner board', () => {
    const game = new MinesweeperGameService();
    const cells = game.board().flat();

    expect(game.status()).toBe('ready');
    expect(game.board()).toHaveLength(9);
    expect(game.board()[0]).toHaveLength(9);
    expect(cells.filter((cell) => cell.isMine)).toHaveLength(10);
    expect(game.remainingMines()).toBe(10);
  });

  it('restarts with the selected difficulty', () => {
    const game = new MinesweeperGameService();

    game.changeDifficulty('expert');

    expect(game.difficulty()).toBe('expert');
    expect(game.board()).toHaveLength(16);
    expect(game.board()[0]).toHaveLength(30);
    expect(game.board().flat().filter((cell) => cell.isMine)).toHaveLength(99);
    expect(game.status()).toBe('ready');
    expect(game.elapsedSeconds()).toBe(0);
  });

  it('toggles flags and updates the remaining mine counter', () => {
    const game = new MinesweeperGameService();

    game.toggleFlag(0, 0);
    expect(game.board()[0][0].isFlagged).toBe(true);
    expect(game.remainingMines()).toBe(9);

    game.toggleFlag(0, 0);
    expect(game.board()[0][0].isFlagged).toBe(false);
    expect(game.remainingMines()).toBe(10);
  });

  it('does not reveal flagged cells', () => {
    const game = new MinesweeperGameService();

    game.toggleFlag(0, 0);
    game.revealCell(0, 0);

    expect(game.board()[0][0].isRevealed).toBe(false);
    expect(game.board()[0][0].isFlagged).toBe(true);
  });
});
