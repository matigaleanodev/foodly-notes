import { inject, Injectable, signal } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';

const KEY_favorites = 'FAVORITOS';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly _storage = inject(StorageService);

  readonly favorites = signal<DailyRecipe[]>([]);

  async loadFavorites() {
    const favorites = await this._storage.getItem<DailyRecipe[]>(KEY_favorites);

    this.favorites.set(favorites ?? []);
  }

  addFavorite(recipe: DailyRecipe) {
    const favs = this.favorites();

    if (favs.some(({ sourceId }) => sourceId === recipe.sourceId)) {
      return;
    }

    const nuevaLista = [...favs, recipe];
    this.uploadFavorites(nuevaLista);
  }

  removeFavorite(id: number) {
    const favoritos = this.favorites().filter(
      ({ sourceId }) => sourceId !== id,
    );

    this.uploadFavorites(favoritos);
  }

  isFavorite(id: number) {
    const favs = this.favorites();

    return favs.some(({ sourceId }) => sourceId === id);
  }

  private async uploadFavorites(nuevaLista: DailyRecipe[]) {
    this.favorites.set(nuevaLista);

    await this._storage.setItem<DailyRecipe[]>(KEY_favorites, nuevaLista);
  }
}
