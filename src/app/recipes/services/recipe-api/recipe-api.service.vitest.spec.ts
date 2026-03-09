import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RecipeApiService } from './recipe-api.service';
import { TranslateService } from '@shared/translate/translate.service';
import { Language } from '@shared/translate/language.model';
import { environment } from '@env/environment';

describe('RecipeApiService (Vitest)', () => {
  let service: RecipeApiService;
  let httpMock: HttpTestingController;

  const translateMock = {
    currentLang: vi.fn(),
  };

  beforeEach(() => {
    translateMock.currentLang.mockReset();
    translateMock.currentLang.mockReturnValue(Language.EN);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        RecipeApiService,
        { provide: TranslateService, useValue: translateMock },
      ],
    });

    service = TestBed.inject(RecipeApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('creates the service', () => {
    expect(service).toBeTruthy();
  });

  it('gets daily recipes with lang en', () => {
    translateMock.currentLang.mockReturnValue(Language.EN);
    service = TestBed.inject(RecipeApiService);

    service.getDailyRecipes().subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL}/recipes/daily?lang=en`,
    );

    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('uses lang es when current language is spanish', () => {
    translateMock.currentLang.mockReturnValue(Language.ES);
    service = TestBed.inject(RecipeApiService);

    service.getDailyRecipes().subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL}/recipes/daily?lang=es`,
    );

    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('gets recipe detail with lang', () => {
    translateMock.currentLang.mockReturnValue(Language.EN);
    service = TestBed.inject(RecipeApiService);

    service.getRecipeDetail(10).subscribe();

    const req = httpMock.expectOne(`${environment.API_URL}/recipes/10?lang=en`);

    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('gets similar recipes without lang', () => {
    service.getSimilarRecipes(5).subscribe();

    const req = httpMock.expectOne(`${environment.API_URL}/recipes/5/similar`);

    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('posts recipe ingredients with the current lang', () => {
    translateMock.currentLang.mockReturnValue(Language.EN);

    service.getIngredientsForRecipes([1, 2]).subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL}/recipes/ingredients`,
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      sourceIds: [1, 2],
      lang: 'en',
    });

    req.flush([]);
  });

  it('returns an empty array when the query is blank', async () => {
    await expect(
      new Promise((resolve) => {
        service.getRecipesByQuery('   ').subscribe((result) => resolve(result));
      }),
    ).resolves.toEqual([]);
  });

  it('searches recipes by a valid query', () => {
    service.getRecipesByQuery('pollo').subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL}/recipes/search?q=pollo`,
    );

    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
