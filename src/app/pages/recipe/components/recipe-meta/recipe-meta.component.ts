import { Component, input, output } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  banOutline,
  cafeOutline,
  heartOutline,
  leafOutline,
  nutritionOutline,
  repeatOutline,
  restaurantOutline,
  timeOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-recipe-meta',
  imports: [IonButton, IonIcon],
  templateUrl: './recipe-meta.component.html',
  styleUrls: ['./recipe-meta.component.scss'],
})
export class RecipeMetaComponent {
  readonly readyInMinutes = input.required<number>();
  readonly servings = input.required<number>();
  readonly isFavorite = input.required<boolean>();
  readonly vegan = input<boolean>(false);
  readonly vegetarian = input<boolean>(false);
  readonly glutenFree = input<boolean>(false);
  readonly dairyFree = input<boolean>(false);

  readonly toggleFavorite = output<void>();
  readonly viewSimilar = output<void>();

  constructor() {
    addIcons({
      repeatOutline,
      heartOutline,
      cafeOutline,
      banOutline,
      nutritionOutline,
      leafOutline,
      restaurantOutline,
      timeOutline,
    });
  }
}
