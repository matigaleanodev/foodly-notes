import { inject, Injectable, signal } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { DailyRecipe, isRecipeSummary } from '@recipes/models/daily-recipe.model';

const KEY_favorites = 'FAVORITOS';
export type FavoriteRecipe = Pick<DailyRecipe, 'sourceId' | 'title' | 'image'>;

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly _storage = inject(StorageService);
  private _initialization?: Promise<void>;
  private _updates = Promise.resolve();
  readonly favorites = signal<DailyRecipe[]>([]);

  loadFavorites(): Promise<void> {
    return this._initialization ??= this._storage.getItem<unknown>(KEY_favorites)
      .then(stored => this.favorites.set(Array.isArray(stored) ? stored.filter(isRecipeSummary) : []))
      .catch(error => { this._initialization = undefined; throw error; });
  }

  addFavorite(recipe: DailyRecipe) {
    return this.update(favorites => isRecipeSummary(recipe) && !favorites.some(f => f.sourceId === recipe.sourceId)
      ? [...favorites, recipe] : favorites);
  }

  toggleFavorite(recipe: FavoriteRecipe) {
    return this.update(favorites => !isRecipeSummary(recipe) ? favorites
      : favorites.some(f => f.sourceId === recipe.sourceId)
        ? favorites.filter(f => f.sourceId !== recipe.sourceId) : [...favorites, recipe]);
  }

  removeFavorite(id: number) {
    return this.update(favorites => favorites.filter(f => f.sourceId !== id));
  }

  isFavorite(id: number) {
    return this.favorites().some(recipe => recipe.sourceId === id);
  }

  private update(change: (favorites: DailyRecipe[]) => DailyRecipe[]) {
    // Hydrate before every mutation and serialize writes so deep links and rapid taps preserve data.
    const operation = this._updates.then(async () => {
      await this.loadFavorites();
      const next = change(this.favorites());
      await this._storage.setItem(KEY_favorites, next);
      this.favorites.set(next);
    });
    this._updates = operation.catch(() => undefined);
    return operation;
  }
}
