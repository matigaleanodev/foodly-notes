import { inject, Injectable, signal } from '@angular/core';
import { DailyRecipe, StoredDaily } from '@recipes/models/daily-recipe.model';
import { RecipeApiService } from '../recipe-api/recipe-api.service';
import { NavService } from '@shared/services/nav/nav.service';
import { LoadingService } from '@shared/services/loading/loading.service';
import { finalize, map } from 'rxjs';
import { StorageService } from '@shared/services/storage/storage.service';

const DAILY_KEY = 'daily_recipes';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private readonly _api = inject(RecipeApiService);
  private readonly _nav = inject(NavService);
  private readonly _loading = inject(LoadingService);
  private readonly _storage = inject(StorageService);

  readonly recipes = signal<DailyRecipe[]>([]);

  readonly recipeSelected = signal<DailyRecipe | null>(null);

  async loadDailyRecipes() {
    const loading = await this._loading.show();

    const stored = await this._getStoredDaily();

    if (stored && this._isToday(stored.date)) {
      this.recipes.set(stored.recipes);
      loading.dismiss();
      return;
    }

    this._api
      .getDailyRecipes()
      .pipe(finalize(() => loading.dismiss()))
      .subscribe({
        next: async (recetas) => {
          this.recipes.set(recetas);
          await this._storeDaily(recetas);
        },
        error: () => {
          if (stored) {
            this.recipes.set(stored.recipes);
          }
        },
      });
  }

  async loadRecipeDeatil(sourceId: number) {
    const loading = await this._loading.show();

    return this._api
      .getRecipeDetail(sourceId)
      .pipe(finalize(() => loading.dismiss()));
  }

  async loadSimilaRecipes(sourceId: number) {
    const loading = await this._loading.show();

    return this._api
      .getSimilarRecipes(sourceId)
      .pipe(finalize(() => loading.dismiss()));
  }

  async queryReacipeSearch(query: string) {
    const loading = await this._loading.show();

    return this._api
      .getRecipesByQuery(query)
      .pipe(finalize(() => loading.dismiss()));
  }

  refreshDailyRecipes() {
    return this._api.getDailyRecipes().pipe(
      map((recipes) => {
        this.recipes.set(recipes);
        return recipes;
      }),
    );
  }

  refreshSimilarRecipes(sourceId: number) {
    return this._api.getSimilarRecipes(sourceId);
  }

  refreshRecipeDetail(sourceId: number) {
    return this._api.getRecipeDetail(sourceId);
  }

  refreshSearch(query: string) {
    return this._api.getRecipesByQuery(query);
  }

  searchRecipes(query: string) {
    this._nav.search(query);
  }

  selectRecipe(recipe: DailyRecipe) {
    this.recipeSelected.set(recipe);
  }

  toSimilarRecipes(sourceId: number) {
    this._nav.forward(`similar/${sourceId}`);
  }

  toRecipeDetail(sourceId: number) {
    this._nav.forward(`recipe/${sourceId}`);
  }

  private async _getStoredDaily() {
    return this._storage.getItem<StoredDaily>(DAILY_KEY);
  }

  private async _storeDaily(recipes: DailyRecipe[]) {
    const daily: StoredDaily = {
      recipes,
      date: this._todayString(),
    };

    await this._storage.setItem(DAILY_KEY, daily);
  }

  private _isToday(date: string) {
    return date === this._todayString();
  }

  private _todayString() {
    return new Date().toISOString().split('T')[0];
  }
}
