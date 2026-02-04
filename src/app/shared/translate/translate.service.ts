import { inject, Injectable, signal } from '@angular/core';
import { StorageService } from '@shared/services/storage/storage.service';
import { Language } from './language.model';
import { enUS } from './i18n/en-US';
import { esAR } from './i18n/es-AR';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  private store = inject(StorageService);

  private readonly translations: Record<Language, Record<string, string>> = {
    [Language.EN]: enUS,
    [Language.ES]: esAR,
  };

  readonly currentLang = signal<Language>(Language.EN);

  constructor() {}

  async initLang(): Promise<void> {
    const lang = await this.getStoredLang();
    this.setLanguage(lang);
  }

  async getStoredLang(): Promise<Language> {
    const storedLang = await this.store.getItem<Language>('lang');

    return storedLang && this.translations[storedLang]
      ? storedLang
      : Language.EN;
  }

  setLanguage(lang: Language): void {
    if (this.translations[lang]) {
      this.currentLang.set(lang);
      this.store.setItem<Language>('lang', lang);
    }
  }

  getCurrentLanguage(): Language {
    return this.currentLang();
  }

  translate(key: string, lang: Language = this.currentLang()): string {
    const value = this.translations[lang]?.[key];

    if (!value) {
      console.warn(`[i18n] Missing key: ${key}`);
    }

    return value ?? key;
  }
}
