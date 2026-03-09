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
    toggleFavorite: vi.fn(),
  };

  const recipeServiceMock = {
    openSimilarRecipes: vi.fn(),
    toRecipeDetail: vi.fn(),
  };

  beforeEach(async () => {
    favoritesServiceMock.loadFavorites.mockClear();
    favoritesServiceMock.toggleFavorite.mockClear();
    recipeServiceMock.openSimilarRecipes.mockClear();
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

  it('delegates favorite toggling to the service', () => {
    component.toggleFav(recipeMock);

    expect(favoritesServiceMock.toggleFavorite).toHaveBeenCalledWith(recipeMock);
  });

  it('navigates to similar recipes', () => {
    component.toSimilarRecipes(recipeMock);

    expect(recipeServiceMock.openSimilarRecipes).toHaveBeenCalledWith(
      recipeMock,
      { returnTo: '/favorites' },
    );
  });

  it('navigates to recipe detail', () => {
    component.detalleReceta(recipeMock);

    expect(recipeServiceMock.toRecipeDetail).toHaveBeenCalledWith(1, {
      returnTo: '/favorites',
    });
  });
});
