import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterLink,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, heartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
    IonRouterLink,
    RouterLink,
  ],
})
export class TabsPage {
  readonly tabs = signal(TABS);

  constructor() {
    addIcons({ homeOutline, heartOutline });
  }
}
export const TABS = [
  {
    label: 'Home',
    path: 'home',
    icon: 'home-outline',
  },
  {
    label: 'Favoritos',
    path: 'favorites',
    icon: 'heart-outline',
  },
];
