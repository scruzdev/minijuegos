import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./platform/catalog/catalog-page.component').then(
        (module) => module.CatalogPageComponent,
      ),
  },
  {
    path: 'games/minesweeper',
    loadComponent: () =>
      import('./games/minesweeper/minesweeper-page.component').then(
        (module) => module.MinesweeperPageComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];
