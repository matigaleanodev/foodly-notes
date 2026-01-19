import { inject, Injectable, signal } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { RecipeInfo } from '@shared/models/recipe.model';

const KEY_FAVORITOS = 'FAVORITOS';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly _storage = inject(StorageService);

  readonly favoritos = signal<RecipeInfo[]>([]);

  async cargarFavoritos() {
    const favoritos = await this._storage.getItem<RecipeInfo[]>(KEY_FAVORITOS);

    this.favoritos.set(favoritos ?? []);
  }

  agregarFavorito(recipe: RecipeInfo) {
    const favoritos = this.favoritos();

    if (favoritos.some(({ id }) => id === recipe.id)) {
      return;
    }

    const nuevaLista = [...favoritos, recipe];
    this.actualizarFavoritos(nuevaLista);
  }

  removerFavorito(recipe: RecipeInfo) {
    const favoritos = this.favoritos().filter(({ id }) => id !== recipe.id);

    this.actualizarFavoritos(favoritos);
  }

  private async actualizarFavoritos(nuevaLista: RecipeInfo[]) {
    this.favoritos.set(nuevaLista);

    await this._storage.setItem<RecipeInfo[]>(KEY_FAVORITOS, nuevaLista);
  }
}
