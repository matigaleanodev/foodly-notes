import { Component, computed, inject, input, OnInit } from '@angular/core';

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
} from '@ionic/angular/standalone';
import { SimilarRecipe } from '@recipes/models/similar-recipe.model';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { RecipeCardComponent } from '@shared/components/recipe-card/recipe-card.component';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { TranslatePipe } from '@shared/translate/translate-pipe';
import { TranslateService } from '@shared/translate/translate.service';

@Component({
  selector: 'app-similar',
  templateUrl: './similar.page.html',
  styleUrls: ['./similar.page.scss'],
  standalone: true,
  imports: [
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
    TranslatePipe,
  ],
})
export class SimilarPage {
  readonly recipes = input.required<SimilarRecipe[]>();

  readonly _translator = inject(TranslateService);
  readonly _recipes = inject(RecipeService);
  readonly _favorites = inject(FavoritesService);

  readonly subtitle = computed(() => {
    const recipe = this._recipes.recipeSelected();

    return recipe
      ? `${this._translator.translate('xBasadaEn')}: ${recipe.title}`
      : this._translator.translate('xRecetasRecomendadas');
  });

  ionViewWillEnter() {
    this._favorites.loadFavorites();
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
}
