import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { IonImg } from '@ionic/angular';

@Component({
  selector: 'app-recipe-hero',
  imports: [IonImg],
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
    const img = event.target as HTMLIonImgElement;
    img.src = this.fallbackImage;
  }
}
