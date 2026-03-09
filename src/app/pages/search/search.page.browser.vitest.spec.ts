import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SearchPage } from './search.page';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';
import { SearchRecipe } from '@recipes/models/search-recipe.model';
import { IonicStorageMock } from '@shared/mocks/ionic-storage.mock';
import { Storage } from '@ionic/storage-angular';

describe('SearchPage (Vitest)', () => {
  let component: SearchPage;
  let fixture: ComponentFixture<SearchPage>;

  const recipesMock: SearchRecipe[] = [
    { sourceId: 1, title: 'Receta buscada', image: '' },
  ];

  const recipeServiceMock = {
    searchRecipes: vi.fn(),
    refreshSearch: vi.fn().mockReturnValue(of(recipesMock)),
    searchRecipesByQuery: vi.fn(),
    openSimilarRecipes: vi.fn(),
    toRecipeDetail: vi.fn(),
  };

  const favoritesServiceMock = {
    loadFavorites: vi.fn(),
    isFavorite: vi.fn().mockReturnValue(false),
    toggleFavorite: vi.fn(),
  };

  beforeEach(async () => {
    recipeServiceMock.searchRecipes.mockClear();
    recipeServiceMock.refreshSearch.mockClear();
    recipeServiceMock.searchRecipesByQuery.mockClear();
    recipeServiceMock.openSimilarRecipes.mockClear();
    recipeServiceMock.toRecipeDetail.mockClear();
    favoritesServiceMock.loadFavorites.mockClear();
    favoritesServiceMock.isFavorite.mockClear();
    favoritesServiceMock.isFavorite.mockReturnValue(false);
    favoritesServiceMock.toggleFavorite.mockClear();

    await TestBed.configureTestingModule({
      imports: [SearchPage],
      providers: [
        { provide: Storage, useClass: IonicStorageMock },
        { provide: RecipeService, useValue: recipeServiceMock },
        { provide: FavoritesService, useValue: favoritesServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchPage);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('q', 'pollo');
    fixture.detectChanges();
  });

  it('creates the page', () => {
    expect(component).toBeTruthy();
  });

  it('loads recipes from query params', () => {
    expect(recipeServiceMock.refreshSearch).toHaveBeenCalledWith('pollo');
    expect(component.recipes()).toEqual(recipesMock);
    expect(component.isLoading()).toBe(false);
  });

  it('loads favorites when entering the view', () => {
    component.ionViewWillEnter();

    expect(favoritesServiceMock.loadFavorites).toHaveBeenCalled();
  });

  it('delegates favorite toggling to the service', () => {
    component.toggleFavorite(recipesMock[0] as unknown as DailyRecipe);

    expect(favoritesServiceMock.toggleFavorite).toHaveBeenCalledWith(
      recipesMock[0],
    );
  });

  it('navigates to similar recipes', () => {
    component.toSimilarRecipes(recipesMock[0] as unknown as DailyRecipe);

    expect(recipeServiceMock.openSimilarRecipes).toHaveBeenCalledWith(
      recipesMock[0],
    );
  });

  it('navigates to recipe detail', () => {
    component.toRecipeDetail(recipesMock[0] as unknown as DailyRecipe);

    expect(recipeServiceMock.toRecipeDetail).toHaveBeenCalledWith(1);
  });

  it('navigates to a new search from the search page', () => {
    component.searchNewRecipes('pollo');

    expect(recipeServiceMock.searchRecipes).toHaveBeenCalledWith('pollo');
    expect(recipeServiceMock.searchRecipesByQuery).not.toHaveBeenCalled();
  });
});
