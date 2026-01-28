import { Component, computed, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IonContent, IonCol, IonRow, IonGrid } from '@ionic/angular/standalone';
import { RecipeCardComponent } from '@shared/components/recipe-card/recipe-card.component';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { HomeHeroComponent } from './components/home-hero/home-hero.component';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    IonContent,
    FormsModule,
    RecipeCardComponent,
    HomeHeroComponent,
  ],
})
export class HomePage {
  readonly _recipes = inject(RecipeService);
  readonly _favoritos = inject(FavoritesService);

  readonly recipes = computed(() => this._recipes.recipes());

  ionViewWillEnter() {
    this._favoritos.cargarFavoritos();
    this._recipes.buscarRecetasDiarias();
  }

  toggleFavorito(receta: DailyRecipe) {
    const esFavorito = this._favoritos.esFavorito(receta);
    if (esFavorito) {
      this._favoritos.removerFavorito(receta);
    } else {
      this._favoritos.agregarFavorito(receta);
    }
  }

  recetasSimilares({ sourceId }: DailyRecipe) {
    this._recipes.recetasSimilares(sourceId);
  }

  detalleReceta({ sourceId }: DailyRecipe) {
    this._recipes.detalleReceta(sourceId);
  }
}
