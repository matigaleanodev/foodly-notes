import { Component, computed, input, OnInit } from '@angular/core';
import { IonCard, IonImg, IonCardTitle } from '@ionic/angular/standalone';
import { RecipeInfo } from '@shared/models/recipe.model';

@Component({
  selector: 'app-recipe-card',
  imports: [IonCardTitle, IonImg, IonCard],
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss'],
})
export class RecipeCardComponent {
  readonly recipe = input.required<RecipeInfo>();

  readonly recipeImageUrl = computed(() => {
    const recipe = this.recipe();
    if (!recipe) return '';

    return (
      'https://spoonacular.com/recipeImages/' +
      recipe.id +
      '-312x231.' +
      (recipe.imageType || 'jpg')
    );
  });

  constructor() {}
}
