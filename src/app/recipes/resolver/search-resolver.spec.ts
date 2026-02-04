import { TestBed } from '@angular/core/testing';
import { ResolveFn, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { searchResolver } from './search-resolver';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { SearchRecipe } from '@recipes/models/search-recipe.model';

describe('searchResolver', () => {
  const recipeServiceMock = {
    queryReacipeSearch: jasmine.createSpy('queryReacipeSearch'),
  };

  const executeResolver: ResolveFn<SearchRecipe[]> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => searchResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: RecipeService, useValue: recipeServiceMock }],
    });
  });

  it('debería devolver un array vacío cuando no hay query "q"', async () => {
    const routeStub: any = {
      queryParamMap: convertToParamMap({}),
    };

    const result = await executeResolver(routeStub, {} as any);

    expect(result).toEqual([]);
    expect(recipeServiceMock.queryReacipeSearch).not.toHaveBeenCalled();
  });

  it('debería consultar el service y devolver resultados cuando hay query "q"', async () => {
    const recipesMock: SearchRecipe[] = [
      { sourceId: 1, title: 'Receta 1', image: 'img1' } as SearchRecipe,
      { sourceId: 2, title: 'Receta 2', image: 'img2' } as SearchRecipe,
    ];

    recipeServiceMock.queryReacipeSearch.and.returnValue(of(recipesMock));

    const routeStub: any = {
      queryParamMap: convertToParamMap({ q: 'pollo' }),
    };

    const result = await executeResolver(routeStub, {} as any);

    expect(recipeServiceMock.queryReacipeSearch).toHaveBeenCalledWith('pollo');
    expect(result).toEqual(recipesMock);
  });
});
