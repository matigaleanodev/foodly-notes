import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  convertToParamMap,
} from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SimilarRecipe } from '@recipes/models/similar-recipe.model';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { similarRecipesResolver } from './similar-recipes-resolver';

describe('similarRecipesResolver (Vitest)', () => {
  const recipeServiceMock = {
    loadSimilarRecipes: vi.fn(),
  };

  beforeEach(() => {
    recipeServiceMock.loadSimilarRecipes.mockReset();

    TestBed.configureTestingModule({
      providers: [{ provide: RecipeService, useValue: recipeServiceMock }],
    });
  });

  it('returns null when the id param is missing', async () => {
    const route = {
      paramMap: convertToParamMap({}),
    } as ActivatedRouteSnapshot;

    const result = await TestBed.runInInjectionContext(() =>
      similarRecipesResolver(route, {} as RouterStateSnapshot),
    );

    expect(result).toBeNull();
  });

  it('returns similar recipes when the id param exists', async () => {
    const data: SimilarRecipe[] = [
      { sourceId: 1, title: 'Receta similar', image: 'img.jpg' },
    ];

    recipeServiceMock.loadSimilarRecipes.mockReturnValue(of(data));

    const route = {
      paramMap: convertToParamMap({ id: '1' }),
    } as ActivatedRouteSnapshot;

    const result = await TestBed.runInInjectionContext(() =>
      similarRecipesResolver(route, {} as RouterStateSnapshot),
    );

    expect(recipeServiceMock.loadSimilarRecipes).toHaveBeenCalledWith(1);
    expect(result).toEqual(data);
  });
});
