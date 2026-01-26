import { Component, computed, inject, input } from '@angular/core';

import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonFooter,
  IonGrid,
  IonCol,
  IonRow,
} from '@ionic/angular/standalone';
import { RecipeInfo } from '@shared/models/recipe.model';
import { RecipeMetaComponent } from './components/recipe-meta/recipe-meta.component';
import { RecipeHeroComponent } from './components/recipe-hero/recipe-hero.component';
import { RecipeIngredientsComponent } from './components/recipe-ingredients/recipe-ingredients.component';
import { RecipeInstructionsComponent } from './components/recipe-instructions/recipe-instructions.component';
import { RecipeAttrComponent } from './components/recipe-attr/recipe-attr.component';
import { RecipeMetaExtendedComponent } from './components/recipe-meta-extended/recipe-meta-extended.component';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { NavService } from '@shared/services/nav/nav.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.page.html',
  styleUrls: ['./recipe.page.scss'],
  standalone: true,
  imports: [
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
  readonly recipe = input.required<RecipeInfo>();

  private readonly _favoritos = inject(FavoritesService);
  private readonly _nav = inject(NavService);

  readonly imageUrl = computed(() => {
    const recipe = this.recipe();
    if (!recipe) return '';

    return (
      'https://img.spoonacular.com/recipes/' +
      recipe.id +
      '-636x393.' +
      (recipe.imageType || 'jpg')
    );
  });

  isFavorite = computed(() => this._favoritos.esFavorito(this.recipe()));

  toggleFavorito() {
    const receta = this.recipe();
    const esFavorito = this._favoritos.esFavorito(receta);
    if (esFavorito) {
      this._favoritos.removerFavorito(receta);
    } else {
      this._favoritos.agregarFavorito(receta);
    }
  }

  verSimilares() {
    const receta = this.recipe();

    this._nav.forward(`similares/${receta.id}`);
  }
}
