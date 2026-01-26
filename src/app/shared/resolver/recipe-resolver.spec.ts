import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { recipeResolver } from './recipe-resolver';
import { RecipeInfo } from '@shared/models/recipe.model';

describe('recipeResolver', () => {
  const executeResolver: ResolveFn<RecipeInfo | null> = (
    ...resolverParameters
  ) =>
    TestBed.runInInjectionContext(() => recipeResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
