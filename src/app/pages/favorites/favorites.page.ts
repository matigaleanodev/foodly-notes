import { Component, computed, inject } from '@angular/core';

import { IonContent, IonRow, IonGrid, IonCol } from '@ionic/angular/standalone';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';
import { RecipeCardComponent } from '@shared/components/recipe-card/recipe-card.component';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { RecipeService } from '@recipes/services/recipe/recipe.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [IonCol, IonGrid, IonRow, IonContent, RecipeCardComponent],
})
export class FavoritesPage {
  private readonly _service = inject(FavoritesService);
  private readonly _recipes = inject(RecipeService);

  readonly favoritos = computed(() => this._service.favorites());

  ionViewWillEnter() {
    this._service.loadFavorites();
  }

  toggleFav(receta: DailyRecipe) {
    const isFavorite = this._service.isFavorite(receta.sourceId);
    if (isFavorite) {
      this._service.removeFavorite(receta.sourceId);
    } else {
      this._service.addFavorite(receta);
    }
  }

  toSimilarRecipes(recipe: DailyRecipe) {
    this._recipes.selectRecipe(recipe);

    this._recipes.toSimilarRecipes(recipe.sourceId);
  }

  detalleReceta({ sourceId }: DailyRecipe) {
    this._recipes.toRecipeDetail(sourceId);
  }
}
