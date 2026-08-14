import { Injectable, OnDestroy, computed, signal } from '@angular/core';
import { SNAKE_CONFIG } from './snake.config';
import { SnakeDirection, SnakeGameStatus, SnakePosition } from './snake.models';

@Injectable()
export class SnakeGameService implements OnDestroy {
  private readonly _snake = signal<SnakePosition[]>([]);
  private readonly _food = signal<SnakePosition | null>(null);
  private readonly _direction = signal<SnakeDirection>('right');
  private readonly _status = signal<SnakeGameStatus>('ready');
  private readonly _score = signal(0);
  private readonly _tickMs = signal<number>(SNAKE_CONFIG.initialTickMs);
  private pendingDirection: SnakeDirection = 'right';
  private tickTimer: ReturnType<typeof setTimeout> | undefined;

  readonly snake = this._snake.asReadonly();
  readonly food = this._food.asReadonly();
  readonly direction = this._direction.asReadonly();
  readonly status = this._status.asReadonly();
  readonly score = this._score.asReadonly();
  readonly tickMs = this._tickMs.asReadonly();
  readonly board = computed(() => ({ rows: SNAKE_CONFIG.rows, columns: SNAKE_CONFIG.columns }));

  constructor() {
    this.newGame();
  }

  ngOnDestroy(): void {
    this.stopLoop();
  }

  newGame(): void {
    this.stopLoop();
    const centerRow = Math.floor(SNAKE_CONFIG.rows / 2);
    const centerColumn = Math.floor(SNAKE_CONFIG.columns / 2);
    const snake = Array.from({ length: SNAKE_CONFIG.initialLength }, (_, index) => ({
      row: centerRow,
      column: centerColumn - index,
    }));
    this._snake.set(snake);
    this._food.set(this.createFood(snake));
    this._direction.set('right');
    this.pendingDirection = 'right';
    this._score.set(0);
    this._tickMs.set(SNAKE_CONFIG.initialTickMs);
    this._status.set('ready');
  }

  changeDirection(direction: SnakeDirection): void {
    if (this._status() === 'paused' || this._status() === 'lost' || this.isOpposite(direction, this._direction())) {
      return;
    }
    this.pendingDirection = direction;
    if (this._status() === 'ready') {
      this._status.set('playing');
      this.scheduleNextTick();
    }
  }

  pause(): void {
    if (this._status() !== 'playing') {
      return;
    }
    this.stopLoop();
    this._status.set('paused');
  }

  resume(): void {
    if (this._status() !== 'paused') {
      return;
    }
    this._status.set('playing');
    this.scheduleNextTick();
  }

  togglePause(): void {
    if (this._status() === 'playing') {
      this.pause();
    } else if (this._status() === 'paused') {
      this.resume();
    }
  }

  private scheduleNextTick(): void {
    this.stopLoop();
    this.tickTimer = setTimeout(() => {
      this.tick();
      if (this._status() === 'playing') {
        this.scheduleNextTick();
      }
    }, this._tickMs());
  }

  private tick(): void {
    const direction = this.pendingDirection;
    this._direction.set(direction);
    const snake = this._snake();
    const nextHead = this.nextPosition(snake[0], direction);
    const food = this._food();
    const ateFood = this.samePosition(nextHead, food);
    const collisionBody = ateFood ? snake : snake.slice(0, -1);

    if (collisionBody.some((segment) => this.samePosition(segment, nextHead))) {
      this._status.set('lost');
      this.stopLoop();
      return;
    }

    const nextSnake = [nextHead, ...snake];
    if (!ateFood) {
      nextSnake.pop();
    } else {
      this._score.update((score) => score + 1);
      this._tickMs.update((tickMs) => Math.max(SNAKE_CONFIG.minimumTickMs, tickMs - SNAKE_CONFIG.speedIncreaseMs));
      this._food.set(this.createFood(nextSnake));
    }
    this._snake.set(nextSnake);
  }

  private nextPosition(position: SnakePosition, direction: SnakeDirection): SnakePosition {
    const offset = {
      up: { row: -1, column: 0 },
      down: { row: 1, column: 0 },
      left: { row: 0, column: -1 },
      right: { row: 0, column: 1 },
    }[direction];
    return {
      row: (position.row + offset.row + SNAKE_CONFIG.rows) % SNAKE_CONFIG.rows,
      column: (position.column + offset.column + SNAKE_CONFIG.columns) % SNAKE_CONFIG.columns,
    };
  }

  private createFood(snake: SnakePosition[]): SnakePosition | null {
    const available: SnakePosition[] = [];
    for (let row = 0; row < SNAKE_CONFIG.rows; row++) {
      for (let column = 0; column < SNAKE_CONFIG.columns; column++) {
        const position = { row, column };
        if (!snake.some((segment) => this.samePosition(segment, position))) {
          available.push(position);
        }
      }
    }
    return available[Math.floor(Math.random() * available.length)] ?? null;
  }

  private isOpposite(next: SnakeDirection, current: SnakeDirection): boolean {
    return (next === 'up' && current === 'down')
      || (next === 'down' && current === 'up')
      || (next === 'left' && current === 'right')
      || (next === 'right' && current === 'left');
  }

  private samePosition(first: SnakePosition, second: SnakePosition | null): boolean {
    return !!second && first.row === second.row && first.column === second.column;
  }

  private stopLoop(): void {
    if (this.tickTimer !== undefined) {
      clearTimeout(this.tickTimer);
      this.tickTimer = undefined;
    }
  }
}
