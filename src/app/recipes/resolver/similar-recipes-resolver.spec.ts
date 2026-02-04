import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  convertToParamMap,
} from '@angular/router';
import { of } from 'rxjs';

import { similarRecipesResolver } from './similar-recipes-resolver';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { SimilarRecipe } from '@recipes/models/similar-recipe.model';

describe('similarRecipesResolver', () => {
  let recipeService: jasmine.SpyObj<RecipeService>;

  beforeEach(() => {
    recipeService = jasmine.createSpyObj<RecipeService>('RecipeService', [
      'loadSimilaRecipes',
    ]);

    TestBed.configureTestingModule({
      providers: [{ provide: RecipeService, useValue: recipeService }],
    });
  });

  it('debería devolver null si no hay id', async () => {
    const route = {
      paramMap: convertToParamMap({}),
    } as ActivatedRouteSnapshot;

    const result = await TestBed.runInInjectionContext(() =>
      similarRecipesResolver(route, {} as RouterStateSnapshot),
    );

    expect(result).toBeNull();
  });

  it('debería devolver las recetas similares cuando hay id', async () => {
    const data: SimilarRecipe[] = [
      { sourceId: 1, title: 'Receta similar', image: 'img.jpg' },
    ];

    recipeService.loadSimilaRecipes.and.resolveTo(of(data));

    const route = {
      paramMap: convertToParamMap({ id: '1' }),
    } as ActivatedRouteSnapshot;

    const result = await TestBed.runInInjectionContext(() =>
      similarRecipesResolver(route, {} as RouterStateSnapshot),
    );

    expect(recipeService.loadSimilaRecipes).toHaveBeenCalledWith(1);
    expect(result).toEqual(data);
  });
});
