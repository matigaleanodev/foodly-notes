import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  IonButton,
  IonCheckbox,
  IonItem,
  IonLabel,
  IonSkeletonText,
} from '@ionic/angular';

@Component({
  selector: 'app-shopping-recipe-card-skeleton',
  standalone: true,
  imports: [IonButton, IonCheckbox, IonItem, IonLabel, IonSkeletonText],
  templateUrl: './shopping-recipe-card-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./shopping-recipe-card-skeleton.component.scss'],
})
export class ShoppingRecipeCardSkeletonComponent {}
