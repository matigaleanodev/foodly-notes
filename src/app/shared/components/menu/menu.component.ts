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
import { ThemeService } from '@shared/services/theme/theme.service';
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
  private readonly theme = inject(ThemeService);
  private readonly actionSheetCtrl = inject(ActionSheetController);

  readonly currentLang = computed(() =>
    this.translate.currentLang() === Language.ES ? 'ES' : 'EN',
  );

  readonly currentTheme = computed(() => {
    const theme = this.theme.currentTheme();
    if (theme === 'dark') return this.translate.translate('xOscuro');
    if (theme === 'light') return this.translate.translate('xClaro');
    return this.translate.translate('xSistema');
  });

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

  async openThemeSelector() {
    const sheet = await this.actionSheetCtrl.create({
      header: this.translate.translate('xTema'),
      buttons: [
        {
          text: this.translate.translate('xClaro'),
          icon: sunnyOutline,
          handler: () => this.theme.setTheme('light'),
        },
        {
          text: this.translate.translate('xOscuro'),
          icon: moonOutline,
          handler: () => this.theme.setTheme('dark'),
        },
        {
          text: this.translate.translate('xSistema'),
          icon: phonePortraitOutline,
          handler: () => this.theme.setTheme('system'),
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
