import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SimilarPage } from './similar.page';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { TranslateService } from '@shared/translate/translate.service';
import { SimilarRecipe } from '@recipes/models/similar-recipe.model';

describe('SimilarPage (Vitest)', () => {
  let component: SimilarPage;
  let fixture: ComponentFixture<SimilarPage>;

  const recipesMock: SimilarRecipe[] = [
    { sourceId: 1, title: 'Receta similar', image: '' },
  ];

  const recipeServiceMock = {
    recipeSelected: signal<unknown>(null),
    refreshSimilarRecipes: vi.fn().mockReturnValue(of(recipesMock)),
    selectRecipe: vi.fn(),
    toSimilarRecipes: vi.fn(),
    toRecipeDetail: vi.fn(),
  };

  const favoritesServiceMock = {
    loadFavorites: vi.fn(),
    isFavorite: vi.fn().mockReturnValue(false),
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
  };

  const translateMock = {
    translate: vi.fn((key: string) => key),
  };

  beforeEach(async () => {
    recipeServiceMock.refreshSimilarRecipes.mockClear();
    recipeServiceMock.selectRecipe.mockClear();
    recipeServiceMock.toSimilarRecipes.mockClear();
    recipeServiceMock.toRecipeDetail.mockClear();
    favoritesServiceMock.loadFavorites.mockClear();
    favoritesServiceMock.isFavorite.mockClear();
    favoritesServiceMock.isFavorite.mockReturnValue(false);
    favoritesServiceMock.addFavorite.mockClear();
    favoritesServiceMock.removeFavorite.mockClear();
    translateMock.translate.mockClear();

    await TestBed.configureTestingModule({
      imports: [SimilarPage],
      providers: [
        { provide: RecipeService, useValue: recipeServiceMock },
        { provide: FavoritesService, useValue: favoritesServiceMock },
        { provide: TranslateService, useValue: translateMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SimilarPage);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('id', '1');
    fixture.detectChanges();
  });

  it('creates the page', () => {
    expect(component).toBeTruthy();
  });

  it('loads similar recipes from params', () => {
    expect(recipeServiceMock.refreshSimilarRecipes).toHaveBeenCalledWith(1);
    expect(component.recipes()).toEqual(recipesMock);
    expect(component.isLoading()).toBe(false);
    expect(component.errorStateKey()).toBeNull();
  });

  it('computes the subtitle without a selected recipe', () => {
    recipeServiceMock.recipeSelected.set(null);

    expect(component.subtitle()).toBe('xRecetasRecomendadas');
  });

  it('loads favorites when entering the view', () => {
    component.ionViewWillEnter();

    expect(favoritesServiceMock.loadFavorites).toHaveBeenCalled();
  });

  it('adds a favorite when the recipe is not already saved', () => {
    favoritesServiceMock.isFavorite.mockReturnValue(false);

    component.toggleFavorite(recipesMock[0]);

    expect(favoritesServiceMock.addFavorite).toHaveBeenCalledWith(
      recipesMock[0],
    );
  });

  it('removes a favorite when the recipe is already saved', () => {
    favoritesServiceMock.isFavorite.mockReturnValue(true);

    component.toggleFavorite(recipesMock[0]);

    expect(favoritesServiceMock.removeFavorite).toHaveBeenCalledWith(1);
  });

  it('navigates to similar recipes', () => {
    component.toSimilarRecipes(recipesMock[0]);

    expect(recipeServiceMock.selectRecipe).toHaveBeenCalledWith(recipesMock[0]);
    expect(recipeServiceMock.toSimilarRecipes).toHaveBeenCalledWith(1);
  });

  it('navigates to recipe detail', () => {
    component.detalleReceta(recipesMock[0]);

    expect(recipeServiceMock.toRecipeDetail).toHaveBeenCalledWith(1);
  });

  it('exposes an empty-state key when there are no similar recipes', async () => {
    recipeServiceMock.refreshSimilarRecipes.mockReturnValueOnce(of([]));

    fixture.componentRef.setInput('id', '2');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.recipes()).toEqual([]);
    expect(component.emptyStateKey()).toBe('xSinRecetasSimilares');
  });

  it('exposes an error-state key when similar recipes fail to load', async () => {
    recipeServiceMock.refreshSimilarRecipes.mockReturnValueOnce(
      throwError(() => new Error('similar failed')),
    );

    fixture.componentRef.setInput('id', '2');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.recipes()).toEqual([]);
    expect(component.errorStateKey()).toBe('xErrorRecetasSimilares');
    expect(component.emptyStateKey()).toBe('xErrorRecetasSimilares');
  });
});
