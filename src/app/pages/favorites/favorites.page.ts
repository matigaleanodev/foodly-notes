import { Component, computed, inject, signal } from '@angular/core';

import {
  IonContent,
  IonRow,
  IonGrid,
  IonCol,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonMenuButton,
} from '@ionic/angular/standalone';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';
import { RecipeCardComponent } from '@shared/components/recipe-card/recipe-card.component';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { TranslatePipe } from '@shared/translate/translate-pipe';
import { EmptyStatesComponent } from '@shared/components/empty-states/empty-states.component';
import { RecipeCardSkeletonComponent } from '@shared/components/recipe-card-skeleton/recipe-card-skeleton.component';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [
    IonBackButton,
    IonMenuButton,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonCol,
    IonGrid,
    IonRow,
    IonContent,
    RecipeCardComponent,
    RecipeCardSkeletonComponent,
    TranslatePipe,
    EmptyStatesComponent,
  ],
})
export class FavoritesPage {
  private readonly _service = inject(FavoritesService);
  private readonly _recipes = inject(RecipeService);

  readonly favorites = computed(() => this._service.favorites());
  readonly isLoading = signal(true);
  readonly skeletonCards = Array.from({ length: 12 });

  async ionViewWillEnter() {
    this.isLoading.set(true);

    try {
      await this._service.loadFavorites();
    } finally {
      this.isLoading.set(false);
    }
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
