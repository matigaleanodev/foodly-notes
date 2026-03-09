import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { beforeEach, describe, expect, it } from 'vitest';

import { ShoppingListService } from './shopping-list.service';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { StorageService } from '@shared/services/storage/storage.service';
import { StorageServiceMock } from '@shared/mocks/storage.mock';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';

describe('ShoppingListService (Vitest)', () => {
  let service: ShoppingListService;
  let storage: StorageServiceMock;

  const recipe1: DailyRecipe = { sourceId: 1, title: 'Receta 1', image: '' };
  const recipe2: DailyRecipe = { sourceId: 2, title: 'Receta 2', image: '' };

  const favoritesSignal = signal<DailyRecipe[]>([recipe1, recipe2]);

  const favoritesServiceMock = {
    favorites: favoritesSignal,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ShoppingListService,
        { provide: StorageService, useClass: StorageServiceMock },
        { provide: FavoritesService, useValue: favoritesServiceMock },
      ],
    });

    service = TestBed.inject(ShoppingListService);
    storage = TestBed.inject(StorageService) as unknown as StorageServiceMock;
  });

  it('creates the service', () => {
    expect(service).toBeTruthy();
  });

  it('initializes state synced with favorites', async () => {
    favoritesSignal.set([]);
    favoritesSignal.set([recipe1, recipe2]);

    await service.init();

    expect(service.shoppingState()).toEqual([
      { recipeId: 1, checkedIngredientIds: [] },
      { recipeId: 2, checkedIngredientIds: [] },
    ]);
  });

  it('keeps only still-favorite recipes when syncing stored state', async () => {
    await storage.setItem('SHOPPING_LIST', [
      { recipeId: 1, checkedIngredientIds: [10] },
      { recipeId: 3, checkedIngredientIds: [20] },
    ]);

    favoritesSignal.set([recipe1]);

    await service.init();

    expect(service.shoppingState()).toEqual([
      { recipeId: 1, checkedIngredientIds: [10] },
    ]);
  });

  it('gets the state for an existing recipe', async () => {
    await service.init();

    const state = service.getRecipeState(1);

    expect(state?.recipeId).toBe(1);
  });

  it('returns null when a recipe state does not exist', () => {
    const state = service.getRecipeState(999);

    expect(state).toBeNull();
  });

  it('reports whether an ingredient is checked', async () => {
    await storage.setItem('SHOPPING_LIST', [
      { recipeId: 1, checkedIngredientIds: [5] },
    ]);

    favoritesSignal.set([recipe1]);

    await service.init();

    expect(service.isIngredientChecked(1, 5)).toBe(true);
  });

  it('checks an ingredient and persists state', async () => {
    await service.init();

    await service.toggleIngredient(1, 10);

    const state = service.getRecipeState(1);

    expect(state?.checkedIngredientIds).toContain(10);

    const stored = await storage.getItem<any>('SHOPPING_LIST');
    expect(stored).toEqual(service.shoppingState());
  });

  it('unchecks an ingredient', async () => {
    await storage.setItem('SHOPPING_LIST', [
      { recipeId: 1, checkedIngredientIds: [10] },
    ]);

    favoritesSignal.set([recipe1]);

    await service.init();

    await service.toggleIngredient(1, 10);

    const state = service.getRecipeState(1);

    expect(state?.checkedIngredientIds).not.toContain(10);
  });
});
