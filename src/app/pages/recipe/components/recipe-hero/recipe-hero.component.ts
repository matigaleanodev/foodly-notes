import { Component, input } from '@angular/core';
import { IonImg } from '@ionic/angular/standalone';

@Component({
  selector: 'app-recipe-hero',
  imports: [IonImg],
  templateUrl: './recipe-hero.component.html',
  styleUrls: ['./recipe-hero.component.scss'],
})
export class RecipeHeroComponent {
  readonly title = input.required<string>();
  readonly imageUrl = input.required<string>();
}
