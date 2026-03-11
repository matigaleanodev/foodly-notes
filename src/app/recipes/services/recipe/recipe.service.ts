import { inject, Injectable, signal } from '@angular/core';
import { DailyRecipe, StoredDaily } from '@recipes/models/daily-recipe.model';
import { RecipeApiService } from '../recipe-api/recipe-api.service';
import { NavService } from '@shared/services/nav/nav.service';
import { firstValueFrom, map } from 'rxjs';
import { StorageService } from '@shared/services/storage/storage.service';
import { TranslateService } from '@shared/translate/translate.service';
import { Language } from '@shared/translate/language.model';

interface RecipeNavigationOptions {
  returnTo?: string;
}

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private readonly _api = inject(RecipeApiService);
  private readonly _nav = inject(NavService);
  private readonly _storage = inject(StorageService);
  private readonly _translate = inject(TranslateService);

  readonly recipes = signal<DailyRecipe[]>([]);

  readonly recipeSelected = signal<DailyRecipe | null>(null);

  async loadDailyRecipes() {
    const lang = await this._translate.whenReady();
    const stored = await this._getStoredDaily(lang);

    if (stored && this._isToday(stored.date)) {
      this.recipes.set(stored.recipes);
      return;
    }

    try {
      const recetas = await firstValueFrom(this._api.getDailyRecipes());
      this.recipes.set(recetas);
      await this._storeDaily(recetas, lang);
    } catch {
      if (stored) {
        this.recipes.set(stored.recipes);
      }
    }
  }

  loadRecipeDetail(sourceId: number) {
    return this._api.getRecipeDetail(sourceId);
  }

  loadSimilarRecipes(sourceId: number) {
    return this._api.getSimilarRecipes(sourceId);
  }

  searchRecipesByQuery(query: string) {
    return this._api.getRecipesByQuery(query);
  }

  refreshDailyRecipes() {
    return this._api.getDailyRecipes().pipe(
      map((recipes) => {
        this.recipes.set(recipes);
        void this._translate.whenReady().then((lang) => this._storeDaily(recipes, lang));
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

  openSimilarRecipes(
    recipe: DailyRecipe,
    options?: RecipeNavigationOptions,
  ) {
    this.selectRecipe(recipe);
    this.toSimilarRecipes(recipe.sourceId, options);
  }

  toSimilarRecipes(sourceId: number, options?: RecipeNavigationOptions) {
    this._nav.forward(`similar/${sourceId}`, {
      returnTo: options?.returnTo,
    });
  }

  toRecipeDetail(sourceId: number, options?: RecipeNavigationOptions) {
    this._nav.forward(`recipe/${sourceId}`, {
      returnTo: options?.returnTo,
    });
  }

  private async _getStoredDaily(lang: Language) {
    return this._storage.getItem<StoredDaily>(this._dailyKey(lang));
  }

  private async _storeDaily(recipes: DailyRecipe[], lang: Language) {
    const daily: StoredDaily = {
      recipes,
      date: this._todayString(),
    };

    await this._storage.setItem(this._dailyKey(lang), daily);
  }

  private _isToday(date: string) {
    return date === this._todayString();
  }

  private _todayString() {
    return new Date().toISOString().split('T')[0];
  }

  private _dailyKey(lang: Language) {
    return `daily_recipes_${lang}`;
  }
}
