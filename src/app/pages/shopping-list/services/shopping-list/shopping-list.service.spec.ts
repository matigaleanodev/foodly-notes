import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { ShoppingListService } from './shopping-list.service';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { StorageService } from '@shared/services/storage/storage.service';
import { StorageServiceMock } from '@shared/mocks/storage.mock';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';

describe('ShoppingListService', () => {
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

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería inicializar el estado sincronizado con favoritos', async () => {
    favoritesSignal.set([]);
    favoritesSignal.set([recipe1, recipe2]);

    await service.init();

    expect(service.shoppingState()).toEqual([
      { recipeId: 1, checkedIngredientIds: [] },
      { recipeId: 2, checkedIngredientIds: [] },
    ]);
  });

  it('debería mantener solo recetas favoritas existentes al sincronizar', async () => {
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

  it('debería obtener el estado de una receta', async () => {
    await service.init();

    const state = service.getRecipeState(1);

    expect(state?.recipeId).toBe(1);
  });

  it('debería devolver null si no existe el estado de la receta', () => {
    const state = service.getRecipeState(999);

    expect(state).toBeNull();
  });

  it('debería indicar si un ingrediente está marcado', async () => {
    await storage.setItem('SHOPPING_LIST', [
      { recipeId: 1, checkedIngredientIds: [5] },
    ]);

    favoritesSignal.set([recipe1]);

    await service.init();

    expect(service.isIngredientChecked(1, 5)).toBeTrue();
  });

  it('debería marcar un ingrediente y persistir', async () => {
    await service.init();

    await service.toggleIngredient(1, 10);

    const state = service.getRecipeState(1);

    expect(state?.checkedIngredientIds).toContain(10);

    const stored = await storage.getItem<any>('SHOPPING_LIST');
    expect(stored).toEqual(service.shoppingState());
  });

  it('debería desmarcar un ingrediente', async () => {
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
