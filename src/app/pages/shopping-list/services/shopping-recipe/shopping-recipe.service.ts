import { inject, Injectable, signal } from '@angular/core';
import { ShoppingRecipe } from '@recipes/models/shopping-recipe.model';
import { RecipeApiService } from '@recipes/services/recipe-api/recipe-api.service';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShoppingRecipesService {
  private readonly api = inject(RecipeApiService);
  private readonly favorites = inject(FavoritesService);

  readonly recipes = signal<ShoppingRecipe[]>([]);

  async sync() {
    const favoritos = this.favorites.favoritos();
    const ids = favoritos.map((f) => f.sourceId);

    const current = this.recipes();
    const currentIds = current.map((r) => r.sourceId);

    const filtrados = current.filter((r) => ids.includes(r.sourceId));

    const nuevosIds = ids.filter((id) => !currentIds.includes(id));

    if (nuevosIds.length) {
      const nuevas = await firstValueFrom(
        this.api.getIngredientsForRecipes(nuevosIds),
      );

      this.recipes.set([...filtrados, ...nuevas]);
    } else {
      this.recipes.set(filtrados);
    }
  }

  getRecipe(sourceId: number) {
    return this.recipes().find((r) => r.sourceId === sourceId) ?? null;
  }
}
