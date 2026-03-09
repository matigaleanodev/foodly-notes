import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RecipePage } from './recipe.page';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { TranslateService } from '@shared/translate/translate.service';
import { RecipeDetail } from '@recipes/models/recipe-detail.model';
import { IonicStorageMock } from '@shared/mocks/ionic-storage.mock';
import { Storage } from '@ionic/storage-angular';

describe('RecipePage (Vitest)', () => {
  let component: RecipePage;
  let fixture: ComponentFixture<RecipePage>;

  const recipeMock: RecipeDetail = {
    sourceId: 1,
    title: 'Receta test',
    image: 'image.jpg',
    summary: '',
    instructions: [],
    ingredients: [],
    readyInMinutes: 10,
    cookingMinutes: 10,
    servings: 2,
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    preparationMinutes: 0,
    healthScore: 1,
    aggregateLikes: 1,
    sourceName: '',
    sourceUrl: '',
    lang: 'es',
  };

  const favoritesServiceMock = {
    isFavorite: vi.fn().mockReturnValue(false),
    toggleFavorite: vi.fn(),
  };

  const recipeServiceMock = {
    refreshRecipeDetail: vi.fn().mockReturnValue(of(recipeMock)),
    openSimilarRecipes: vi.fn(),
  };

  const translateServiceMock = {
    currentLang: vi.fn().mockReturnValue('es'),
    translate: vi.fn((key: string) => key),
  };

  beforeEach(async () => {
    favoritesServiceMock.isFavorite.mockClear();
    favoritesServiceMock.isFavorite.mockReturnValue(false);
    favoritesServiceMock.toggleFavorite.mockClear();
    recipeServiceMock.refreshRecipeDetail.mockClear();
    recipeServiceMock.openSimilarRecipes.mockClear();

    await TestBed.configureTestingModule({
      imports: [RecipePage],
      providers: [
        { provide: Storage, useClass: IonicStorageMock },
        { provide: FavoritesService, useValue: favoritesServiceMock },
        { provide: RecipeService, useValue: recipeServiceMock },
        { provide: TranslateService, useValue: translateServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipePage);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('data', recipeMock);

    fixture.detectChanges();
  });

  it('creates the page', () => {
    expect(component).toBeTruthy();
  });

  it('exposes the recipe image', () => {
    expect(component.imageUrl()).toBe('image.jpg');
  });

  it('reports whether the recipe is a favorite', () => {
    favoritesServiceMock.isFavorite.mockReturnValue(true);

    component.recipe.set({ ...recipeMock });

    expect(component.isFavorite()).toBe(true);
  });

  it('delegates favorite toggling to the service', () => {
    component.toggleFavorite();

    expect(favoritesServiceMock.toggleFavorite).toHaveBeenCalledWith({
      sourceId: 1,
      title: 'Receta test',
      image: 'image.jpg',
    });
  });

  it('navigates to similar recipes', () => {
    component.toSimilaRecipes();

    expect(recipeServiceMock.openSimilarRecipes).toHaveBeenCalledWith({
      sourceId: 1,
      title: 'Receta test',
      image: 'image.jpg',
    });
  });

  it('surfaces a refresh error without clearing the current recipe', () => {
    const refresherEvent = {
      target: {
        complete: vi.fn(),
      },
    } as any;

    recipeServiceMock.refreshRecipeDetail.mockReturnValueOnce(
      throwError(() => new Error('refresh failed')),
    );

    component.onRefresh(refresherEvent);

    expect(component.recipe()).toEqual(recipeMock);
    expect(component.errorStateKey()).toBe('xErrorActualizacionReceta');
    expect(refresherEvent.target.complete).toHaveBeenCalled();
  });
});
