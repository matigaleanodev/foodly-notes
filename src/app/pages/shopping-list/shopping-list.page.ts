import { Component, computed, inject } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { ShoppingListService } from './services/shopping-list/shopping-list.service';
import { ShoppingRecipeCardComponent } from './components/shopping-recipe-card/shopping-recipe-card.component';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { ShoppingRecipesService } from './services/shopping-recipe/shopping-recipe.service';
import { LoadingService } from '@shared/services/loading/loading.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.page.html',
  styleUrls: ['./shopping-list.page.scss'],
  standalone: true,
  imports: [IonContent, ShoppingRecipeCardComponent],
})
export class ShoppingListPage {
  private readonly _state = inject(ShoppingListService);
  private readonly _favorites = inject(FavoritesService);
  private readonly _recipes = inject(ShoppingRecipesService);
  private readonly _loading = inject(LoadingService);

  readonly shoppingState = computed(() => this._state.shoppingState());
  readonly favoritos = computed(() => this._favorites.favorites());

  readonly shoppingRecipes = computed(() => this._recipes.recipes());

  readonly shoppingList = computed(() =>
    this.shoppingRecipes().map((recipe) => ({
      recipe,
      state: this.getShoppingState(recipe.sourceId),
    })),
  );

  async ionViewWillEnter() {
    const loading = await this._loading.show();

    try {
      await this._favorites.loadFavorites();
      await this._state.init();
      await this._recipes.sync();
    } finally {
      loading.dismiss();
    }
  }

  getShoppingState(recipeId: number) {
    return this.shoppingState().find((s) => s.recipeId === recipeId)!;
  }
}
