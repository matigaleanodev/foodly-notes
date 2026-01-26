import { Component, computed, inject, input } from '@angular/core';
import {
  ShoppingListService,
  ShoppingRecipeState,
} from '@pages/shopping-list/services/shopping-list/shopping-list.service';
import { RecipeInfo } from '@shared/models/recipe.model';
import { IonItem, IonCheckbox, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-shopping-recipe-card',
  imports: [IonItem, IonCheckbox, IonLabel],
  templateUrl: './shopping-recipe-card.component.html',
  styleUrls: ['./shopping-recipe-card.component.scss'],
})
export class ShoppingRecipeCardComponent {
  readonly recipe = input.required<RecipeInfo>();
  readonly shoppingState = input.required<ShoppingRecipeState>();

  readonly ingredients = computed(() => this.recipe().extendedIngredients);

  private readonly _service = inject(ShoppingListService);

  isIngredientChecked(ingredientId: number) {
    return this._service.isIngredientChecked(this.recipe().id, ingredientId);
  }

  async toggleIngredient(ingredientId: number) {
    await this._service.toggleIngredient(this.recipe().id, ingredientId);
  }
}
