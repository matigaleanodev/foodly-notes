import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShoppingListPage } from './shopping-list.page';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import {
  ShoppingRecipeState,
  ShoppingListService,
} from './services/shopping-list/shopping-list.service';
import { ShoppingRecipesService } from './services/shopping-recipe/shopping-recipe.service';
import { LoadingService } from '@shared/services/loading/loading.service';
import { TranslateService } from '@shared/translate/translate.service';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';
import { of } from 'rxjs';
import { IonicStorageMock } from '@shared/mocks/ionic-storage.mock';
import { TranslatePipeStub } from '@shared/mocks/translate-pipe.mock';
import { Storage } from '@ionic/storage-angular';

describe('ShoppingListPage', () => {
  let component: ShoppingListPage;
  let fixture: ComponentFixture<ShoppingListPage>;

  const recipeMock: DailyRecipe = {
    sourceId: 1,
    title: 'Receta test',
    image: '',
  };

  const shoppingStateMock: ShoppingRecipeState[] = [
    {
      recipeId: 1,
      checkedIngredientIds: [10, 20],
    },
  ];

  const shoppingListServiceMock = {
    shoppingState: jasmine.createSpy().and.returnValue(shoppingStateMock),
    init: jasmine.createSpy().and.resolveTo(),
  };

  const favoritesServiceMock = {
    favorites: jasmine.createSpy().and.returnValue([recipeMock]),
    loadFavorites: jasmine.createSpy().and.resolveTo(),
  };

  const shoppingRecipesServiceMock = {
    recipes: jasmine.createSpy().and.returnValue([]),
    sync: jasmine.createSpy().and.resolveTo(),
    refreshSync: jasmine.createSpy().and.returnValue(of([])),
  };

  const loadingMock = {
    dismiss: jasmine.createSpy('dismiss'),
  };

  const loadingServiceMock = {
    show: jasmine.createSpy().and.resolveTo(loadingMock),
  };

  const translateServiceMock = {
    currentLang: jasmine.createSpy().and.returnValue('es'),
    translate: (key: string) => key,
  };

  const recipeServiceMock = {
    selectRecipe: jasmine.createSpy(),
    toRecipeDetail: jasmine.createSpy(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingListPage, TranslatePipeStub],
      providers: [
        { provide: Storage, useValue: IonicStorageMock },
        { provide: ShoppingListService, useValue: shoppingListServiceMock },
        { provide: FavoritesService, useValue: favoritesServiceMock },
        {
          provide: ShoppingRecipesService,
          useValue: shoppingRecipesServiceMock,
        },
        { provide: LoadingService, useValue: loadingServiceMock },
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: RecipeService, useValue: recipeServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería exponer el estado del shopping list', () => {
    expect(component.shoppingState()).toEqual(shoppingStateMock);
  });

  it('debería exponer los favoritos', () => {
    expect(component.favoritos()).toEqual([recipeMock]);
  });

  it('debería devolver el estado de una receta', () => {
    const state = component.getShoppingState(1);

    expect(state).toEqual(shoppingStateMock[0]);
  });

  it('debería cargar favoritos y sincronizar al entrar a la vista', async () => {
    await component.ionViewWillEnter();

    expect(loadingServiceMock.show).toHaveBeenCalled();
    expect(favoritesServiceMock.loadFavorites).toHaveBeenCalled();
    expect(shoppingListServiceMock.init).toHaveBeenCalled();
    expect(shoppingRecipesServiceMock.sync).toHaveBeenCalled();
    expect(loadingMock.dismiss).toHaveBeenCalled();
  });
});
