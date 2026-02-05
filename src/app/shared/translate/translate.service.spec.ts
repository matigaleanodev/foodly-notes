import { TestBed } from '@angular/core/testing';
import { TranslateService } from './translate.service';
import { StorageService } from '@shared/services/storage/storage.service';
import { Language } from './language.model';
import { StorageServiceMock } from '@shared/mocks/storage.mock';

describe('TranslateService', () => {
  let service: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: StorageService, useClass: StorageServiceMock }],
    }).compileComponents();

    service = TestBed.inject(TranslateService);
  });

  it('debería inicializar el idioma por defecto en inglés', () => {
    expect(service.getCurrentLanguage()).toBe(Language.EN);
  });

  it('debería cambiar el idioma y actualizar la signal', () => {
    service.setLanguage(Language.ES);
    expect(service.getCurrentLanguage()).toBe(Language.ES);
  });

  it('debería devolver la traducción correcta', () => {
    const value = service.translate('xCargando', Language.ES);
    expect(value).toBe('Cargando');
  });

  it('debería devolver la key cuando no existe traducción', () => {
    const value = service.translate('xNoKeyTranslate', Language.EN);
    expect(value).toBe('xNoKeyTranslate');
  });
});
