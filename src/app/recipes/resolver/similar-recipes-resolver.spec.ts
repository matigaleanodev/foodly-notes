import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { SimilarRecipe } from '@recipes/models/similar-recipe.model';
import { similarRecipesResolver } from './similar-recipes-resolver';

describe('similarRecipesResolver', () => {
  let recipeService: jasmine.SpyObj<RecipeService>;

  beforeEach(() => {
    recipeService = jasmine.createSpyObj('RecipeService', [
      'buscartoSimilarRecipes',
    ]);

    TestBed.configureTestingModule({
      providers: [{ provide: RecipeService, useValue: recipeService }],
    });
  });

  it('debería devolver null si no hay id', async () => {
    const route = {
      paramMap: new Map(),
    } as unknown as ActivatedRouteSnapshot;

    const result = await TestBed.runInInjectionContext(() =>
      similarRecipesResolver(route, {} as RouterStateSnapshot),
    );

    expect(result).toBeNull();
  });

  it('debería devolver las recetas similares', async () => {
    const data: SimilarRecipe[] = [
      { id: 1, title: 'Receta similar', image: 'img.jpg' },
    ];

    recipeService.loadSimilaRecipes.and.returnValue(Promise.resolve(of(data)));

    const route = {
      paramMap: new Map([['id', '1']]),
    } as unknown as ActivatedRouteSnapshot;

    const result = await TestBed.runInInjectionContext(() =>
      similarRecipesResolver(route, {} as RouterStateSnapshot),
    );

    expect(recipeService.loadSimilaRecipes).toHaveBeenCalledWith(1);
    expect(result).toEqual(data);
  });
});
