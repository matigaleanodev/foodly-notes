import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';

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
  readonly skeletonCards = Array.from({ length: 12 });

  readonly _translator = inject(TranslateService);
  readonly _recipes = inject(RecipeService);
  readonly _favorites = inject(FavoritesService);

  readonly subtitle = computed(() => {
    const recipe = this._recipes.recipeSelected();

    return recipe
      ? `${this._translator.translate('xBasadaEn')}: ${recipe.title}`
      : this._translator.translate('xRecetasRecomendadas');
  });

  constructor() {
    effect(() => {
      const sourceId = Number(this.id());

      if (!sourceId) {
        this.recipes.set([]);
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
    const isFav = this._favorites.isFavorite(receta.sourceId);
    if (isFav) {
      this._favorites.removeFavorite(receta.sourceId);
    } else {
      this._favorites.addFavorite(receta);
    }
  }

  toSimilarRecipes(recipe: SimilarRecipe) {
    this._recipes.selectRecipe(recipe);

    this._recipes.toSimilarRecipes(recipe.sourceId);
  }

  detalleReceta({ sourceId }: SimilarRecipe) {
    this._recipes.toRecipeDetail(sourceId);
  }

  private _loadSimilarRecipes(
    sourceId: number,
    showSkeleton: boolean,
    onComplete?: () => void,
  ) {
    if (showSkeleton) {
      this.isLoading.set(true);
    }

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
        error: () => this.recipes.set([]),
      });
  }
}
