import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonSkeletonText,
  IonToolbar,
} from '@ionic/angular';

@Component({
  selector: 'app-recipe-card-skeleton',
  standalone: true,
  imports: [
    IonToolbar,
    IonButtons,
    IonButton,
    IonCardHeader,
    IonSkeletonText,
    IonCard,
  ],
  templateUrl: './recipe-card-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./recipe-card-skeleton.component.scss'],
})
export class RecipeCardSkeletonComponent {}
