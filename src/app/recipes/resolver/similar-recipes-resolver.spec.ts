import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { similarRecipesResolver } from './similar-recipes-resolver';

describe('similarRecipesResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => similarRecipesResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
