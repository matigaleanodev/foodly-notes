import { Component, computed, inject, resource, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  IonRouterLink,
} from '@ionic/angular';
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
import { AppInfoService } from './service/app-info.service';
@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
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
    RouterLink,
    IonRouterLink,
  ],
})
export class InfoPage {
  private readonly _service = inject(AppInfoService);

  readonly appVersion = resource({
    loader: () => this._service.getAppVersion(),
  });

  readonly appStage = computed(() => this._service.appStage());

  readonly helpUrl = 'https://github.com/matigaleanodev/foodly-notes/issues';
  readonly githubUrl = 'https://github.com/matigaleanodev/foodly-notes';
  readonly linkedinUrl = 'https://www.linkedin.com/in/matias-galeano';
  readonly contactEmail = 'contacto@foodlynotes.app';
  readonly spoonacularUrl = 'https://spoonacular.com/food-api';

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
