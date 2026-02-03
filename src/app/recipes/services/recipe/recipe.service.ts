import { inject, Injectable, signal } from '@angular/core';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';
import { RecipeApiService } from '../recipe-api/recipe-api.service';
import { NavService } from '@shared/services/nav/nav.service';
import { LoadingService } from '@shared/services/loading/loading.service';
import { finalize, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private readonly _api = inject(RecipeApiService);
  private readonly _nav = inject(NavService);
  private readonly _loading = inject(LoadingService);

  readonly recipes = signal<DailyRecipe[]>([]);

  readonly recipeSelected = signal<DailyRecipe | null>(null);

  async loadDailyRecipes() {
    const loading = await this._loading.show();

    this._api
      .getDailyRecipes()
      .pipe(finalize(() => loading.dismiss()))
      .subscribe({
        next: (recetas) => this.recipes.set(recetas),
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
}
