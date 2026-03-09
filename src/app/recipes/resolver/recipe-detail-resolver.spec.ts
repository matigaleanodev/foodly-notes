import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  convertToParamMap,
} from '@angular/router';
import { LoadingController } from '@ionic/angular/standalone';
import { of, throwError } from 'rxjs';

import { recipeDetailResolver } from './recipe-detail-resolver';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { RecipeDetail } from '@recipes/models/recipe-detail.model';

describe('recipeDetailResolver', () => {
  let recipeService: jasmine.SpyObj<RecipeService>;
  let loadingController: jasmine.SpyObj<LoadingController>;

  const loadingElementMock = {
    present: jasmine.createSpy('present').and.resolveTo(),
    dismiss: jasmine.createSpy('dismiss').and.resolveTo(),
  } as unknown as HTMLIonLoadingElement;

  beforeEach(() => {
    recipeService = jasmine.createSpyObj<RecipeService>('RecipeService', [
      'loadRecipeDeatil',
    ]);
    loadingController = jasmine.createSpyObj<LoadingController>(
      'LoadingController',
      ['create'],
    );
    loadingController.create.and.resolveTo(loadingElementMock);

    TestBed.configureTestingModule({
      providers: [
        { provide: RecipeService, useValue: recipeService },
        { provide: LoadingController, useValue: loadingController },
      ],
    });
  });

  it('debería devolver null si no hay id', async () => {
    const route = {
      paramMap: convertToParamMap({}),
    } as ActivatedRouteSnapshot;

    const result = await TestBed.runInInjectionContext(() =>
      recipeDetailResolver(route, {} as RouterStateSnapshot),
    );

    expect(result).toBeNull();
    expect(loadingController.create).not.toHaveBeenCalled();
  });

  it('debería devolver el detalle de la receta cuando hay id', async () => {
    const data: RecipeDetail = {
      sourceId: 1,
      title: 'Receta',
      summary: '',
      instructions: [],
      ingredients: [],
      image: '',
      readyInMinutes: 10,
      cookingMinutes: 10,
      servings: 2,
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false,
      preparationMinutes: 0,
      healthScore: 1,
      aggregateLikes: 1,
      sourceName: 'Spoonacular',
      sourceUrl: 'https://example.com',
      lang: 'en',
    };

    recipeService.loadRecipeDeatil.and.resolveTo(of(data));

    const route = {
      paramMap: convertToParamMap({ id: '1' }),
    } as ActivatedRouteSnapshot;

    const result = await TestBed.runInInjectionContext(() =>
      recipeDetailResolver(route, {} as RouterStateSnapshot),
    );

    expect(loadingController.create).toHaveBeenCalledWith({
      spinner: 'crescent',
      translucent: true,
      cssClass: 'recipe-detail-loading',
    });
    expect(loadingElementMock.present).toHaveBeenCalled();
    expect(recipeService.loadRecipeDeatil).toHaveBeenCalledWith(1);
    expect(result).toEqual(data);
    expect(loadingElementMock.dismiss).toHaveBeenCalled();
  });

  it('debería cerrar el loading aunque el detalle falle', async () => {
    recipeService.loadRecipeDeatil.and.resolveTo(
      throwError(() => new Error('detail error')),
    );

    const route = {
      paramMap: convertToParamMap({ id: '1' }),
    } as ActivatedRouteSnapshot;

    await expectAsync(
      TestBed.runInInjectionContext(() =>
        recipeDetailResolver(route, {} as RouterStateSnapshot),
      ),
    ).toBeRejected();

    expect(loadingElementMock.present).toHaveBeenCalled();
    expect(loadingElementMock.dismiss).toHaveBeenCalled();
  });
});
