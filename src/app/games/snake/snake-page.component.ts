import { Component, HostListener, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SnakeBoardComponent } from './snake-board.component';
import { SnakeGameService } from './snake-game.service';

@Component({
  selector: 'app-snake-page',
  imports: [RouterLink, SnakeBoardComponent],
  providers: [SnakeGameService],
  templateUrl: './snake-page.component.html',
  styleUrl: './snake-page.component.css',
})
export class SnakePageComponent {
  protected readonly game = inject(SnakeGameService);

  @HostListener('window:keydown', ['$event'])
  protected onKeyDown(event: KeyboardEvent): void {
    const directionByKey = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
      w: 'up',
      W: 'up',
      s: 'down',
      S: 'down',
      a: 'left',
      A: 'left',
      d: 'right',
      D: 'right',
    } as const;
    const direction = directionByKey[event.key as keyof typeof directionByKey];
    if (direction) {
      event.preventDefault();
      this.game.changeDirection(direction);
      return;
    }
    if (event.key === ' ' || event.key === 'p' || event.key === 'P') {
      event.preventDefault();
      this.game.togglePause();
    }
  }

  @HostListener('document:visibilitychange')
  protected onVisibilityChange(): void {
    if (document.visibilityState === 'hidden') {
      this.game.pause();
    }
  }
}
