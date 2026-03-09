import { Component, effect, inject, input, signal } from '@angular/core';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonFooter,
  IonHeader,
  IonButtons,
  IonBackButton,
  IonToolbar,
  IonMenuButton,
} from '@ionic/angular/standalone';
import { HomeHeroComponent } from '@pages/home/components/home-hero/home-hero.component';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';
import { SearchRecipe } from '@recipes/models/search-recipe.model';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { EmptyStatesComponent } from '@shared/components/empty-states/empty-states.component';
import { RecipeCardComponent } from '@shared/components/recipe-card/recipe-card.component';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { RecipeCardSkeletonComponent } from '@shared/components/recipe-card-skeleton/recipe-card-skeleton.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [
    IonMenuButton,
    IonToolbar,
    IonBackButton,
    IonButtons,
    IonHeader,
    IonFooter,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    HomeHeroComponent,
    RecipeCardComponent,
    RecipeCardSkeletonComponent,
    EmptyStatesComponent,
  ],
})
export class SearchPage {
  readonly q = input<string>('');

  readonly recipes = signal<SearchRecipe[]>([]);
  readonly isLoading = signal(true);
  readonly skeletonCards = Array.from({ length: 12 });

  readonly _recipes = inject(RecipeService);
  readonly _favorites = inject(FavoritesService);

  constructor() {
    effect(() => {
      this._loadSearch(this.q().trim());
    });
  }

  ionViewWillEnter() {
    this._favorites.loadFavorites();
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

  searchNewRecipes(query: string) {
    this._recipes.searchRecipes(query);
  }

  private _loadSearch(query: string) {
    if (!query) {
      this.recipes.set([]);
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this._recipes
      .refreshSearch(query)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (recipes) => this.recipes.set(recipes),
        error: () => this.recipes.set([]),
      });
  }
}
