import { Component } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonSkeletonText,
  IonToolbar,
} from '@ionic/angular/standalone';

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
  styleUrls: ['./recipe-card-skeleton.component.scss'],
})
export class RecipeCardSkeletonComponent {}
