import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShoppingRecipeCardComponent } from './shopping-recipe-card.component';
import {
  ShoppingRecipeState,
  ShoppingListService,
} from '@pages/shopping-list/services/shopping-list/shopping-list.service';
import { RecipeInfo } from '@shared/models/recipe.model';

describe('ShoppingRecipeCardComponent', () => {
  let component: ShoppingRecipeCardComponent;
  let fixture: ComponentFixture<ShoppingRecipeCardComponent>;

  const recipeMock: RecipeInfo = {
    id: 1,
    title: 'Receta test',
    extendedIngredients: [
      { id: 10, name: 'Ingrediente 1' },
      { id: 20, name: 'Ingrediente 2' },
    ],
  } as RecipeInfo;

  const shoppingStateMock: ShoppingRecipeState = {
    recipeId: 1,
    checkedIngredientIds: [10],
  };

  const shoppingListServiceMock = {
    isIngredientChecked: jasmine.createSpy(),
    toggleIngredient: jasmine.createSpy(),
  };

  beforeEach(async () => {
    shoppingListServiceMock.isIngredientChecked.and.returnValue(true);
    shoppingListServiceMock.toggleIngredient.and.resolveTo();

    await TestBed.configureTestingModule({
      imports: [ShoppingRecipeCardComponent],
      providers: [
        {
          provide: ShoppingListService,
          useValue: shoppingListServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingRecipeCardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('recipe', recipeMock);
    fixture.componentRef.setInput('shoppingState', shoppingStateMock);

    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería exponer los ingredientes de la receta', () => {
    expect(component.ingredients()).toEqual(recipeMock.extendedIngredients);
  });

  it('debería consultar si un ingrediente está marcado', () => {
    const result = component.isIngredientChecked(10);

    expect(shoppingListServiceMock.isIngredientChecked).toHaveBeenCalledWith(
      1,
      10,
    );
    expect(result).toBeTrue();
  });

  it('debería alternar un ingrediente', async () => {
    await component.toggleIngredient(20);

    expect(shoppingListServiceMock.toggleIngredient).toHaveBeenCalledWith(
      1,
      20,
    );
  });
});
