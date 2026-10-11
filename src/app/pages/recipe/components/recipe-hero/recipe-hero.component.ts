import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-recipe-hero',
  templateUrl: './recipe-hero.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./recipe-hero.component.scss'],
})
export class RecipeHeroComponent {
  readonly title = input.required<string>();
  readonly imageUrl = input.required<string>();

  private readonly fallbackImage =
    'assets/images/foodly_notes_banner_green.png';

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = this.fallbackImage;
  }
}
