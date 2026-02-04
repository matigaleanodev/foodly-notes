import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  convertToParamMap,
} from '@angular/router';
import { of } from 'rxjs';

import { recipeDetailResolver } from './recipe-detail-resolver';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { RecipeDetail } from '@recipes/models/recipe-detail.model';

describe('recipeDetailResolver', () => {
  let recipeService: jasmine.SpyObj<RecipeService>;

  beforeEach(() => {
    recipeService = jasmine.createSpyObj<RecipeService>('RecipeService', [
      'loadRecipeDeatil',
    ]);

    TestBed.configureTestingModule({
      providers: [{ provide: RecipeService, useValue: recipeService }],
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

    expect(recipeService.loadRecipeDeatil).toHaveBeenCalledWith(1);
    expect(result).toEqual(data);
  });
});
