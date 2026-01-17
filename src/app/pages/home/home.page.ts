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
} from '@ionic/angular/standalone';
import { RecipeCardComponent } from '@shared/components/recipe-card/recipe-card.component';
import { RecipeService } from '@shared/services/recipe/recipe.service';

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
    IonHeader,
    IonTitle,
    IonToolbar,
    FormsModule,
    RecipeCardComponent,
  ],
})
export class HomePage implements OnInit {
  readonly _recipes = inject(RecipeService);

  readonly recipes = computed(() => this._recipes.recipes());

  constructor() {}

  ngOnInit() {}
}
