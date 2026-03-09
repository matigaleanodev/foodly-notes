import { TestBed } from '@angular/core/testing';
import { ResolveFn, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SearchRecipe } from '@recipes/models/search-recipe.model';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { searchResolver } from './search-resolver';

describe('searchResolver (Vitest)', () => {
  const recipeServiceMock = {
    queryReacipeSearch: vi.fn(),
  };

  const executeResolver: ResolveFn<SearchRecipe[]> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => searchResolver(...resolverParameters));

  beforeEach(() => {
    recipeServiceMock.queryReacipeSearch.mockReset();

    TestBed.configureTestingModule({
      providers: [{ provide: RecipeService, useValue: recipeServiceMock }],
    });
  });

  it('returns an empty array when there is no q query param', async () => {
    const routeStub = {
      queryParamMap: convertToParamMap({}),
    };

    const result = await executeResolver(routeStub as any, {} as any);

    expect(result).toEqual([]);
    expect(recipeServiceMock.queryReacipeSearch).not.toHaveBeenCalled();
  });

  it('queries the service and returns results when q is present', async () => {
    const recipesMock: SearchRecipe[] = [
      { sourceId: 1, title: 'Receta 1', image: 'img1' } as SearchRecipe,
      { sourceId: 2, title: 'Receta 2', image: 'img2' } as SearchRecipe,
    ];

    recipeServiceMock.queryReacipeSearch.mockReturnValue(of(recipesMock));

    const routeStub = {
      queryParamMap: convertToParamMap({ q: 'pollo' }),
    };

    const result = await executeResolver(routeStub as any, {} as any);

    expect(recipeServiceMock.queryReacipeSearch).toHaveBeenCalledWith('pollo');
    expect(result).toEqual(recipesMock);
  });
});
