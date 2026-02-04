import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { RecipeService } from './recipe.service';
import { RecipeApiService } from '../recipe-api/recipe-api.service';
import { NavService } from '@shared/services/nav/nav.service';
import { LoadingService } from '@shared/services/loading/loading.service';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';

describe('RecipeService', () => {
  let service: RecipeService;

  const recipesMock: DailyRecipe[] = [
    { sourceId: 1, title: 'Receta 1', image: 'img1' },
    { sourceId: 2, title: 'Receta 2', image: 'img2' },
  ];

  const loadingElementMock = {
    dismiss: jasmine.createSpy('dismiss'),
  };

  const loadingServiceMock = {
    show: jasmine.createSpy('show').and.resolveTo(loadingElementMock),
  };

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RecipeService,
        { provide: RecipeApiService, useValue: apiMock },
        { provide: NavService, useValue: navMock },
        { provide: LoadingService, useValue: loadingServiceMock },
      ],
    });

    service = TestBed.inject(RecipeService);
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería cargar recetas diarias y actualizar el signal', async () => {
    await service.loadDailyRecipes();

    expect(apiMock.getDailyRecipes).toHaveBeenCalled();
    expect(service.recipes()).toEqual(recipesMock);
    expect(loadingElementMock.dismiss).toHaveBeenCalled();
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
