import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonMenuToggle,
  IonRouterLink,
  IonContent,
  IonMenu,
  IonIcon,
  IonItem,
  IonLabel,
  IonListHeader,
  IonNote,
  IonList,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cartOutline,
  heartOutline,
  homeOutline,
  informationCircleOutline,
  languageOutline,
  moonOutline,
  phonePortraitOutline,
  sunnyOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-menu',
  imports: [
    IonList,
    IonMenuToggle,
    IonRouterLink,
    RouterLink,
    IonNote,
    IonListHeader,
    IonLabel,
    IonItem,
    IonIcon,
    IonContent,
    IonHeader,
    IonMenu,
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  constructor() {
    addIcons({
      'foodly-notes': 'assets/icons/foodly_notes_icon.svg',
      heartOutline,
      homeOutline,
      informationCircleOutline,
      cartOutline,
      moonOutline,
      sunnyOutline,
      phonePortraitOutline,
      languageOutline,
    });
  }
}
