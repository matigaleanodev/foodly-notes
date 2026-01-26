import { Component, computed, inject } from '@angular/core';

import { IonContent, IonRow, IonGrid, IonCol } from '@ionic/angular/standalone';
import { RecipeCardComponent } from '@shared/components/recipe-card/recipe-card.component';
import { RecipeInfo } from '@shared/models/recipe.model';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { NavService } from '@shared/services/nav/nav.service';
import { RecipeService } from '@shared/services/recipe/recipe.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [IonCol, IonGrid, IonRow, IonContent, RecipeCardComponent],
})
export class FavoritesPage {
  private readonly _service = inject(FavoritesService);
  private readonly _nav = inject(NavService);
  private readonly _recipes = inject(RecipeService);

  readonly favoritos = computed(() => this._service.favoritos());

  ionViewWillEnter() {
    this._service.cargarFavoritos();
  }

  toggleFavorito(receta: RecipeInfo) {
    const esFavorito = this._service.esFavorito(receta);
    if (esFavorito) {
      this._service.removerFavorito(receta);
    } else {
      this._service.agregarFavorito(receta);
    }
  }

  recetasSimilares(receta: RecipeInfo) {
    this._recipes.seleccionarReceta(receta);

    this._nav.forward(`similares/${receta.id}`);
  }

  detalleReceta(receta: RecipeInfo) {
    this._recipes.seleccionarReceta(receta);

    this._nav.forward(`recipe/${receta.id}`);
  }
}
