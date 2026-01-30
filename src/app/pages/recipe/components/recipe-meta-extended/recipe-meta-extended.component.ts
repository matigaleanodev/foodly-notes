import { Component, input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@shared/translate/translate-pipe';
import { addIcons } from 'ionicons';
import {
  fitnessOutline,
  flameOutline,
  heartOutline,
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

  constructor() {
    addIcons({
      heartOutline,
      timeOutline,
      flameOutline,
      fitnessOutline,
    });
  }
}
