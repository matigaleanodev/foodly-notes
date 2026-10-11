import { Component, computed, inject, input, output, ChangeDetectionStrategy } from '@angular/core';
import {
  IonCard,
  IonImg,
  IonCardTitle,
  IonCardHeader,
  IonIcon,
  IonButton,
  IonButtons,
  IonToolbar,
} from '@ionic/angular';
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
  changeDetection: ChangeDetectionStrategy.Eager,
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

    if (!recipe?.image) {
      return this.fallbackImage;
    }

    return recipe.image;
  });

  private readonly fallbackImage = 'assets/images/foodly_notes_solid_green.png';

  constructor() {
    addIcons({
      heart,
      repeat,
    });
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLIonImgElement;
    img.src = this.fallbackImage;
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
