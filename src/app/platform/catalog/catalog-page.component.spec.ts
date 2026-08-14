import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { CatalogPageComponent } from './catalog-page.component';

describe('CatalogPageComponent', () => {
  it('renders every game from the central registry', async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(CatalogPageComponent);
    fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('.game-card') as NodeListOf<HTMLElement>;

    expect(cards).toHaveLength(2);
    expect(cards[0].textContent).toContain('Minesweeper');
    expect(cards[1].textContent).toContain('Snake');
    expect(cards[1].querySelector('a')?.getAttribute('href')).toBe('/games/snake');
  });
});
