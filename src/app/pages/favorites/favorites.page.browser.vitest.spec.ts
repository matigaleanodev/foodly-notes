import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FavoritesPage } from './favorites.page';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';
import { TranslatePipeStub } from '@shared/mocks/translate-pipe.mock';
import { Storage } from '@ionic/storage-angular';
import { IonicStorageMock } from '@shared/mocks/ionic-storage.mock';

describe('FavoritesPage (Vitest)', () => {
  let component: FavoritesPage;
  let fixture: ComponentFixture<FavoritesPage>;

  const recipeMock: DailyRecipe = {
    sourceId: 1,
    title: 'Receta test',
    image: '',
  };

  const favoritesServiceMock = {
    favorites: signal<DailyRecipe[]>([recipeMock]),
    loadFavorites: vi.fn().mockResolvedValue(undefined),
    isFavorite: vi.fn().mockReturnValue(true),
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
  };

  const recipeServiceMock = {
    selectRecipe: vi.fn(),
    toSimilarRecipes: vi.fn(),
    toRecipeDetail: vi.fn(),
  };

  beforeEach(async () => {
    favoritesServiceMock.loadFavorites.mockClear();
    favoritesServiceMock.isFavorite.mockClear();
    favoritesServiceMock.isFavorite.mockReturnValue(true);
    favoritesServiceMock.addFavorite.mockClear();
    favoritesServiceMock.removeFavorite.mockClear();
    recipeServiceMock.selectRecipe.mockClear();
    recipeServiceMock.toSimilarRecipes.mockClear();
    recipeServiceMock.toRecipeDetail.mockClear();

    await TestBed.configureTestingModule({
      imports: [FavoritesPage, TranslatePipeStub],
      providers: [
        { provide: Storage, useClass: IonicStorageMock },
        { provide: FavoritesService, useValue: favoritesServiceMock },
        { provide: RecipeService, useValue: recipeServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the page', () => {
    expect(component).toBeTruthy();
  });

  it('loads favorites when entering the view', async () => {
    await component.ionViewWillEnter();

    expect(favoritesServiceMock.loadFavorites).toHaveBeenCalled();
    expect(component.isLoading()).toBe(false);
  });

  it('exposes favorites from the service', () => {
    expect(component.favorites()).toEqual([recipeMock]);
  });

  it('removes a favorite when it is already stored', () => {
    favoritesServiceMock.isFavorite.mockReturnValue(true);

    component.toggleFav(recipeMock);

    expect(favoritesServiceMock.removeFavorite).toHaveBeenCalledWith(1);
  });

  it('adds a favorite when it is not stored yet', () => {
    favoritesServiceMock.isFavorite.mockReturnValue(false);

    component.toggleFav(recipeMock);

    expect(favoritesServiceMock.addFavorite).toHaveBeenCalledWith(recipeMock);
  });

  it('navigates to similar recipes', () => {
    component.toSimilarRecipes(recipeMock);

    expect(recipeServiceMock.selectRecipe).toHaveBeenCalledWith(recipeMock);
    expect(recipeServiceMock.toSimilarRecipes).toHaveBeenCalledWith(1);
  });

  it('navigates to recipe detail', () => {
    component.detalleReceta(recipeMock);

    expect(recipeServiceMock.toRecipeDetail).toHaveBeenCalledWith(1);
  });
});
