import { Component, HostListener, inject } from '@angular/core';
import { MinesweeperGameService } from './minesweeper-game.service';

@Component({
  selector: 'app-minesweeper-board',
  templateUrl: './minesweeper-board.component.html',
  styleUrl: './minesweeper-board.component.css',
})
export class MinesweeperBoardComponent {
  protected readonly game = inject(MinesweeperGameService);
  private pressTimer: ReturnType<typeof setTimeout> | undefined;
  private pressedCell: { row: number; column: number; x: number; y: number } | undefined;
  private longPressHandled = false;

  @HostListener('contextmenu', ['$event'])
  protected preventContextMenu(event: Event): void {
    event.preventDefault();
  }

  protected onPointerDown(event: PointerEvent, row: number, column: number): void {
    if (event.button !== 0) {
      return;
    }
    this.cancelPress();
    this.longPressHandled = false;
    this.pressedCell = { row, column, x: event.clientX, y: event.clientY };
    this.pressTimer = setTimeout(() => {
      this.game.toggleFlag(row, column);
      this.longPressHandled = true;
    }, 500);
  }

  protected onPointerUp(event: PointerEvent, row: number, column: number): void {
    if (event.button !== 0) {
      return;
    }
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
      this.pressTimer = undefined;
    }
    if (!this.longPressHandled && this.pressedCell?.row === row && this.pressedCell.column === column) {
      this.game.revealCell(row, column);
    }
    this.pressedCell = undefined;
  }

  protected onPointerMove(event: PointerEvent): void {
    if (!this.pressedCell) {
      return;
    }
    const moved = Math.hypot(event.clientX - this.pressedCell.x, event.clientY - this.pressedCell.y);
    if (moved > 10) {
      this.cancelPress();
    }
  }

  protected onPointerCancel(): void {
    this.cancelPress();
  }

  protected onRightClick(event: MouseEvent, row: number, column: number): void {
    event.preventDefault();
    this.game.toggleFlag(row, column);
  }

  private cancelPress(): void {
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
      this.pressTimer = undefined;
    }
    this.pressedCell = undefined;
  }
}
