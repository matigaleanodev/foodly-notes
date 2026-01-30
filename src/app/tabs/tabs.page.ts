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
import { TranslatePipe } from '@shared/translate/translate-pipe';
import { addIcons } from 'ionicons';
import { homeOutline, heartOutline, cartOutline } from 'ionicons/icons';

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
    TranslatePipe,
  ],
})
export class TabsPage {
  readonly tabs = signal(TABS);

  constructor() {
    addIcons({ homeOutline, heartOutline, cartOutline });
  }
}
export const TABS = [
  {
    label: 'xFavoritos',
    path: 'favorites',
    icon: 'heart-outline',
  },
  {
    label: 'xInicio',
    path: 'home',
    icon: 'home-outline',
  },
  {
    label: 'xListaCompras',
    path: 'shopping-list',
    icon: 'cart-outline',
  },
];
