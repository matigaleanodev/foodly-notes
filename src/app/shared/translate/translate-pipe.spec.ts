import { TestBed } from '@angular/core/testing';
import { TranslatePipe } from './translate-pipe';
import { TranslateService } from './translate.service';
import { StorageService } from '@shared/services/storage/storage.service';
import { Language } from './language.model';
import { StorageServiceMock } from '@shared/mocks/storage.mock';

describe('TranslatePipe', () => {
  let pipe: TranslatePipe;
  let service: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TranslatePipe,
        TranslateService,
        { provide: StorageService, useClass: StorageServiceMock },
      ],
    });

    pipe = TestBed.inject(TranslatePipe);
    service = TestBed.inject(TranslateService);
  });

  it('debería renderizar la traducción', () => {
    const value = pipe.transform('xCargando');
    expect(value).toBe('Loading');
  });

  it('debería actualizar la traducción al cambiar el idioma', () => {
    service.setLanguage(Language.ES);
    const value = pipe.transform('xCargando');
    expect(value).toBe('Cargando');
  });
});
