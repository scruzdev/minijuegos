import { vi } from 'vitest';
import { SNAKE_CONFIG } from './snake.config';
import { SnakeGameService } from './snake-game.service';
import { SnakePosition } from './snake.models';

describe('SnakeGameService', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('initializes a 20 by 20 board with a free food cell', () => {
    const game = new SnakeGameService();

    expect(game.board()).toEqual({ rows: 20, columns: 20 });
    expect(game.status()).toBe('ready');
    expect(game.snake()).toHaveLength(3);
    expect(game.food()).not.toBeNull();
    expect(game.snake()).not.toContainEqual(game.food());
  });

  it('starts on a valid direction and moves one cell per tick', () => {
    vi.useFakeTimers();
    const game = new SnakeGameService();

    game.changeDirection('up');
    expect(game.status()).toBe('playing');
    vi.advanceTimersByTime(SNAKE_CONFIG.initialTickMs);

    expect(game.snake()[0]).toEqual({ row: 9, column: 10 });
    game.ngOnDestroy();
  });

  it('wraps around the board edges', () => {
    vi.useFakeTimers();
    const game = new SnakeGameService();

    game.changeDirection('up');
    vi.advanceTimersByTime(SNAKE_CONFIG.initialTickMs * 11);

    expect(game.snake()[0]).toEqual({ row: 19, column: 10 });
    game.ngOnDestroy();
  });

  it('ignores direct reversals', () => {
    vi.useFakeTimers();
    const game = new SnakeGameService();

    game.changeDirection('right');
    game.changeDirection('left');
    vi.advanceTimersByTime(SNAKE_CONFIG.initialTickMs);

    expect(game.direction()).toBe('right');
    expect(game.snake()[0]).toEqual({ row: 10, column: 11 });
    game.ngOnDestroy();
  });

  it('grows, scores and speeds up after eating food', () => {
    vi.useFakeTimers();
    const game = new SnakeGameService();
    const internals = game as unknown as {
      _food: { set(food: SnakePosition): void };
    };
    internals._food.set({ row: 10, column: 11 });

    game.changeDirection('right');
    vi.advanceTimersByTime(SNAKE_CONFIG.initialTickMs);

    expect(game.snake()).toHaveLength(4);
    expect(game.score()).toBe(1);
    expect(game.tickMs()).toBe(SNAKE_CONFIG.initialTickMs - SNAKE_CONFIG.speedIncreaseMs);
    expect(game.food()).not.toBeNull();
    game.ngOnDestroy();
  });

  it('loses when the head collides with its body', () => {
    vi.useFakeTimers();
    const game = new SnakeGameService();
    const internals = game as unknown as {
      _snake: { set(snake: SnakePosition[]): void };
    };
    internals._snake.set([
      { row: 10, column: 10 },
      { row: 9, column: 10 },
      { row: 9, column: 11 },
      { row: 10, column: 11 },
    ]);

    game.changeDirection('up');
    vi.advanceTimersByTime(SNAKE_CONFIG.initialTickMs);

    expect(game.status()).toBe('lost');
    game.ngOnDestroy();
  });

  it('pauses and resumes without changing the snake state', () => {
    vi.useFakeTimers();
    const game = new SnakeGameService();

    game.changeDirection('up');
    vi.advanceTimersByTime(SNAKE_CONFIG.initialTickMs);
    const pausedSnake = game.snake();
    const pausedScore = game.score();

    game.pause();
    vi.advanceTimersByTime(1000);
    expect(game.status()).toBe('paused');
    expect(game.snake()).toEqual(pausedSnake);
    expect(game.score()).toBe(pausedScore);

    game.resume();
    expect(game.status()).toBe('playing');
    game.ngOnDestroy();
  });

  it('restarts the board, score, speed and status', () => {
    vi.useFakeTimers();
    const game = new SnakeGameService();

    game.changeDirection('up');
    vi.advanceTimersByTime(SNAKE_CONFIG.initialTickMs);
    game.newGame();

    expect(game.status()).toBe('ready');
    expect(game.score()).toBe(0);
    expect(game.tickMs()).toBe(SNAKE_CONFIG.initialTickMs);
    expect(game.snake()).toHaveLength(SNAKE_CONFIG.initialLength);
    game.ngOnDestroy();
  });
});
