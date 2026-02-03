import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
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
  IonRow,
} from '@ionic/angular/standalone';
import { ShoppingListService } from './services/shopping-list/shopping-list.service';
import { ShoppingRecipeCardComponent } from './components/shopping-recipe-card/shopping-recipe-card.component';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { ShoppingRecipesService } from './services/shopping-recipe/shopping-recipe.service';
import { LoadingService } from '@shared/services/loading/loading.service';
import { TranslatePipe } from '@shared/translate/translate-pipe';
import { EmptyStatesComponent } from '@shared/components/empty-states/empty-states.component';
import { TranslateService } from '@shared/translate/translate.service';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { skip, switchMap } from 'rxjs';
import { ShoppingRecipe } from '@recipes/models/shopping-recipe.model';
import { RecipeService } from '@recipes/services/recipe/recipe.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.page.html',
  styleUrls: ['./shopping-list.page.scss'],
  standalone: true,
  imports: [
    IonRow,
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
export class ShoppingListPage implements OnInit {
  private readonly _state = inject(ShoppingListService);
  private readonly _favorites = inject(FavoritesService);
  private readonly _shopping = inject(ShoppingRecipesService);
  private readonly _recipes = inject(RecipeService);
  private readonly _loading = inject(LoadingService);
  private readonly _translate = inject(TranslateService);

  readonly currentLang = computed(() => this._translate.currentLang());

  readonly currentLang$ = toObservable(this.currentLang);
  private readonly destroyRef = inject(DestroyRef);

  readonly shoppingState = computed(() => this._state.shoppingState());
  readonly favoritos = computed(() => this._favorites.favorites());

  readonly shoppingRecipes = computed(() => this._shopping.recipes());

  readonly shoppingList = computed(() =>
    this.shoppingRecipes().map((recipe) => ({
      recipe,
      state: this.getShoppingState(recipe.sourceId),
    })),
  );

  ngOnInit() {
    this.currentLang$
      .pipe(
        skip(1),
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this._shopping.refreshSync(true)),
      )
      .subscribe();
  }

  async ionViewWillEnter() {
    const loading = await this._loading.show();

    try {
      await this._favorites.loadFavorites();
      await this._state.init();
      await this._shopping.sync();
    } finally {
      loading.dismiss();
    }
  }

  onRefresh(event: RefresherCustomEvent) {
    this._favorites.loadFavorites().then(() => {
      this._state.init();
      this._shopping.refreshSync().subscribe({
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

  toRecipeDetail(recipe: ShoppingRecipe) {
    this._recipes.selectRecipe({ ...recipe, image: '' });

    this._recipes.toRecipeDetail(recipe.sourceId);
  }
}
