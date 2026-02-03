import { Component, computed, inject, input, output } from '@angular/core';
import {
  ShoppingListService,
  ShoppingRecipeState,
} from '@pages/shopping-list/services/shopping-list/shopping-list.service';
import {
  IonItem,
  IonCheckbox,
  IonLabel,
  IonIcon,
  IonButton,
} from '@ionic/angular/standalone';
import { ShoppingRecipe } from '@recipes/models/shopping-recipe.model';
import { addIcons } from 'ionicons';
import { arrowForward, cartOutline } from 'ionicons/icons';
import { TranslatePipe } from '@shared/translate/translate-pipe';

@Component({
  selector: 'app-shopping-recipe-card',
  imports: [IonButton, IonIcon, IonItem, IonCheckbox, IonLabel, TranslatePipe],
  templateUrl: './shopping-recipe-card.component.html',
  styleUrls: ['./shopping-recipe-card.component.scss'],
})
export class ShoppingRecipeCardComponent {
  readonly recipe = input.required<ShoppingRecipe>();
  readonly shoppingState = input.required<ShoppingRecipeState>();

  readonly toRecipe = output<ShoppingRecipe>();

  readonly ingredients = computed(() => this.recipe().ingredients);

  private readonly _service = inject(ShoppingListService);

  constructor() {
    addIcons({ cartOutline, arrowForward });
  }

  isIngredientChecked(ingredientId: number) {
    return this._service.isIngredientChecked(
      this.recipe().sourceId,
      ingredientId,
    );
  }

  async toggleIngredient(ev: Event, ingredientId: number) {
    ev.stopPropagation();
    await this._service.toggleIngredient(this.recipe().sourceId, ingredientId);
  }

  goToRecipe() {
    this.toRecipe.emit(this.recipe());
  }
}
