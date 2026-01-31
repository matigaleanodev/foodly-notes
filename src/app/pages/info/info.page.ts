import { Component } from '@angular/core';
import {
  IonContent,
  IonListHeader,
  IonLabel,
  IonList,
  IonIcon,
  IonItem,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonMenuButton,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@shared/translate/translate-pipe';
import { addIcons } from 'ionicons';
import {
  constructOutline,
  documentTextOutline,
  helpCircleOutline,
  informationCircleOutline,
  logoGithub,
  mailOutline,
  nutritionOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
  standalone: true,
  imports: [
    IonMenuButton,
    IonBackButton,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonItem,
    IonIcon,
    IonList,
    IonLabel,
    IonListHeader,
    IonContent,
    TranslatePipe,
  ],
})
export class InfoPage {
  readonly helpUrl = 'https://github.com/matigaleanodev/foodly-notes/issues';
  readonly githubUrl = 'https://github.com/matigaleanodev';
  readonly linkedinUrl = 'https://www.linkedin.com/in/matias-galeano';
  readonly contactEmail = 'contacto@matiasgaleano.com.ar';
  readonly spoonacularUrl = 'https://spoonacular.com/food-api';
  readonly privacyUrl = 'https://matiasgaleano.dev/foodly-notes/privacy';
  readonly termsUrl = 'https://matiasgaleano.dev/foodly-notes/terms';

  constructor() {
    addIcons({
      mailOutline,
      logoGithub,
      constructOutline,
      nutritionOutline,
      helpCircleOutline,
      shieldCheckmarkOutline,
      documentTextOutline,
      informationCircleOutline,
    });
  }
}
