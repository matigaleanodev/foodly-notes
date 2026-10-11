import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withXhr } from '@angular/common/http';
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
    whenReady: vi.fn(),
  };

  beforeEach(() => {
    translateMock.currentLang.mockReset();
    translateMock.whenReady.mockReset();
    translateMock.currentLang.mockReturnValue(Language.EN);
    translateMock.whenReady.mockResolvedValue(Language.EN);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withXhr()),
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

  const expectAsyncRequest = async (url: string) => {
    await Promise.resolve();
    return httpMock.expectOne(url);
  };

  it('creates the service', () => {
    expect(service).toBeTruthy();
  });

  it('gets daily recipes with lang en', async () => {
    translateMock.currentLang.mockReturnValue(Language.EN);
    service = TestBed.inject(RecipeApiService);

    service.getDailyRecipes().subscribe((recipes) => {
      expect(recipes).toEqual([]);
    });

    const req = await expectAsyncRequest(
      `${environment.API_URL}/recipes/daily?lang=en`,
    );

    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('uses lang es when current language is spanish', async () => {
    translateMock.currentLang.mockReturnValue(Language.ES);
    service = TestBed.inject(RecipeApiService);

    service.getDailyRecipes().subscribe((recipes) => {
      expect(recipes).toEqual([]);
    });

    const req = await expectAsyncRequest(
      `${environment.API_URL}/recipes/daily?lang=es`,
    );

    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('gets recipe detail with lang', async () => {
    translateMock.currentLang.mockReturnValue(Language.EN);
    service = TestBed.inject(RecipeApiService);

    service.getRecipeDetail(10).subscribe();

    const req = await expectAsyncRequest(
      `${environment.API_URL}/recipes/10?lang=en`,
    );

    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('gets similar recipes with lang', async () => {
    service.getSimilarRecipes(5).subscribe((recipes) => {
      expect(recipes).toEqual([]);
    });

    const req = await expectAsyncRequest(
      `${environment.API_URL}/recipes/5/similar?lang=en`,
    );

    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('posts recipe ingredients with the current lang', async () => {
    translateMock.currentLang.mockReturnValue(Language.EN);

    service.getIngredientsForRecipes([1, 2]).subscribe();

    const req = await expectAsyncRequest(
      `${environment.API_URL}/recipes/ingredients`,
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      sourceIds: [1, 2],
      lang: 'en',
    });

    req.flush([]);
  });

  it('splits and deduplicates ingredient IDs into sequential batches of 20', async () => {
    const ids = Array.from({ length: 21 }, (_, index) => index + 1);
    let result: unknown;
    service.getIngredientsForRecipes([...ids, 1]).subscribe(value => result = value);
    const first = await expectAsyncRequest(`${environment.API_URL}/recipes/ingredients`);
    expect(first.request.body.sourceIds).toEqual(ids.slice(0, 20));
    httpMock.expectNone(`${environment.API_URL}/recipes/ingredients`);
    first.flush([{ sourceId: 1, title: 'First', ingredients: [] }]);
    const second = httpMock.expectOne(`${environment.API_URL}/recipes/ingredients`);
    expect(second.request.body.sourceIds).toEqual([21]);
    second.flush([{ sourceId: 21, title: 'Last', ingredients: [] }]);
    expect(result).toEqual([
      { sourceId: 1, title: 'First', ingredients: [] },
      { sourceId: 21, title: 'Last', ingredients: [] },
    ]);
  });

  it('returns an empty ingredient list without making a request', () => {
    let result: unknown;
    service.getIngredientsForRecipes([]).subscribe(value => result = value);
    expect(result).toEqual([]);
    httpMock.expectNone(`${environment.API_URL}/recipes/ingredients`);
  });

  it('returns an empty array when the query is blank', async () => {
    await expect(
      new Promise((resolve) => {
        service.getRecipesByQuery('   ').subscribe((result) => resolve(result));
      }),
    ).resolves.toEqual([]);
  });

  it('searches recipes by a valid query', async () => {
    service.getRecipesByQuery('pollo').subscribe((recipes) => {
      expect(recipes).toEqual([]);
    });

    const req = await expectAsyncRequest(
      `${environment.API_URL}/recipes/search?q=pollo&lang=en`,
    );

    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('normalizes nullable images from daily summaries', async () => {
    let result: unknown;

    service.getDailyRecipes().subscribe((recipes) => {
      result = recipes;
    });

    const req = await expectAsyncRequest(
      `${environment.API_URL}/recipes/daily?lang=en`,
    );

    req.flush([
      {
        sourceId: 1,
        title: 'Daily recipe',
        image: null,
      },
    ]);

    expect(result).toEqual([
      {
        sourceId: 1,
        title: 'Daily recipe',
        image: '',
      },
    ]);
  });

  it('normalizes nullable images from similar summaries', async () => {
    let result: unknown;

    service.getSimilarRecipes(5).subscribe((recipes) => {
      result = recipes;
    });

    const req = await expectAsyncRequest(
      `${environment.API_URL}/recipes/5/similar?lang=en`,
    );

    req.flush([
      {
        sourceId: 5,
        title: 'Similar recipe',
        image: null,
      },
    ]);

    expect(result).toEqual([
      {
        sourceId: 5,
        title: 'Similar recipe',
        image: '',
      },
    ]);
  });

  it('normalizes nullable images from search summaries', async () => {
    let result: unknown;

    service.getRecipesByQuery('pollo').subscribe((recipes) => {
      result = recipes;
    });

    const req = await expectAsyncRequest(
      `${environment.API_URL}/recipes/search?q=pollo&lang=en`,
    );

    req.flush([
      {
        sourceId: 9,
        title: 'Search recipe',
        image: null,
      },
    ]);

    expect(result).toEqual([
      {
        sourceId: 9,
        title: 'Search recipe',
        image: '',
      },
    ]);
  });
  it('rejects malformed summaries instead of exposing an undefined recipe URL', async () => {
    let failure: unknown;
    service.getDailyRecipes().subscribe({ error: error => failure = error });
    const request = await expectAsyncRequest(`${environment.API_URL}/recipes/daily?lang=en`);
    request.flush([{ title: 'Corrupt record', _doc: { sourceId: 1 } }]);
    expect(failure).toBeInstanceOf(Error);
  });

  it('waits for the stored language before requesting shopping ingredients', async () => {
    let ready!: () => void;
    translateMock.whenReady.mockReturnValueOnce(new Promise<void>(resolve => ready = resolve));
    service.getIngredientsForRecipes([1]).subscribe();
    httpMock.expectNone(`${environment.API_URL}/recipes/ingredients`);
    translateMock.currentLang.mockReturnValue(Language.ES);
    ready();
    const request = await expectAsyncRequest(`${environment.API_URL}/recipes/ingredients`);
    expect(request.request.body.lang).toBe('es');
    request.flush([]);
  });

});
