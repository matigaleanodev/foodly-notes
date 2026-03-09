import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { RecipeService } from './recipe.service';
import { RecipeApiService } from '../recipe-api/recipe-api.service';
import { NavService } from '@shared/services/nav/nav.service';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';
import { StorageService } from '@shared/services/storage/storage.service';

describe('RecipeService', () => {
  let service: RecipeService;

  const recipesMock: DailyRecipe[] = [
    { sourceId: 1, title: 'Receta 1', image: 'img1' },
    { sourceId: 2, title: 'Receta 2', image: 'img2' },
  ];

  const apiMock = {
    getDailyRecipes: jasmine
      .createSpy('getDailyRecipes')
      .and.returnValue(of(recipesMock)),
    getRecipeDetail: jasmine
      .createSpy('getRecipeDetail')
      .and.returnValue(of({})),
    getSimilarRecipes: jasmine
      .createSpy('getSimilarRecipes')
      .and.returnValue(of([])),
    getRecipesByQuery: jasmine
      .createSpy('getRecipesByQuery')
      .and.returnValue(of([])),
  };

  const navMock = {
    search: jasmine.createSpy('search'),
    forward: jasmine.createSpy('forward'),
  };

  const storageMock = {
    getItem: jasmine.createSpy('getItem').and.resolveTo(null),
    setItem: jasmine.createSpy('setItem').and.resolveTo(undefined),
  };

  beforeEach(() => {
    apiMock.getDailyRecipes.calls.reset();
    apiMock.getRecipeDetail.calls.reset();
    apiMock.getSimilarRecipes.calls.reset();
    apiMock.getRecipesByQuery.calls.reset();
    navMock.search.calls.reset();
    navMock.forward.calls.reset();
    storageMock.getItem.calls.reset();
    storageMock.setItem.calls.reset();

    apiMock.getDailyRecipes.and.returnValue(of(recipesMock));
    apiMock.getRecipeDetail.and.returnValue(of({}));
    apiMock.getSimilarRecipes.and.returnValue(of([]));
    apiMock.getRecipesByQuery.and.returnValue(of([]));
    storageMock.getItem.and.resolveTo(null);
    storageMock.setItem.and.resolveTo(undefined);

    TestBed.configureTestingModule({
      providers: [
        RecipeService,
        { provide: RecipeApiService, useValue: apiMock },
        { provide: NavService, useValue: navMock },
        { provide: StorageService, useValue: storageMock },
      ],
    });

    service = TestBed.inject(RecipeService);
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería cargar recetas diarias y actualizar el signal', async () => {
    await service.loadDailyRecipes();

    expect(storageMock.getItem).toHaveBeenCalledWith('daily_recipes');
    expect(apiMock.getDailyRecipes).toHaveBeenCalled();
    expect(service.recipes()).toEqual(recipesMock);
  });

  it('debería reutilizar la cache del día y evitar la API', async () => {
    storageMock.getItem.and.resolveTo({
      recipes: recipesMock,
      date: new Date().toISOString().split('T')[0],
    });

    await service.loadDailyRecipes();

    expect(apiMock.getDailyRecipes).not.toHaveBeenCalled();
    expect(service.recipes()).toEqual(recipesMock);
  });

  it('debería persistir las recetas diarias cuando la API responde', async () => {
    await service.loadDailyRecipes();

    expect(storageMock.setItem).toHaveBeenCalledWith('daily_recipes', {
      recipes: recipesMock,
      date: new Date().toISOString().split('T')[0],
    });
  });

  it('debería usar la cache previa si la API falla', async () => {
    storageMock.getItem.and.resolveTo({
      recipes: recipesMock,
      date: '2000-01-01',
    });
    apiMock.getDailyRecipes.and.returnValue(
      throwError(() => new Error('network error')),
    );

    await service.loadDailyRecipes();

    expect(service.recipes()).toEqual(recipesMock);
  });

  it('debería refrescar recetas diarias sin loading', (done) => {
    service.refreshDailyRecipes().subscribe((result) => {
      expect(result).toEqual(recipesMock);
      expect(service.recipes()).toEqual(recipesMock);
      done();
    });
  });

  it('debería seleccionar una receta', () => {
    service.selectRecipe(recipesMock[0]);

    expect(service.recipeSelected()).toEqual(recipesMock[0]);
  });

  it('debería navegar a búsqueda', () => {
    service.searchRecipes('pollo');

    expect(navMock.search).toHaveBeenCalledWith('pollo');
  });

  it('debería navegar al detalle de receta', () => {
    service.toRecipeDetail(10);

    expect(navMock.forward).toHaveBeenCalledWith('recipe/10');
  });

  it('debería navegar a recetas similares', () => {
    service.toSimilarRecipes(5);

    expect(navMock.forward).toHaveBeenCalledWith('similar/5');
  });
});
