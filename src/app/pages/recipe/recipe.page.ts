import {
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  signal,
  ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonFooter,
  IonGrid,
  IonCol,
  IonRow,
  IonToolbar,
  IonHeader,
  IonBackButton,
  IonButtons,
  IonMenuButton,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  RefresherCustomEvent,
} from '@ionic/angular';
import { RecipeMetaComponent } from './components/recipe-meta/recipe-meta.component';
import { RecipeHeroComponent } from './components/recipe-hero/recipe-hero.component';
import { RecipeIngredientsComponent } from './components/recipe-ingredients/recipe-ingredients.component';
import { RecipeInstructionsComponent } from './components/recipe-instructions/recipe-instructions.component';
import { RecipeAttrComponent } from './components/recipe-attr/recipe-attr.component';
import { RecipeMetaExtendedComponent } from './components/recipe-meta-extended/recipe-meta-extended.component';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { RecipeDetail } from '@recipes/models/recipe-detail.model';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { TranslateService } from '@shared/translate/translate.service';
import { RecipeSummaryComponent } from './components/recipe-summary/recipe-summary.component';
import { Subscription } from 'rxjs';
import { TranslatePipe } from '@shared/translate/translate-pipe';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.page.html',
  styleUrls: ['./recipe.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    IonRefresherContent,
    IonRefresher,
    IonSpinner,
    IonButtons,
    IonMenuButton,
    IonBackButton,
    IonHeader,
    IonToolbar,
    IonRow,
    IonCol,
    IonGrid,
    IonFooter,
    IonContent,
    FormsModule,
    RecipeMetaComponent,
    RecipeHeroComponent,
    RecipeIngredientsComponent,
    RecipeInstructionsComponent,
    RecipeAttrComponent,
    RecipeMetaExtendedComponent,
    RecipeSummaryComponent,
    TranslatePipe,
  ],
})
export class RecipePage {
  private readonly _route = inject(ActivatedRoute);
  private readonly _routeParamMap = toSignal(this._route.paramMap, {
    initialValue: this._route.snapshot.paramMap,
  });

  readonly recipe = linkedSignal<RecipeDetail | null>(() => null);
  readonly errorStateKey = signal<string | null>(null);
  readonly isInitialLoading = signal(true);

  private readonly _favorites = inject(FavoritesService);
  private readonly _recipes = inject(RecipeService);
  private readonly _translate = inject(TranslateService);

  readonly imageUrl = computed(() => {
    const recipe = this.recipe();
    if (!recipe) return '';

    return recipe.image;
  });

  private _request?: Subscription;
  private _lastId?: number;
  readonly backHref = computed(
    () => this._route.snapshot.queryParamMap.get('returnTo') ?? '/home',
  );

  constructor() {
    effect(onCleanup => {
      this._translate.currentLang();
      const sourceId = Number(this._routeParamMap().get('id'));
      if (!Number.isSafeInteger(sourceId) || sourceId <= 0) {
        this.recipe.set(null);
        this.errorStateKey.set('xErrorActualizacionReceta');
        this.isInitialLoading.set(false);
        return;
      }
      const refresh = this._lastId === sourceId;
      this._lastId = sourceId;
      if (!refresh) this.recipe.set(null);
      this.loadRecipe(sourceId, refresh);
      onCleanup(() => this._request?.unsubscribe());
    });
  }

  async ionViewWillEnter() { await this._favorites.loadFavorites(); }

  retry() { this.loadRecipe(Number(this._routeParamMap().get('id')), !!this.recipe()); }

  private loadRecipe(sourceId: number, refresh: boolean, complete?: () => void) {
    this._request?.unsubscribe();
    this.isInitialLoading.set(!this.recipe());
    this.errorStateKey.set(null);
    const request = refresh ? this._recipes.refreshRecipeDetail(sourceId) : this._recipes.loadRecipeDetail(sourceId);
    this._request = request.subscribe({
      next: recipe => {
        this.recipe.set(recipe);
        this.isInitialLoading.set(false);
        complete?.();
      },
      error: () => {
        this.errorStateKey.set('xErrorActualizacionReceta');
        this.isInitialLoading.set(false);
        complete?.();
      },
    });
  }

  isFavorite = computed(() =>
    this.recipe() ? this._favorites.isFavorite(this.recipe()!.sourceId) : false,
  );

  onRefresh(event: RefresherCustomEvent) {
    const currentRecipe = this.recipe();
    if (!currentRecipe) {
      event.target.complete();
      return;
    }

    this.loadRecipe(currentRecipe.sourceId, true, () => event.target.complete());
  }

  toggleFavorite() {
    const currentRecipe = this.recipe();
    if (!currentRecipe) return;

    const { sourceId, title, image } = currentRecipe;
    this._favorites.toggleFavorite({ sourceId, title, image });
  }

  toSimilaRecipes() {
    const currentRecipe = this.recipe();
    if (!currentRecipe) return;

    const { sourceId, title, image } = currentRecipe;
    this._recipes.openSimilarRecipes(
      { sourceId, title, image },
      { returnTo: this._currentRoute() },
    );
  }

  private _currentRoute() {
    const currentRecipe = this.recipe();
    if (!currentRecipe) {
      return '/recipe';
    }

    return `/recipe/${currentRecipe.sourceId}?returnTo=${encodeURIComponent(this.backHref())}`;
  }
}
