import {
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';

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
  ],
})
export class RecipePage {
  readonly data = input.required<RecipeDetail>();

  readonly recipe = linkedSignal(() => this.data());

  private readonly _favorites = inject(FavoritesService);
  private readonly _recipes = inject(RecipeService);
  private readonly _translate = inject(TranslateService);

  readonly imageUrl = computed(() => {
    const recipe = this.recipe();
    if (!recipe) return '';

    return recipe.image;
  });

  private readonly _initialLang = signal<Language | null>(null);

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
          next: (recipe) => this.recipe.set(recipe),
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
        event.target.complete();
      },
      error: () => {
        event.target.complete();
      },
    });
  }

  toggleFavorite() {
    const recipe = this.recipe();
    const { sourceId, title, image } = recipe;

    const isFavorite = this._favorites.isFavorite(sourceId);

    if (isFavorite) {
      this._favorites.removeFavorite(sourceId);
    } else {
      this._favorites.addFavorite({ sourceId, title, image });
    }
  }

  toSimilaRecipes() {
    const { sourceId, title, image } = this.recipe();
    this._recipes.selectRecipe({ sourceId, title, image });

    this._recipes.toSimilarRecipes(sourceId);
  }
}
