import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  convertToParamMap,
} from '@angular/router';
import { LoadingController } from '@ionic/angular/standalone';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { recipeDetailResolver } from './recipe-detail-resolver';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { RecipeDetail } from '@recipes/models/recipe-detail.model';

describe('recipeDetailResolver (Vitest)', () => {
  const recipeService = {
    loadRecipeDetail: vi.fn(),
  };

  const loadingElementMock = {
    present: vi.fn().mockResolvedValue(undefined),
    dismiss: vi.fn().mockResolvedValue(undefined),
  } as unknown as HTMLIonLoadingElement;

  const loadingController = {
    create: vi.fn().mockResolvedValue(loadingElementMock),
  };

  beforeEach(() => {
    recipeService.loadRecipeDetail.mockReset();
    loadingController.create.mockClear();
    loadingElementMock.present = vi.fn().mockResolvedValue(undefined);
    loadingElementMock.dismiss = vi.fn().mockResolvedValue(undefined);

    TestBed.configureTestingModule({
      providers: [
        { provide: RecipeService, useValue: recipeService },
        { provide: LoadingController, useValue: loadingController },
      ],
    });
  });

  it('returns null when there is no id', async () => {
    const route = {
      paramMap: convertToParamMap({}),
    } as ActivatedRouteSnapshot;

    const result = await TestBed.runInInjectionContext(() =>
      recipeDetailResolver(route, {} as RouterStateSnapshot),
    );

    expect(result).toBeNull();
    expect(loadingController.create).not.toHaveBeenCalled();
  });

  it('returns recipe detail when there is an id', async () => {
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

    recipeService.loadRecipeDetail.mockReturnValue(of(data));

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
    expect(recipeService.loadRecipeDetail).toHaveBeenCalledWith(1);
    expect(result).toEqual(data);
    expect(loadingElementMock.dismiss).toHaveBeenCalled();
  });

  it('dismisses loading even if detail request fails', async () => {
    recipeService.loadRecipeDetail.mockReturnValue(
      throwError(() => new Error('detail error')),
    );

    const route = {
      paramMap: convertToParamMap({ id: '1' }),
    } as ActivatedRouteSnapshot;

    await expect(
      TestBed.runInInjectionContext(() =>
        recipeDetailResolver(route, {} as RouterStateSnapshot),
      ),
    ).rejects.toThrow('detail error');

    expect(loadingElementMock.present).toHaveBeenCalled();
    expect(loadingElementMock.dismiss).toHaveBeenCalled();
  });
});
