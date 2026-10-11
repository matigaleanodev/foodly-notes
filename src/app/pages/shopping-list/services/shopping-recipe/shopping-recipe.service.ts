import { inject, Injectable, signal } from '@angular/core';
import { ShoppingRecipe } from '@recipes/models/shopping-recipe.model';
import { RecipeApiService } from '@recipes/services/recipe-api/recipe-api.service';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { firstValueFrom, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShoppingRecipesService {
  private readonly api = inject(RecipeApiService);
  private readonly favorites = inject(FavoritesService);

  readonly recipes = signal<ShoppingRecipe[]>([]);

  private requestVersion = 0;

  async sync() {
    await firstValueFrom(this.refreshSync());
  }

  refreshSync(force = false) {
    const version = ++this.requestVersion;
    const favoritos = this.favorites.favorites();
    const ids = favoritos.map((f) => f.sourceId);

    const current = this.recipes();
    const currentIds = current.map((r) => r.sourceId);

    const filtrados = current.filter((r) => ids.includes(r.sourceId));

    const nuevosIds = force
      ? ids
      : ids.filter((id) => !currentIds.includes(id));

    if (!nuevosIds.length && !force) {
      this.recipes.set(filtrados);
      return of(filtrados);
    }

    return this.api.getIngredientsForRecipes(nuevosIds).pipe(
      map((nuevas) => {
        const result = force ? nuevas : [...filtrados, ...nuevas];
        if (version === this.requestVersion) this.recipes.set(result);
        return result;
      }),
    );
  }

  getRecipe(sourceId: number) {
    return this.recipes().find((r) => r.sourceId === sourceId) ?? null;
  }
}
