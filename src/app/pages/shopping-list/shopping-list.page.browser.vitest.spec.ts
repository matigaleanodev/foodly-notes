import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ShoppingListPage } from './shopping-list.page';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import {
  ShoppingRecipeState,
  ShoppingListService,
} from './services/shopping-list/shopping-list.service';
import { ShoppingRecipesService } from './services/shopping-recipe/shopping-recipe.service';
import { TranslateService } from '@shared/translate/translate.service';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';
import { ShoppingRecipe } from '@recipes/models/shopping-recipe.model';
import { IonicStorageMock } from '@shared/mocks/ionic-storage.mock';
import { TranslatePipeStub } from '@shared/mocks/translate-pipe.mock';
import { Storage } from '@ionic/storage-angular';

describe('ShoppingListPage (Vitest)', () => {
  let component: ShoppingListPage;
  let fixture: ComponentFixture<ShoppingListPage>;

  const recipeMock: DailyRecipe = {
    sourceId: 1,
    title: 'Receta test',
    image: '',
  };

  const shoppingRecipeMock: ShoppingRecipe = {
    sourceId: 1,
    title: 'Receta test',
    ingredients: [],
  };

  const shoppingStateMock: ShoppingRecipeState[] = [
    {
      recipeId: 1,
      checkedIngredientIds: [10, 20],
    },
  ];

  const shoppingListServiceMock = {
    shoppingState: vi.fn().mockReturnValue(shoppingStateMock),
    init: vi.fn().mockResolvedValue(undefined),
  };

  const favoritesServiceMock = {
    favorites: vi.fn().mockReturnValue([recipeMock]),
    loadFavorites: vi.fn().mockResolvedValue(undefined),
  };

  const shoppingRecipesServiceMock = {
    recipes: vi.fn().mockReturnValue([]),
    sync: vi.fn().mockResolvedValue(undefined),
    refreshSync: vi.fn().mockReturnValue(of([])),
  };

  const translateServiceMock = {
    currentLang: vi.fn().mockReturnValue('es'),
    translate: vi.fn((key: string) => key),
  };

  const recipeServiceMock = {
    selectRecipe: vi.fn(),
    toRecipeDetail: vi.fn(),
  };

  beforeEach(async () => {
    shoppingListServiceMock.shoppingState.mockClear();
    shoppingListServiceMock.init.mockClear();
    favoritesServiceMock.favorites.mockClear();
    favoritesServiceMock.loadFavorites.mockClear();
    shoppingRecipesServiceMock.recipes.mockClear();
    shoppingRecipesServiceMock.sync.mockClear();
    shoppingRecipesServiceMock.refreshSync.mockClear();
    recipeServiceMock.selectRecipe.mockClear();
    recipeServiceMock.toRecipeDetail.mockClear();

    await TestBed.configureTestingModule({
      imports: [ShoppingListPage, TranslatePipeStub],
      providers: [
        { provide: Storage, useClass: IonicStorageMock },
        { provide: ShoppingListService, useValue: shoppingListServiceMock },
        { provide: FavoritesService, useValue: favoritesServiceMock },
        {
          provide: ShoppingRecipesService,
          useValue: shoppingRecipesServiceMock,
        },
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: RecipeService, useValue: recipeServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the page', () => {
    expect(component).toBeTruthy();
  });

  it('exposes shopping list state', () => {
    expect(component.shoppingState()).toEqual(shoppingStateMock);
  });

  it('exposes favorite recipes', () => {
    expect(component.favoritos()).toEqual([recipeMock]);
  });

  it('returns the state of a recipe', () => {
    const state = component.getShoppingState(1);

    expect(state).toEqual(shoppingStateMock[0]);
  });

  it('loads favorites and syncs data on view enter', async () => {
    await component.ionViewWillEnter();

    expect(favoritesServiceMock.loadFavorites).toHaveBeenCalled();
    expect(shoppingListServiceMock.init).toHaveBeenCalled();
    expect(shoppingRecipesServiceMock.sync).toHaveBeenCalled();
    expect(component.isLoading()).toBe(false);
  });

  it('navigates to recipe detail preserving shopping list context', () => {
    component.toRecipeDetail(shoppingRecipeMock);

    expect(recipeServiceMock.selectRecipe).toHaveBeenCalledWith({
      ...shoppingRecipeMock,
      image: '',
    });
    expect(recipeServiceMock.toRecipeDetail).toHaveBeenCalledWith(1, {
      returnTo: '/shopping-list',
    });
  });
});
