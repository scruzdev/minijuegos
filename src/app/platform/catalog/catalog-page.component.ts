import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GAME_REGISTRY } from '../game-registry';

@Component({
  selector: 'app-catalog-page',
  imports: [RouterLink],
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.css',
})
export class CatalogPageComponent {
  protected readonly games = GAME_REGISTRY;
}
