import { Component, computed, inject, input } from '@angular/core';

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
} from '@ionic/angular/standalone';
import { RecipeMetaComponent } from './components/recipe-meta/recipe-meta.component';
import { RecipeHeroComponent } from './components/recipe-hero/recipe-hero.component';
import { RecipeIngredientsComponent } from './components/recipe-ingredients/recipe-ingredients.component';
import { RecipeInstructionsComponent } from './components/recipe-instructions/recipe-instructions.component';
import { RecipeAttrComponent } from './components/recipe-attr/recipe-attr.component';
import { RecipeMetaExtendedComponent } from './components/recipe-meta-extended/recipe-meta-extended.component';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { NavService } from '@shared/services/nav/nav.service';
import { RecipeDetail } from '@recipes/models/recipe-detail.model';
import { RecipeService } from '@recipes/services/recipe/recipe.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.page.html',
  styleUrls: ['./recipe.page.scss'],
  standalone: true,
  imports: [
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
  ],
})
export class RecipePage {
  readonly recipe = input.required<RecipeDetail>();

  private readonly _favorites = inject(FavoritesService);
  private readonly _recipes = inject(RecipeService);
  private readonly _nav = inject(NavService);

  readonly imageUrl = computed(() => {
    const recipe = this.recipe();
    if (!recipe) return '';

    return recipe.image;
  });

  isFavorite = computed(() =>
    this._favorites.isFavorite(this.recipe().sourceId),
  );

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

    this._nav.forward(`similares/${sourceId}`);
  }
}
