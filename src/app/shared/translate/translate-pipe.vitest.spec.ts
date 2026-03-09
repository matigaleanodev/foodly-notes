import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { StorageService } from '@shared/services/storage/storage.service';
import { StorageServiceMock } from '@shared/mocks/storage.mock';
import { Language } from './language.model';
import { TranslatePipe } from './translate-pipe';
import { TranslateService } from './translate.service';

describe('TranslatePipe (Vitest)', () => {
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

  it('renders the active translation', () => {
    expect(pipe.transform('xCargando')).toBe('Loading');
  });

  it('updates the translation after language changes', () => {
    service.setLanguage(Language.ES);

    expect(pipe.transform('xCargando')).toBe('Cargando');
  });
});
