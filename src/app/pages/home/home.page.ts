import { Component, computed, inject, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCol,
  IonRow,
  IonGrid,
  IonMenu,
} from '@ionic/angular/standalone';
import { RecipeCardComponent } from '@shared/components/recipe-card/recipe-card.component';
import { RecipeInfo } from '@shared/models/recipe.model';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { NavService } from '@shared/services/nav/nav.service';
import { RecipeService } from '@shared/services/recipe/recipe.service';
import { HomeHeroComponent } from './components/home-hero/home-hero.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonMenu,
    IonContent,
    FormsModule,
    RecipeCardComponent,
    HomeHeroComponent,
  ],
})
export class HomePage {
  readonly _recipes = inject(RecipeService);
  readonly _favoritos = inject(FavoritesService);
  readonly _nav = inject(NavService);

  readonly recipes = computed(() => this._recipes.recipes());

  ionViewWillEnter() {
    this._favoritos.cargarFavoritos();
  }

  toggleFavorito(receta: RecipeInfo) {
    const esFavorito = this._favoritos.esFavorito(receta);
    if (esFavorito) {
      this._favoritos.removerFavorito(receta);
    } else {
      this._favoritos.agregarFavorito(receta);
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
