import { Injectable, OnDestroy, computed, signal } from '@angular/core';
import { MINESWEEPER_DIFFICULTIES } from './minesweeper.config';
import { Cell, Difficulty, GameStatus } from './minesweeper.models';

@Injectable()
export class MinesweeperGameService implements OnDestroy {
  private readonly _board = signal<Cell[][]>([]);
  private readonly _status = signal<GameStatus>('ready');
  private readonly _difficulty = signal<Difficulty>('beginner');
  private readonly _elapsedSeconds = signal(0);
  private timerId: ReturnType<typeof setInterval> | undefined;

  readonly board = this._board.asReadonly();
  readonly status = this._status.asReadonly();
  readonly difficulty = this._difficulty.asReadonly();
  readonly elapsedSeconds = this._elapsedSeconds.asReadonly();
  readonly configuration = computed(() => MINESWEEPER_DIFFICULTIES[this._difficulty()]);
  readonly remainingMines = computed(() => {
    const flags = this._board().flat().filter((cell) => cell.isFlagged).length;
    return this.configuration().mines - flags;
  });

  constructor() {
    this.newGame();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  newGame(): void {
    this.stopTimer();
    this._elapsedSeconds.set(0);
    this._status.set('ready');
    this._board.set(this.createBoard(this.configuration()));
  }

  changeDifficulty(difficulty: Difficulty): void {
    if (difficulty === this._difficulty()) {
      return;
    }
    this._difficulty.set(difficulty);
    this.newGame();
  }

  revealCell(row: number, column: number): void {
    if (this._status() === 'won' || this._status() === 'lost') {
      return;
    }
    const cell = this.getCell(row, column);
    if (!cell || cell.isRevealed || cell.isFlagged) {
      return;
    }
    this.startPlaying();
    if (cell.isMine) {
      this._board.set(this._board().map((line) => line.map((item) => ({
        ...item,
        isRevealed: item.isMine ? true : item.isRevealed,
      }))));
      this.finish('lost');
      return;
    }
    const nextBoard = this.cloneBoard();
    this.expand(nextBoard, row, column);
    this._board.set(nextBoard);
    if (this.hasWon(nextBoard)) {
      this.finish('won');
    }
  }

  toggleFlag(row: number, column: number): void {
    if (this._status() === 'won' || this._status() === 'lost') {
      return;
    }
    const cell = this.getCell(row, column);
    if (!cell || cell.isRevealed) {
      return;
    }
    this.startPlaying();
    const nextBoard = this.cloneBoard();
    nextBoard[row][column].isFlagged = !nextBoard[row][column].isFlagged;
    this._board.set(nextBoard);
  }

  private createBoard(config: { rows: number; columns: number; mines: number }): Cell[][] {
    const board = Array.from({ length: config.rows }, (_, row) =>
      Array.from({ length: config.columns }, (_, column) => ({
        row, column, isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 0,
      })),
    );
    const positions = Array.from({ length: config.rows * config.columns }, (_, index) => index);
    for (let index = positions.length - 1; index > 0; index--) {
      const target = Math.floor(Math.random() * (index + 1));
      [positions[index], positions[target]] = [positions[target], positions[index]];
    }
    positions.slice(0, config.mines).forEach((position) => {
      board[Math.floor(position / config.columns)][position % config.columns].isMine = true;
    });
    board.forEach((line) => line.forEach((cell) => {
      cell.adjacentMines = this.neighbours(board, cell.row, cell.column)
        .filter((neighbour) => neighbour.isMine).length;
    }));
    return board;
  }

  private expand(board: Cell[][], row: number, column: number): void {
    const pending: Array<[number, number]> = [[row, column]];
    const visited = new Set<string>();
    while (pending.length) {
      const [currentRow, currentColumn] = pending.shift()!;
      const key = currentRow + ':' + currentColumn;
      if (visited.has(key)) {
        continue;
      }
      visited.add(key);
      const cell = board[currentRow]?.[currentColumn];
      if (!cell || cell.isMine || cell.isFlagged) {
        continue;
      }
      cell.isRevealed = true;
      if (cell.adjacentMines === 0) {
        this.neighbours(board, currentRow, currentColumn).forEach((neighbour) => {
          if (!neighbour.isRevealed && !neighbour.isMine) {
            pending.push([neighbour.row, neighbour.column]);
          }
        });
      }
    }
  }

  private neighbours(board: Cell[][], row: number, column: number): Cell[] {
    const result: Cell[] = [];
    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
      for (let columnOffset = -1; columnOffset <= 1; columnOffset++) {
        if (!rowOffset && !columnOffset) {
          continue;
        }
        const neighbour = board[row + rowOffset]?.[column + columnOffset];
        if (neighbour) {
          result.push(neighbour);
        }
      }
    }
    return result;
  }

  private cloneBoard(): Cell[][] {
    return this._board().map((line) => line.map((cell) => ({ ...cell })));
  }

  private getCell(row: number, column: number): Cell | undefined {
    return this._board()[row]?.[column];
  }

  private hasWon(board: Cell[][]): boolean {
    return board.flat().every((cell) => cell.isMine || cell.isRevealed);
  }

  private startPlaying(): void {
    if (this._status() === 'ready') {
      this._status.set('playing');
      this.timerId = setInterval(() => this._elapsedSeconds.update((seconds) => seconds + 1), 1000);
    }
  }

  private finish(status: 'won' | 'lost'): void {
    this._status.set(status);
    this.stopTimer();
  }

  private stopTimer(): void {
    if (this.timerId !== undefined) {
      clearInterval(this.timerId);
      this.timerId = undefined;
    }
  }
}
