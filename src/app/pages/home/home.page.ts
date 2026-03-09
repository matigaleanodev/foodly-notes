import { Component, computed, inject, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonCol,
  IonRow,
  IonGrid,
  IonRefresher,
  IonRefresherContent,
  RefresherCustomEvent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
} from '@ionic/angular/standalone';
import { RecipeCardComponent } from '@shared/components/recipe-card/recipe-card.component';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { HomeHeroComponent } from './components/home-hero/home-hero.component';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';
import { EmptyStatesComponent } from '@shared/components/empty-states/empty-states.component';
import { RecipeCardSkeletonComponent } from '@shared/components/recipe-card-skeleton/recipe-card-skeleton.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonMenuButton,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonRefresherContent,
    IonRefresher,
    IonGrid,
    IonRow,
    IonCol,
    IonContent,
    FormsModule,
    RecipeCardComponent,
    RecipeCardSkeletonComponent,
    HomeHeroComponent,
    EmptyStatesComponent,
  ],
})
export class HomePage {
  readonly _recipes = inject(RecipeService);
  readonly _favorites = inject(FavoritesService);

  readonly recipes = computed(() => this._recipes.recipes());
  readonly isLoading = signal(true);
  readonly skeletonCards = Array.from({ length: 12 });

  async ionViewWillEnter() {
    this._favorites.loadFavorites();
    this.isLoading.set(true);

    try {
      await this._recipes.loadDailyRecipes();
    } finally {
      this.isLoading.set(false);
    }
  }

  onRefresh(event: RefresherCustomEvent) {
    this._recipes.refreshDailyRecipes().subscribe({
      next: () => {
        event.target.complete();
      },
      error: () => {
        event.target.complete();
      },
    });
  }

  toggleFavorite(recipe: DailyRecipe) {
    this._favorites.toggleFavorite(recipe);
  }

  toSimilarRecipes(recipe: DailyRecipe) {
    this._recipes.openSimilarRecipes(recipe);
  }

  toRecipeDetail({ sourceId }: DailyRecipe) {
    this._recipes.toRecipeDetail(sourceId);
  }

  toSearchRecipe(query: string) {
    this._recipes.searchRecipes(query);
  }
}
