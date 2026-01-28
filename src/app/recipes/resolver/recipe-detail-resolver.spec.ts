import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { recipeDetailResolver } from './recipe-detail-resolver';

describe('recipeDetailResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => recipeDetailResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
