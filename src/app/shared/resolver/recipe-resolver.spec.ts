import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { recipeResolver } from './recipe-resolver';
import { RecipeInfo } from '@shared/models/recipe.model';
import { RecipeService } from '@shared/services/recipe/recipe.service';

describe('recipeResolver', () => {
  const executeResolver: ResolveFn<RecipeInfo | null> = (
    ...resolverParameters
  ) =>
    TestBed.runInInjectionContext(() => recipeResolver(...resolverParameters));

  const recipeMock: RecipeInfo = {
    id: 1,
    title: 'Receta test',
  } as RecipeInfo;

  let recipeServiceMock: {
    selectedRecipe: jasmine.Spy;
    recipes: jasmine.Spy;
  };

  beforeEach(() => {
    recipeServiceMock = {
      selectedRecipe: jasmine.createSpy(),
      recipes: jasmine.createSpy(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: RecipeService, useValue: recipeServiceMock }],
    });
  });

  it('debería devolver la receta seleccionada si coincide el id', () => {
    recipeServiceMock.selectedRecipe.and.returnValue(recipeMock);
    recipeServiceMock.recipes.and.returnValue([]);

    const route: any = {
      paramMap: {
        get: () => '1',
      },
    };

    const result = executeResolver(route, {} as any);

    expect(result).toEqual(recipeMock);
  });

  it('debería buscar la receta en la lista si no está seleccionada', () => {
    recipeServiceMock.selectedRecipe.and.returnValue(null);
    recipeServiceMock.recipes.and.returnValue([recipeMock]);

    const route: any = {
      paramMap: {
        get: () => '1',
      },
    };

    const result = executeResolver(route, {} as any);

    expect(result).toEqual(recipeMock);
  });

  it('debería devolver null si la receta no existe', () => {
    recipeServiceMock.selectedRecipe.and.returnValue(null);
    recipeServiceMock.recipes.and.returnValue([]);

    const route: any = {
      paramMap: {
        get: () => '99',
      },
    };

    const result = executeResolver(route, {} as any);

    expect(result).toBeNull();
  });
});
