import { Component, computed, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IonContent, IonCol, IonRow, IonGrid } from '@ionic/angular/standalone';
import { RecipeCardComponent } from '@shared/components/recipe-card/recipe-card.component';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { HomeHeroComponent } from './components/home-hero/home-hero.component';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    IonContent,
    FormsModule,
    RecipeCardComponent,
    HomeHeroComponent,
  ],
})
export class HomePage {
  readonly _recipes = inject(RecipeService);
  readonly _favorites = inject(FavoritesService);

  readonly recipes = computed(() => this._recipes.recipes());

  ionViewWillEnter() {
    this._favorites.loadFavorites();
    this._recipes.loadDailyRecipes();
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

  toSearchRecipe(query: string) {
    this._recipes.searchRecipes(query);
  }
}
