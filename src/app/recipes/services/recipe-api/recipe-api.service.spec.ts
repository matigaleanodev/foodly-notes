import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { RecipeApiService } from './recipe-api.service';
import { TranslateService } from '@shared/translate/translate.service';
import { Language } from '@shared/translate/language.model';
import { environment } from '@env/environment';

describe('RecipeApiService', () => {
  let service: RecipeApiService;
  let httpMock: HttpTestingController;

  const translateMock = {
    currentLang: jasmine.createSpy('currentLang').and.returnValue(Language.EN),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
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

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener recetas diarias con lang en', () => {
    translateMock.currentLang.and.returnValue(Language.EN);

    service = TestBed.inject(RecipeApiService);

    service.getDailyRecipes().subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL}/recipes/daily?lang=en`,
    );

    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('debería usar lang es cuando el idioma es español', () => {
    translateMock.currentLang.and.returnValue(Language.ES);

    service = TestBed.inject(RecipeApiService);

    service.getDailyRecipes().subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL}/recipes/daily?lang=es`,
    );

    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('debería obtener el detalle de una receta con lang', () => {
    translateMock.currentLang.and.returnValue(Language.EN);
    service = TestBed.inject(RecipeApiService);

    service.getRecipeDetail(10).subscribe();

    const req = httpMock.expectOne(`${environment.API_URL}/recipes/10?lang=en`);

    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('debería obtener recetas similares sin lang', () => {
    service.getSimilarRecipes(5).subscribe();

    const req = httpMock.expectOne(`${environment.API_URL}/recipes/5/similar`);

    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('debería obtener ingredientes para recetas vía POST', () => {
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

  it('debería devolver array vacío si la query está vacía', (done) => {
    service.getRecipesByQuery('   ').subscribe((result) => {
      expect(result).toEqual([]);
      done();
    });
  });

  it('debería buscar recetas por query válida', () => {
    service.getRecipesByQuery('pollo').subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL}/recipes/search?q=pollo`,
    );

    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('debería usar lang es cuando el idioma es español', () => {
    translateMock.currentLang.and.returnValue(Language.ES);

    service.getDailyRecipes().subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL}/recipes/daily?lang=es`,
    );

    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
