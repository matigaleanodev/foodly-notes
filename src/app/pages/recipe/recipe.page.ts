import { Component, computed, input, OnInit } from '@angular/core';

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
export class RecipePage implements OnInit {
  readonly recipe = input.required<RecipeInfo>();

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

  constructor() {}

  ngOnInit() {}

  isFavorite = computed(() => true);

  toggleFavorito() {}

  verSimilares() {}
}
