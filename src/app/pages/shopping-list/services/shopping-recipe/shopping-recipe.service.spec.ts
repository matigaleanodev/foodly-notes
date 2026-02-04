import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';

import { ShoppingRecipesService } from './shopping-recipe.service';
import { RecipeApiService } from '@recipes/services/recipe-api/recipe-api.service';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { ShoppingRecipe } from '@recipes/models/shopping-recipe.model';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';

describe('ShoppingRecipesService', () => {
  let service: ShoppingRecipesService;

  const favoritesMock: DailyRecipe[] = [
    { sourceId: 1, title: 'Receta 1', image: '' },
    { sourceId: 2, title: 'Receta 2', image: '' },
  ];

  const shoppingRecipesMock: ShoppingRecipe[] = [
    { sourceId: 1, title: 'Receta 1', ingredients: [] },
    { sourceId: 2, title: 'Receta 2', ingredients: [] },
  ];

  const favoritesServiceMock = {
    favorites: signal<DailyRecipe[]>(favoritesMock),
  };

  const apiServiceMock = {
    getIngredientsForRecipes: jasmine
      .createSpy('getIngredientsForRecipes')
      .and.returnValue(of(shoppingRecipesMock)),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ShoppingRecipesService,
        { provide: FavoritesService, useValue: favoritesServiceMock },
        { provide: RecipeApiService, useValue: apiServiceMock },
      ],
    });

    service = TestBed.inject(ShoppingRecipesService);
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('sync debería cargar recetas nuevas basadas en favoritos', async () => {
    await service.sync();

    expect(apiServiceMock.getIngredientsForRecipes).toHaveBeenCalledWith([
      1, 2,
    ]);
    expect(service.recipes()).toEqual(shoppingRecipesMock);
  });

  it('refreshSync(false) no debería llamar a la API si no hay nuevos', (done) => {
    apiServiceMock.getIngredientsForRecipes.calls.reset();

    service.recipes.set(shoppingRecipesMock);

    service.refreshSync(false).subscribe((result) => {
      expect(apiServiceMock.getIngredientsForRecipes).not.toHaveBeenCalled();
      expect(result).toEqual(shoppingRecipesMock);
      done();
    });
  });

  it('refreshSync(true) debería forzar la recarga completa', (done) => {
    service.recipes.set([]);

    service.refreshSync(true).subscribe((result) => {
      expect(apiServiceMock.getIngredientsForRecipes).toHaveBeenCalledWith([
        1, 2,
      ]);
      expect(result).toEqual(shoppingRecipesMock);
      done();
    });
  });

  it('getRecipe debería devolver la receta si existe', () => {
    service.recipes.set(shoppingRecipesMock);

    const recipe = service.getRecipe(1);

    expect(recipe).toEqual(shoppingRecipesMock[0]);
  });

  it('getRecipe debería devolver null si no existe', () => {
    service.recipes.set(shoppingRecipesMock);

    const recipe = service.getRecipe(999);

    expect(recipe).toBeNull();
  });
});
