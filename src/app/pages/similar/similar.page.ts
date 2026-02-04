import {
  Component,
  computed,
  inject,
  input,
  linkedSignal,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  RefresherCustomEvent,
  IonRefresher,
  IonRefresherContent,
  IonFooter,
} from '@ionic/angular/standalone';
import { SimilarRecipe } from '@recipes/models/similar-recipe.model';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { EmptyStatesComponent } from '@shared/components/empty-states/empty-states.component';
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
    IonFooter,
    IonRefresherContent,
    IonRefresher,
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
    EmptyStatesComponent,
  ],
})
export class SimilarPage {
  readonly data = input.required<SimilarRecipe[]>();

  readonly recipes = linkedSignal(() => this.data());

  readonly _translator = inject(TranslateService);
  readonly _recipes = inject(RecipeService);
  readonly _favorites = inject(FavoritesService);

  private readonly _route = inject(ActivatedRoute);

  readonly subtitle = computed(() => {
    const recipe = this._recipes.recipeSelected();

    return recipe
      ? `${this._translator.translate('xBasadaEn')}: ${recipe.title}`
      : this._translator.translate('xRecetasRecomendadas');
  });

  ionViewWillEnter() {
    this._favorites.loadFavorites();
  }

  onRefresh(event: RefresherCustomEvent) {
    const sourceId = Number(this._route.snapshot.paramMap.get('id'));

    this._recipes.refreshSimilarRecipes(sourceId).subscribe({
      next: (recipes) => {
        this.recipes.set(recipes);
        event.target.complete();
      },
      error: () => {
        event.target.complete();
      },
    });
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
