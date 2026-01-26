import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShoppingListPage } from './shopping-list.page';
import { RecipeInfo } from '@shared/models/recipe.model';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import {
  ShoppingRecipeState,
  ShoppingListService,
} from './services/shopping-list/shopping-list.service';

describe('ShoppingListPage', () => {
  let component: ShoppingListPage;
  let fixture: ComponentFixture<ShoppingListPage>;

  const recipeMock: RecipeInfo = {
    id: 1,
    title: 'Receta test',
  } as RecipeInfo;

  const shoppingStateMock: ShoppingRecipeState[] = [
    {
      recipeId: 1,
      checkedIngredientIds: [10, 20],
    },
  ];

  const shoppingListServiceMock = {
    shoppingState: jasmine.createSpy(),
    init: jasmine.createSpy(),
  };

  const favoritesServiceMock = {
    favoritos: jasmine.createSpy(),
    cargarFavoritos: jasmine.createSpy(),
  };

  beforeEach(async () => {
    shoppingListServiceMock.shoppingState.and.returnValue(shoppingStateMock);
    favoritesServiceMock.favoritos.and.returnValue([recipeMock]);

    await TestBed.configureTestingModule({
      imports: [ShoppingListPage],
      providers: [
        {
          provide: ShoppingListService,
          useValue: shoppingListServiceMock,
        },
        {
          provide: FavoritesService,
          useValue: favoritesServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar favoritos e inicializar el shopping list al entrar a la vista', async () => {
    await component.ionViewWillEnter();

    expect(favoritesServiceMock.cargarFavoritos).toHaveBeenCalled();
    expect(shoppingListServiceMock.init).toHaveBeenCalled();
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
});
