import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { searchResolver } from './search-resolver';

describe('searchResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => searchResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
