import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonGrid,
  IonCol,
  IonRow,
  IonButtons,
  IonBackButton,
  IonMenuButton,
  IonHeader,
  IonToolbar,
  RefresherCustomEvent,
  IonRefresher,
  IonRefresherContent,
  IonFooter,
} from '@ionic/angular/standalone';
import { SimilarRecipe } from '@recipes/models/similar-recipe.model';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { EmptyStatesComponent } from '@shared/components/empty-states/empty-states.component';
import { RecipeCardComponent } from '@shared/components/recipe-card/recipe-card.component';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { TranslatePipe } from '@shared/translate/translate-pipe';
import { TranslateService } from '@shared/translate/translate.service';
import { RecipeCardSkeletonComponent } from '@shared/components/recipe-card-skeleton/recipe-card-skeleton.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-similar',
  templateUrl: './similar.page.html',
  styleUrls: ['./similar.page.scss'],
  standalone: true,
  imports: [
    IonFooter,
    IonRefresherContent,
    IonRefresher,
    IonToolbar,
    IonHeader,
    IonMenuButton,
    IonBackButton,
    IonButtons,
    IonRow,
    IonCol,
    IonGrid,
    IonContent,
    FormsModule,
    RecipeCardComponent,
    RecipeCardSkeletonComponent,
    TranslatePipe,
    EmptyStatesComponent,
  ],
})
export class SimilarPage {
  readonly id = input<string>('');

  readonly recipes = signal<SimilarRecipe[]>([]);
  readonly isLoading = signal(true);
  readonly errorStateKey = signal<string | null>(null);
  readonly skeletonCards = Array.from({ length: 12 });

  readonly _translator = inject(TranslateService);
  readonly _recipes = inject(RecipeService);
  readonly _favorites = inject(FavoritesService);
  readonly _route = inject(ActivatedRoute);

  readonly subtitle = computed(() => {
    const recipe = this._recipes.recipeSelected();

    return recipe
      ? `${this._translator.translate('xBasadaEn')}: ${recipe.title}`
      : this._translator.translate('xRecetasRecomendadas');
  });
  readonly backHref = computed(
    () => this._route.snapshot.queryParamMap.get('returnTo') ?? '/home',
  );

  constructor() {
    effect(() => {
      const sourceId = Number(this.id());

      if (!sourceId) {
        this.recipes.set([]);
        this.errorStateKey.set(null);
        this.isLoading.set(false);
        return;
      }

      this._loadSimilarRecipes(sourceId, true);
    });
  }

  ionViewWillEnter() {
    this._favorites.loadFavorites();
  }

  onRefresh(event: RefresherCustomEvent) {
    const sourceId = Number(this.id());
    if (!sourceId) {
      event.target.complete();
      return;
    }

    this._loadSimilarRecipes(sourceId, false, () => event.target.complete());
  }
  toggleFavorite(receta: SimilarRecipe) {
    this._favorites.toggleFavorite(receta);
  }

  toSimilarRecipes(recipe: SimilarRecipe) {
    this._recipes.openSimilarRecipes(recipe, { returnTo: this._currentRoute() });
  }

  detalleReceta({ sourceId }: SimilarRecipe) {
    this._recipes.toRecipeDetail(sourceId, { returnTo: this._currentRoute() });
  }

  readonly emptyStateKey = (): string => {
    if (this.errorStateKey()) {
      return this.errorStateKey() ?? 'xErrorRecetasSimilares';
    }

    return 'xSinRecetasSimilares';
  };

  private _loadSimilarRecipes(
    sourceId: number,
    showSkeleton: boolean,
    onComplete?: () => void,
  ) {
    if (showSkeleton) {
      this.isLoading.set(true);
    }

    this.errorStateKey.set(null);

    this._recipes
      .refreshSimilarRecipes(sourceId)
      .pipe(
        finalize(() => {
          if (showSkeleton) {
            this.isLoading.set(false);
          }
          onComplete?.();
        }),
      )
      .subscribe({
        next: (recipes) => this.recipes.set(recipes),
        error: () => {
          this.recipes.set([]);
          this.errorStateKey.set('xErrorRecetasSimilares');
        },
      });
  }

  private _currentRoute() {
    return `/similar/${this.id()}?returnTo=${encodeURIComponent(this.backHref())}`;
  }
}
