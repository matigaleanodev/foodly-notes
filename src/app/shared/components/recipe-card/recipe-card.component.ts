import { Component, computed, input, OnInit, output } from '@angular/core';
import {
  IonCard,
  IonImg,
  IonCardTitle,
  IonCardHeader,
  IonIcon,
  IonButton,
  IonButtons,
  IonToolbar,
} from '@ionic/angular/standalone';
import { RecipeInfo } from '@shared/models/recipe.model';
import { addIcons } from 'ionicons';
import { heart, repeat } from 'ionicons/icons';

@Component({
  selector: 'app-recipe-card',
  imports: [
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonCardHeader,
    IonCardTitle,
    IonImg,
    IonCard,
  ],
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss'],
})
export class RecipeCardComponent {
  readonly recipe = input.required<RecipeInfo>();

  readonly favorito = output<RecipeInfo>();
  readonly similares = output<RecipeInfo>();

  readonly recipeImageUrl = computed(() => {
    const recipe = this.recipe();
    if (!recipe) return '';

    return (
      'https://spoonacular.com/recipeImages/' +
      recipe.id +
      '-556x370.' +
      (recipe.imageType || 'jpg')
    );
  });

  constructor() {
    addIcons({
      heart,
      repeat,
    });
  }

  recetasSimilares(ev: Event) {
    ev.stopPropagation();
    this.similares.emit(this.recipe());
  }

  estadoFavoritos(ev: Event) {
    ev.stopPropagation();
    this.favorito.emit(this.recipe());
  }
}
