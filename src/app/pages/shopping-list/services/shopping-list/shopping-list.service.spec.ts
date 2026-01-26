import { TestBed } from '@angular/core/testing';

import { ShoppingListService } from './shopping-list.service';
import { RecipeInfo } from '@shared/models/recipe.model';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { StorageService } from '@shared/services/storage/storage.service';

describe('ShoppingListService', () => {
  let service: ShoppingListService;

  const recipe1: RecipeInfo = { id: 1, title: 'Receta 1' } as RecipeInfo;
  const recipe2: RecipeInfo = { id: 2, title: 'Receta 2' } as RecipeInfo;

  const storageMock = {
    getItem: jasmine.createSpy(),
    setItem: jasmine.createSpy(),
  };

  const favoritesServiceMock = {
    favoritos: jasmine.createSpy(),
  };

  beforeEach(() => {
    storageMock.getItem.and.resolveTo(null);
    favoritesServiceMock.favoritos.and.returnValue([recipe1, recipe2]);

    TestBed.configureTestingModule({
      providers: [
        ShoppingListService,
        { provide: StorageService, useValue: storageMock },
        { provide: FavoritesService, useValue: favoritesServiceMock },
      ],
    });

    service = TestBed.inject(ShoppingListService);
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería inicializar el estado sincronizado con favoritos', async () => {
    await service.init();

    expect(service.shoppingState()).toEqual([
      { recipeId: 1, checkedIngredientIds: [] },
      { recipeId: 2, checkedIngredientIds: [] },
    ]);
  });

  it('debería mantener solo recetas favoritas existentes al sincronizar', async () => {
    storageMock.getItem.and.resolveTo([
      { recipeId: 1, checkedIngredientIds: [10] },
      { recipeId: 3, checkedIngredientIds: [20] },
    ]);

    favoritesServiceMock.favoritos.and.returnValue([recipe1]);

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
    storageMock.getItem.and.resolveTo([
      { recipeId: 1, checkedIngredientIds: [5] },
    ]);

    favoritesServiceMock.favoritos.and.returnValue([recipe1]);

    await service.init();

    const result = service.isIngredientChecked(1, 5);

    expect(result).toBeTrue();
  });

  it('debería marcar un ingrediente', async () => {
    await service.init();

    await service.toggleIngredient(1, 10);

    const state = service.getRecipeState(1);

    expect(state?.checkedIngredientIds).toContain(10);
    expect(storageMock.setItem).toHaveBeenCalled();
  });

  it('debería desmarcar un ingrediente', async () => {
    storageMock.getItem.and.resolveTo([
      { recipeId: 1, checkedIngredientIds: [10] },
    ]);

    favoritesServiceMock.favoritos.and.returnValue([recipe1]);

    await service.init();

    await service.toggleIngredient(1, 10);

    const state = service.getRecipeState(1);

    expect(state?.checkedIngredientIds).not.toContain(10);
  });

  it('debería limpiar una receta del shopping list', async () => {
    await service.init();

    await service.clearRecipe(1);

    expect(service.shoppingState()).toEqual([
      { recipeId: 2, checkedIngredientIds: [] },
    ]);
    expect(storageMock.setItem).toHaveBeenCalled();
  });
});
