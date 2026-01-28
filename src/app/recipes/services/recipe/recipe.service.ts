import { inject, Injectable, signal } from '@angular/core';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';
import { RecipeApiService } from '../recipe-api/recipe-api.service';
import { NavService } from '@shared/services/nav/nav.service';
import { LoadingService } from '@shared/services/loading/loading.service';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private readonly apiService = inject(RecipeApiService);
  private readonly _nav = inject(NavService);
  private readonly _loading = inject(LoadingService);

  readonly recipes = signal<DailyRecipe[]>([]);

  async buscarRecetasDiarias() {
    const loading = await this._loading.show();

    this.apiService
      .getDailyRecipes()
      .pipe(finalize(() => loading.dismiss()))
      .subscribe({
        next: (recetas) => this.recipes.set(recetas),
      });
  }

  async buscarDetalleReceta(sourceId: number) {
    const loading = await this._loading.show();

    return this.apiService
      .getRecipeDetail(sourceId)
      .pipe(finalize(() => loading.dismiss()));
  }
  async buscarRecetasSimilares(sourceId: number) {
    const loading = await this._loading.show();

    return this.apiService
      .getSimilarRecipes(sourceId)
      .pipe(finalize(() => loading.dismiss()));
  }
  recetasSimilares(sourceId: number) {
    this._nav.forward(`similares/${sourceId}`);
  }

  detalleReceta(sourceId: number) {
    this._nav.forward(`recipe/${sourceId}`);
  }
}
