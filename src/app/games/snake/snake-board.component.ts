import { Component, inject } from '@angular/core';
import { SNAKE_CONFIG } from './snake.config';
import { SnakeGameService } from './snake-game.service';
import { SnakeDirection, SnakePosition } from './snake.models';

@Component({
  selector: 'app-snake-board',
  templateUrl: './snake-board.component.html',
  styleUrl: './snake-board.component.css',
})
export class SnakeBoardComponent {
  protected readonly game = inject(SnakeGameService);
  protected readonly cells = Array.from(
    { length: SNAKE_CONFIG.rows * SNAKE_CONFIG.columns },
    (_, index) => ({ row: Math.floor(index / SNAKE_CONFIG.columns), column: index % SNAKE_CONFIG.columns, key: index }),
  );
  private pointerStart: { x: number; y: number } | undefined;

  protected onPointerDown(event: PointerEvent): void {
    event.preventDefault();
    const board = event.currentTarget as HTMLElement;
    board.setPointerCapture?.(event.pointerId);
    this.pointerStart = { x: event.clientX, y: event.clientY };
  }

  protected onPointerUp(event: PointerEvent): void {
    event.preventDefault();
    const board = event.currentTarget as HTMLElement;
    if (board.hasPointerCapture?.(event.pointerId)) {
      board.releasePointerCapture(event.pointerId);
    }
    if (!this.pointerStart) {
      return;
    }
    const deltaX = event.clientX - this.pointerStart.x;
    const deltaY = event.clientY - this.pointerStart.y;
    this.pointerStart = undefined;
    const distance = Math.hypot(deltaX, deltaY);
    if (distance < 24) {
      return;
    }
    const direction: SnakeDirection = Math.abs(deltaX) > Math.abs(deltaY)
      ? deltaX > 0 ? 'right' : 'left'
      : deltaY > 0 ? 'down' : 'up';
    this.game.changeDirection(direction);
  }

  protected onPointerCancel(): void {
    this.pointerStart = undefined;
  }

  protected cellClass(cell: SnakePosition): string {
    const snake = this.game.snake();
    const isHead = snake[0]?.row === cell.row && snake[0]?.column === cell.column;
    const isBody = snake.some((segment, index) => index > 0 && this.samePosition(segment, cell));
    const isFood = this.samePosition(this.game.food(), cell);
    return [
      'snake-cell',
      isHead ? 'snake-cell--head' : isBody ? 'snake-cell--body' : '',
      isFood ? 'snake-cell--food' : '',
    ].filter(Boolean).join(' ');
  }

  protected cellLabel(cell: SnakePosition): string {
    if (this.samePosition(this.game.food(), cell)) {
      return 'Food';
    }
    const snakeIndex = this.game.snake().findIndex((segment) => this.samePosition(segment, cell));
    return snakeIndex === 0 ? 'Snake head' : snakeIndex > 0 ? 'Snake body' : 'Empty cell';
  }

  private samePosition(first: SnakePosition | null, second: SnakePosition): boolean {
    return !!first && first.row === second.row && first.column === second.column;
  }
}
