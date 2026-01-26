import { Component } from '@angular/core';
import {
  IonMenuButton,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonSearchbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home-hero',
  imports: [IonSearchbar, IonButtons, IonToolbar, IonHeader, IonMenuButton],
  templateUrl: './home-hero.component.html',
  styleUrls: ['./home-hero.component.scss'],
})
export class HomeHeroComponent {
  constructor() {}
}
