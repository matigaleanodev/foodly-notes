import {
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  readonly data = input.required<RecipeDetail>();

  readonly recipe = linkedSignal(() => this.data());
  readonly errorStateKey = signal<string | null>(null);

  private readonly _favorites = inject(FavoritesService);
  private readonly _recipes = inject(RecipeService);
  private readonly _translate = inject(TranslateService);
  private readonly _route = inject(ActivatedRoute);

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
      const lang = this._translate.currentLang();
      if (!lang) return;

      if (this._initialLang() === null) {
        this._initialLang.set(lang);
        return;
      }

      if (lang !== this._initialLang()) {
        const { sourceId } = this.data();
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
    this._favorites.isFavorite(this.recipe().sourceId),
  );

  onRefresh(event: RefresherCustomEvent) {
    const { sourceId } = this.data();
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
    const { sourceId, title, image } = this.recipe();
    this._favorites.toggleFavorite({ sourceId, title, image });
  }

  toSimilaRecipes() {
    const { sourceId, title, image } = this.recipe();
    this._recipes.openSimilarRecipes(
      { sourceId, title, image },
      { returnTo: this._currentRoute() },
    );
  }

  private _currentRoute() {
    return `/recipe/${this.recipe().sourceId}?returnTo=${encodeURIComponent(this.backHref())}`;
  }
}
