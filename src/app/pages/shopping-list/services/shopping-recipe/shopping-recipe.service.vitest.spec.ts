import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { firstValueFrom, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ShoppingRecipesService } from './shopping-recipe.service';
import { RecipeApiService } from '@recipes/services/recipe-api/recipe-api.service';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { ShoppingRecipe } from '@recipes/models/shopping-recipe.model';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';

describe('ShoppingRecipesService (Vitest)', () => {
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
    getIngredientsForRecipes: vi.fn(),
  };

  beforeEach(() => {
    apiServiceMock.getIngredientsForRecipes.mockReset();
    apiServiceMock.getIngredientsForRecipes.mockReturnValue(
      of(shoppingRecipesMock),
    );

    TestBed.configureTestingModule({
      providers: [
        ShoppingRecipesService,
        { provide: FavoritesService, useValue: favoritesServiceMock },
        { provide: RecipeApiService, useValue: apiServiceMock },
      ],
    });

    service = TestBed.inject(ShoppingRecipesService);
  });

  it('creates the service', () => {
    expect(service).toBeTruthy();
  });

  it('sync loads new recipes based on favorites', async () => {
    await service.sync();

    expect(apiServiceMock.getIngredientsForRecipes).toHaveBeenCalledWith([
      1, 2,
    ]);
    expect(service.recipes()).toEqual(shoppingRecipesMock);
  });

  it('refreshSync(false) skips the API when there are no new recipes', async () => {
    service.recipes.set(shoppingRecipesMock);

    const result = await firstValueFrom(service.refreshSync(false));

    expect(apiServiceMock.getIngredientsForRecipes).not.toHaveBeenCalled();
    expect(result).toEqual(shoppingRecipesMock);
  });

  it('refreshSync(true) forces a full reload', async () => {
    service.recipes.set([]);

    const result = await firstValueFrom(service.refreshSync(true));

    expect(apiServiceMock.getIngredientsForRecipes).toHaveBeenCalledWith([
      1, 2,
    ]);
    expect(result).toEqual(shoppingRecipesMock);
  });

  it('getRecipe returns the recipe when present', () => {
    service.recipes.set(shoppingRecipesMock);

    const recipe = service.getRecipe(1);

    expect(recipe).toEqual(shoppingRecipesMock[0]);
  });

  it('getRecipe returns null when missing', () => {
    service.recipes.set(shoppingRecipesMock);

    const recipe = service.getRecipe(999);

    expect(recipe).toBeNull();
  });
});
