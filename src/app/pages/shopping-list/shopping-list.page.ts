import { Component, computed, inject } from '@angular/core';
import {
  IonContent,
  IonButtons,
  IonBackButton,
  IonToolbar,
  IonHeader,
  IonMenuButton,
  IonCol,
  RefresherCustomEvent,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { ShoppingListService } from './services/shopping-list/shopping-list.service';
import { ShoppingRecipeCardComponent } from './components/shopping-recipe-card/shopping-recipe-card.component';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { ShoppingRecipesService } from './services/shopping-recipe/shopping-recipe.service';
import { LoadingService } from '@shared/services/loading/loading.service';
import { TranslatePipe } from '@shared/translate/translate-pipe';
import { EmptyStatesComponent } from '@shared/components/empty-states/empty-states.component';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.page.html',
  styleUrls: ['./shopping-list.page.scss'],
  standalone: true,
  imports: [
    IonRefresherContent,
    IonRefresher,
    IonCol,
    IonMenuButton,
    IonHeader,
    IonToolbar,
    IonBackButton,
    IonButtons,
    IonContent,
    ShoppingRecipeCardComponent,
    TranslatePipe,
    EmptyStatesComponent,
  ],
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

  onRefresh(event: RefresherCustomEvent) {
    this._favorites.loadFavorites().then(() => {
      this._state.init();
      this._recipes.refreshSync().subscribe({
        next: () => {
          event.target.complete();
        },
        error: () => {
          event.target.complete();
        },
      });
    });
  }

  getShoppingState(recipeId: number) {
    return this.shoppingState().find((s) => s.recipeId === recipeId)!;
  }
}
