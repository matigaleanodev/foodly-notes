import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RecipeService } from './recipe.service';
import { RecipeApiService } from '../recipe-api/recipe-api.service';
import { NavService } from '@shared/services/nav/nav.service';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';
import { StorageService } from '@shared/services/storage/storage.service';

describe('RecipeService (Vitest)', () => {
  let service: RecipeService;

  const recipesMock: DailyRecipe[] = [
    { sourceId: 1, title: 'Receta 1', image: 'img1' },
    { sourceId: 2, title: 'Receta 2', image: 'img2' },
  ];

  const apiMock = {
    getDailyRecipes: vi.fn(),
    getRecipeDetail: vi.fn(),
    getSimilarRecipes: vi.fn(),
    getRecipesByQuery: vi.fn(),
  };

  const navMock = {
    search: vi.fn(),
    forward: vi.fn(),
  };

  const storageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
  };

  beforeEach(() => {
    apiMock.getDailyRecipes.mockReset();
    apiMock.getRecipeDetail.mockReset();
    apiMock.getSimilarRecipes.mockReset();
    apiMock.getRecipesByQuery.mockReset();
    navMock.search.mockReset();
    navMock.forward.mockReset();
    storageMock.getItem.mockReset();
    storageMock.setItem.mockReset();

    apiMock.getDailyRecipes.mockReturnValue(of(recipesMock));
    apiMock.getRecipeDetail.mockReturnValue(of({}));
    apiMock.getSimilarRecipes.mockReturnValue(of([]));
    apiMock.getRecipesByQuery.mockReturnValue(of([]));
    storageMock.getItem.mockResolvedValue(null);
    storageMock.setItem.mockResolvedValue(undefined);

    TestBed.configureTestingModule({
      providers: [
        RecipeService,
        { provide: RecipeApiService, useValue: apiMock },
        { provide: NavService, useValue: navMock },
        { provide: StorageService, useValue: storageMock },
      ],
    });

    service = TestBed.inject(RecipeService);
  });

  it('creates the service', () => {
    expect(service).toBeTruthy();
  });

  it('loads daily recipes and updates the signal', async () => {
    await service.loadDailyRecipes();

    expect(storageMock.getItem).toHaveBeenCalledWith('daily_recipes');
    expect(apiMock.getDailyRecipes).toHaveBeenCalled();
    expect(service.recipes()).toEqual(recipesMock);
  });

  it('reuses same-day cache and skips the API', async () => {
    storageMock.getItem.mockResolvedValue({
      recipes: recipesMock,
      date: new Date().toISOString().split('T')[0],
    });

    await service.loadDailyRecipes();

    expect(apiMock.getDailyRecipes).not.toHaveBeenCalled();
    expect(service.recipes()).toEqual(recipesMock);
  });

  it('persists daily recipes when the API responds', async () => {
    await service.loadDailyRecipes();

    expect(storageMock.setItem).toHaveBeenCalledWith('daily_recipes', {
      recipes: recipesMock,
      date: new Date().toISOString().split('T')[0],
    });
  });

  it('falls back to stale cache when the API fails', async () => {
    storageMock.getItem.mockResolvedValue({
      recipes: recipesMock,
      date: '2000-01-01',
    });
    apiMock.getDailyRecipes.mockReturnValue(
      throwError(() => new Error('network error')),
    );

    await service.loadDailyRecipes();

    expect(service.recipes()).toEqual(recipesMock);
  });

  it('refreshes daily recipes without loading state', async () => {
    const result = await new Promise((resolve) => {
      service.refreshDailyRecipes().subscribe((value) => resolve(value));
    });

    expect(result).toEqual(recipesMock);
    expect(service.recipes()).toEqual(recipesMock);
    expect(storageMock.setItem).toHaveBeenCalledWith('daily_recipes', {
      recipes: recipesMock,
      date: new Date().toISOString().split('T')[0],
    });
  });

  it('loads recipe detail from the API without wrapping the observable in a promise', async () => {
    const detail = { sourceId: 10 };
    apiMock.getRecipeDetail.mockReturnValue(of(detail));

    const result = await new Promise((resolve) => {
      service.loadRecipeDetail(10).subscribe((value) => resolve(value));
    });

    expect(apiMock.getRecipeDetail).toHaveBeenCalledWith(10);
    expect(result).toEqual(detail);
  });

  it('loads similar recipes from the API without wrapping the observable in a promise', async () => {
    const similarRecipes = [{ sourceId: 5 }];
    apiMock.getSimilarRecipes.mockReturnValue(of(similarRecipes));

    const result = await new Promise((resolve) => {
      service.loadSimilarRecipes(5).subscribe((value) => resolve(value));
    });

    expect(apiMock.getSimilarRecipes).toHaveBeenCalledWith(5);
    expect(result).toEqual(similarRecipes);
  });

  it('loads search results from the API without wrapping the observable in a promise', async () => {
    const searchResults = [{ sourceId: 7, title: 'Receta', image: 'img' }];
    apiMock.getRecipesByQuery.mockReturnValue(of(searchResults));

    const result = await new Promise((resolve) => {
      service.searchRecipesByQuery('pollo').subscribe((value) => resolve(value));
    });

    expect(apiMock.getRecipesByQuery).toHaveBeenCalledWith('pollo');
    expect(result).toEqual(searchResults);
  });

  it('selects a recipe', () => {
    service.selectRecipe(recipesMock[0]);

    expect(service.recipeSelected()).toEqual(recipesMock[0]);
  });

  it('opens similar recipes using the selected recipe context', () => {
    service.openSimilarRecipes(recipesMock[0]);

    expect(service.recipeSelected()).toEqual(recipesMock[0]);
    expect(navMock.forward).toHaveBeenCalledWith('similar/1', {
      returnTo: undefined,
    });
  });

  it('navigates to search', () => {
    service.searchRecipes('pollo');

    expect(navMock.search).toHaveBeenCalledWith('pollo');
  });

  it('navigates to recipe detail', () => {
    service.toRecipeDetail(10);

    expect(navMock.forward).toHaveBeenCalledWith('recipe/10', {
      returnTo: undefined,
    });
  });

  it('navigates to similar recipes', () => {
    service.toSimilarRecipes(5);

    expect(navMock.forward).toHaveBeenCalledWith('similar/5', {
      returnTo: undefined,
    });
  });
});
