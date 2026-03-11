import {
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  signal,
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
} from '@ionic/angular/standalone';
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
import { Language } from '@shared/translate/language.model';
import { TranslatePipe } from '@shared/translate/translate-pipe';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.page.html',
  styleUrls: ['./recipe.page.scss'],
  standalone: true,
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

  private readonly _initialLang = signal<Language | null>(null);
  readonly backHref = computed(
    () => this._route.snapshot.queryParamMap.get('returnTo') ?? '/home',
  );

  constructor() {
    effect(() => {
      const sourceId = Number(this._routeParamMap().get('id'));
      if (!sourceId) {
        this.recipe.set(null);
        this.errorStateKey.set('xErrorActualizacionReceta');
        this.isInitialLoading.set(false);
        return;
      }

      this.isInitialLoading.set(true);
      this.errorStateKey.set(null);
      this._recipes.loadRecipeDetail(sourceId).subscribe({
        next: (recipe) => {
          this.recipe.set(recipe);
          this.errorStateKey.set(null);
          this.isInitialLoading.set(false);
        },
        error: () => {
          this.recipe.set(null);
          this.errorStateKey.set('xErrorActualizacionReceta');
          this.isInitialLoading.set(false);
        },
      });
    });

    effect(() => {
      const lang = this._translate.currentLang();
      if (!lang) return;

      if (this._initialLang() === null) {
        this._initialLang.set(lang);
        return;
      }

      if (lang !== this._initialLang()) {
        const currentRecipe = this.recipe();
        if (!currentRecipe) {
          this._initialLang.set(lang);
          return;
        }

        const { sourceId } = currentRecipe;
        this._recipes.refreshRecipeDetail(sourceId).subscribe({
          next: (recipe) => {
            this.recipe.set(recipe);
            this.errorStateKey.set(null);
          },
          error: () => this.errorStateKey.set('xErrorActualizacionReceta'),
        });

        this._initialLang.set(lang);
      }
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

    const { sourceId } = currentRecipe;
    this._recipes.refreshRecipeDetail(sourceId).subscribe({
      next: (recipe) => {
        this.recipe.set(recipe);
        this.errorStateKey.set(null);
        event.target.complete();
      },
      error: () => {
        this.errorStateKey.set('xErrorActualizacionReceta');
        event.target.complete();
      },
    });
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
