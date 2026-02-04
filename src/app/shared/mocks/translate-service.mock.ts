import { signal } from '@angular/core';
import { Language } from '@shared/translate/language.model';

export const translateMock = {
  currentLang: signal(Language.EN),
  translate: jasmine.createSpy('translate').and.callFake((k: string) => k),
  setLanguage: jasmine.createSpy('setLanguage'),
};
