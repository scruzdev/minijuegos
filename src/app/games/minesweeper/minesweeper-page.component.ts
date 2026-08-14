import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MINESWEEPER_DIFFICULTIES } from './minesweeper.config';
import { Difficulty } from './minesweeper.models';
import { MinesweeperBoardComponent } from './minesweeper-board.component';
import { MinesweeperGameService } from './minesweeper-game.service';

@Component({
  selector: 'app-minesweeper-page',
  imports: [RouterLink, MinesweeperBoardComponent],
  providers: [MinesweeperGameService],
  templateUrl: './minesweeper-page.component.html',
  styleUrl: './minesweeper-page.component.css',
})
export class MinesweeperPageComponent {
  protected readonly game = inject(MinesweeperGameService);
  protected readonly difficulties = Object.entries(MINESWEEPER_DIFFICULTIES) as [Difficulty, (typeof MINESWEEPER_DIFFICULTIES)[Difficulty]][];
  protected readonly formatCounter = (value: number) => String(Math.max(-99, Math.min(999, value))).padStart(3, '0');
  protected readonly formatTime = (value: number) => String(Math.min(999, value)).padStart(3, '0');
}
