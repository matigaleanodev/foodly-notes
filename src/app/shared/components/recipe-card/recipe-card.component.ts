import { Component, computed, inject, input, output } from '@angular/core';
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
import { DailyRecipe } from '@recipes/models/daily-recipe.model';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
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
  readonly recipe = input.required<DailyRecipe>();

  readonly toggleFavorite = output<DailyRecipe>();
  readonly similarRecipes = output<DailyRecipe>();
  readonly recipeDetail = output<DailyRecipe>();

  private readonly _favorites = inject(FavoritesService);

  readonly isFavorite = computed(() => {
    return this._favorites.isFavorite(this.recipe().sourceId);
  });

  readonly recipeImageUrl = computed(() => {
    const recipe = this.recipe();
    if (!recipe) return '';

    return recipe.image;
  });

  constructor() {
    addIcons({
      heart,
      repeat,
    });
  }

  toRecipeDetail(ev: Event) {
    ev.stopPropagation();
    this.recipeDetail.emit(this.recipe());
  }

  toSimilarRecipes(ev: Event) {
    ev.stopPropagation();
    this.similarRecipes.emit(this.recipe());
  }

  toggleFavoriteState(ev: Event) {
    ev.stopPropagation();
    this.toggleFavorite.emit(this.recipe());
  }
}
