import { Component, inject, input, linkedSignal } from '@angular/core';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonFooter,
} from '@ionic/angular/standalone';
import { HomeHeroComponent } from '@pages/home/components/home-hero/home-hero.component';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';
import { SearchRecipe } from '@recipes/models/search-recipe.model';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { EmptyStatesComponent } from '@shared/components/empty-states/empty-states.component';
import { RecipeCardComponent } from '@shared/components/recipe-card/recipe-card.component';
import { FavoritesService } from '@shared/services/favorites/favorites.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [
    IonFooter,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    HomeHeroComponent,
    RecipeCardComponent,
    EmptyStatesComponent,
  ],
})
export class SearchPage {
  readonly data = input<SearchRecipe[]>();

  readonly recipes = linkedSignal(() => this.data());

  readonly _recipes = inject(RecipeService);
  readonly _favorites = inject(FavoritesService);

  ionViewWillEnter() {
    this._favorites.loadFavorites();
  }

  toggleFavorite(recipe: DailyRecipe) {
    const isFav = this._favorites.isFavorite(recipe.sourceId);
    if (isFav) {
      this._favorites.removeFavorite(recipe.sourceId);
    } else {
      this._favorites.addFavorite(recipe);
    }
  }

  toSimilarRecipes(recipe: DailyRecipe) {
    this._recipes.selectRecipe(recipe);
    this._recipes.toSimilarRecipes(recipe.sourceId);
  }

  toRecipeDetail({ sourceId }: DailyRecipe) {
    this._recipes.toRecipeDetail(sourceId);
  }

  async searchNewRecipes(query: string) {
    const request = await this._recipes.queryReacipeSearch(query);

    request.subscribe({
      next: (recipes) => this.recipes.set(recipes),
    });
  }
}
