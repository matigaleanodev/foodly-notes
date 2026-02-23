import { Component } from '@angular/core';
import {
  IonButton,
  IonCheckbox,
  IonItem,
  IonLabel,
  IonSkeletonText,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-shopping-recipe-card-skeleton',
  standalone: true,
  imports: [IonButton, IonCheckbox, IonItem, IonLabel, IonSkeletonText],
  templateUrl: './shopping-recipe-card-skeleton.component.html',
  styleUrls: ['./shopping-recipe-card-skeleton.component.scss'],
})
export class ShoppingRecipeCardSkeletonComponent {}
