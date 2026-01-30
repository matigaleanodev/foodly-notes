import { Component, computed, inject } from '@angular/core';
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
  ActionSheetController,
} from '@ionic/angular/standalone';
import { Language } from '@shared/translate/language.model';
import { TranslatePipe } from '@shared/translate/translate-pipe';
import { TranslateService } from '@shared/translate/translate.service';
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
    TranslatePipe,
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  private readonly translate = inject(TranslateService);
  private readonly actionSheetCtrl = inject(ActionSheetController);

  readonly currentLang = computed(() =>
    this.translate.currentLang() === Language.ES ? 'ES' : 'EN',
  );

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

  async openLanguageSelector() {
    const sheet = await this.actionSheetCtrl.create({
      header: this.translate.translate('xIdioma'),
      buttons: [
        {
          text: 'Español',
          handler: () => this.translate.setLanguage(Language.ES),
        },
        {
          text: 'English',
          handler: () => this.translate.setLanguage(Language.EN),
        },
        {
          text: this.translate.translate('xCancelar'),
          role: 'cancel',
        },
      ],
    });

    await sheet.present();
  }
}
