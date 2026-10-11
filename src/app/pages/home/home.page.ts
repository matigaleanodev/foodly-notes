import { Component, computed, effect, inject, signal, ChangeDetectionStrategy } from '@angular/core';

import { TranslateService } from '@shared/translate/translate.service';
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
} from '@ionic/angular';
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
  changeDetection: ChangeDetectionStrategy.Eager,
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
  private static readonly returnTo = '/home';

  readonly _recipes = inject(RecipeService);
  readonly _favorites = inject(FavoritesService);

  readonly recipes = computed(() => this._recipes.recipes());
  readonly isLoading = signal(true);
  readonly skeletonCards = Array.from({ length: 12 });

  readonly errorStateKey = signal<string | null>(null);
  private readonly _translate = inject(TranslateService);
  private _lastLang = this._translate.currentLang();

  constructor() {
    effect(() => {
      const lang = this._translate.currentLang();
      if (lang !== this._lastLang) {
        this._lastLang = lang;
        void this.loadRecipes();
      }
    });
  }

  async ionViewWillEnter() {
    await this._favorites.loadFavorites();
    await this.loadRecipes();
  }

  private _request = 0;

  async loadRecipes() {
    const request = ++this._request;
    this.isLoading.set(true);
    this.errorStateKey.set(null);

    try {
      await this._recipes.loadDailyRecipes();
    } catch {
      if (request === this._request) this.errorStateKey.set('xErrorBusquedaRecetas');
    } finally {
      if (request === this._request) this.isLoading.set(false);
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
    this._recipes.openSimilarRecipes(recipe, {
      returnTo: HomePage.returnTo,
    });
  }

  toRecipeDetail({ sourceId }: DailyRecipe) {
    this._recipes.toRecipeDetail(sourceId, {
      returnTo: HomePage.returnTo,
    });
  }

  toSearchRecipe(query: string) {
    this._recipes.searchRecipes(query);
  }
}
