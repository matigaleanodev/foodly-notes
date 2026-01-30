import { Component, input } from '@angular/core';
import { RecipeIngredient } from '@recipes/models/recipe-ingredient.model';
import { TranslatePipe } from '@shared/translate/translate-pipe';

@Component({
  selector: 'app-recipe-ingredients',
  imports: [TranslatePipe],
  templateUrl: './recipe-ingredients.component.html',
  styleUrls: ['./recipe-ingredients.component.scss'],
})
export class RecipeIngredientsComponent {
  readonly ingredients = input.required<RecipeIngredient[]>();
}
