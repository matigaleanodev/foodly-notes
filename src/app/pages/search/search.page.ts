import { Component, effect, inject, input, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  readonly errorStateKey = signal<string | null>(null);
  readonly skeletonCards = Array.from({ length: 12 });

  readonly _recipes = inject(RecipeService);
  readonly _favorites = inject(FavoritesService);
  readonly _route = inject(ActivatedRoute);

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
    this._recipes.openSimilarRecipes(recipe, { returnTo: this._currentRoute() });
  }

  toRecipeDetail({ sourceId }: DailyRecipe) {
    this._recipes.toRecipeDetail(sourceId, { returnTo: this._currentRoute() });
  }

  searchNewRecipes(query: string) {
    this._recipes.searchRecipes(query);
  }

  readonly emptyStateKey = (): string => {
    if (this.errorStateKey()) {
      return this.errorStateKey() ?? 'xErrorBusquedaRecetas';
    }

    if (!this.q().trim()) {
      return 'xBuscaTuProximaReceta';
    }

    return 'xSinResultadosBusqueda';
  };

  private _loadSearch(query: string) {
    if (!query) {
      this.recipes.set([]);
      this.errorStateKey.set(null);
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this.errorStateKey.set(null);
    this._recipes
      .refreshSearch(query)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (recipes) => this.recipes.set(recipes),
        error: () => {
          this.recipes.set([]);
          this.errorStateKey.set('xErrorBusquedaRecetas');
        },
      });
  }

  private _currentRoute() {
    const query = this.q().trim() || this._route.snapshot.queryParamMap.get('q')?.trim();

    if (!query) {
      return '/search';
    }

    return `/search?q=${encodeURIComponent(query)}`;
  }
}
