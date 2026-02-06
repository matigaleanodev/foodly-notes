import { Component, input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@shared/translate/translate-pipe';
import { addIcons } from 'ionicons';
import {
  fitnessOutline,
  flameOutline,
  heartOutline,
  leafOutline,
  timeOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-recipe-meta-extended',
  imports: [IonIcon, TranslatePipe],
  templateUrl: './recipe-meta-extended.component.html',
  styleUrls: ['./recipe-meta-extended.component.scss'],
})
export class RecipeMetaExtendedComponent {
  readonly preparationMinutes = input.required<number>();
  readonly cookingMinutes = input.required<number>();
  readonly healthScore = input.required<number>();
  readonly aggregateLikes = input.required<number>();
  readonly vegan = input<boolean>(false);
  readonly vegetarian = input<boolean>(false);
  readonly glutenFree = input<boolean>(false);
  readonly dairyFree = input<boolean>(false);

  constructor() {
    addIcons({
      heartOutline,
      timeOutline,
      flameOutline,
      fitnessOutline,
      leafOutline,
      salad: 'assets/diet/salad.svg',
      glutten: 'assets/diet/wheat-off.svg',
      dairy: 'assets/diet/milk-off.svg',
    });
  }
}
