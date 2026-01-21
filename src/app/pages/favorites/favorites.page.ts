import { Component, computed, inject, OnInit } from '@angular/core';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonRow,
  IonGrid,
  IonCol,
} from '@ionic/angular/standalone';
import { RecipeCardComponent } from '@shared/components/recipe-card/recipe-card.component';
import { RecipeInfo } from '@shared/models/recipe.model';
import { FavoritesService } from '@shared/services/favorites/favorites.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [
    IonCol,
    IonGrid,
    IonRow,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    RecipeCardComponent,
  ],
})
export class FavoritesPage {
  private readonly _service = inject(FavoritesService);

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

  recetasSimilares(receta: RecipeInfo) {}

  detalleReceta(receta: RecipeInfo) {}
}
