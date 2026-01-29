import { TestBed } from '@angular/core/testing';

import { ShoppingRecipeService } from './shopping-recipe.service';

describe('ShoppingRecipeService', () => {
  let service: ShoppingRecipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShoppingRecipeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
