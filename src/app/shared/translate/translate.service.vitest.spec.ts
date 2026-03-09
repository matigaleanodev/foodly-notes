import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { StorageServiceMock } from '@shared/mocks/storage.mock';
import { StorageService } from '@shared/services/storage/storage.service';
import { Language } from './language.model';
import { TranslateService } from './translate.service';

describe('TranslateService (Vitest)', () => {
  let service: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: StorageService, useClass: StorageServiceMock }],
    }).compileComponents();

    service = TestBed.inject(TranslateService);
  });

  it('updates the current language and the document language', () => {
    service.setLanguage(Language.ES);

    expect(service.getCurrentLanguage()).toBe(Language.ES);
    expect(document.documentElement.lang).toBe(Language.ES);
  });

  it('returns the key and warns when a translation is missing', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = service.translate('missing-key', Language.EN);

    expect(result).toBe('missing-key');
    expect(warnSpy).toHaveBeenCalledWith('[i18n] Missing key: missing-key');
  });
});
