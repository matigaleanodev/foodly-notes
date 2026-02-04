import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingRecipeCardComponent } from './shopping-recipe-card.component';
import {
  ShoppingRecipeState,
  ShoppingListService,
} from '@pages/shopping-list/services/shopping-list/shopping-list.service';
import { ShoppingRecipe } from '@recipes/models/shopping-recipe.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslatePipeStub } from '@shared/mocks/translate-pipe.mock';
import { IonicStorageMock } from '@shared/mocks/ionic-storage.mock';
import { Storage } from '@ionic/storage-angular';

describe('ShoppingRecipeCardComponent', () => {
  let component: ShoppingRecipeCardComponent;
  let fixture: ComponentFixture<ShoppingRecipeCardComponent>;

  const recipeMock: ShoppingRecipe = {
    sourceId: 1,
    title: 'Receta test',
    ingredients: [
      {
        id: 10,
        name: 'Ingrediente 1',
        original: '',
        amount: 1,
        unit: '',
        image: '',
      },
      {
        id: 20,
        name: 'Ingrediente 2',
        original: '',
        amount: 1,
        unit: '',
        image: '',
      },
    ],
  };

  const shoppingStateMock: ShoppingRecipeState = {
    recipeId: 1,
    checkedIngredientIds: [10],
  };

  const shoppingListServiceMock = {
    isIngredientChecked: jasmine
      .createSpy('isIngredientChecked')
      .and.returnValue(true),
    toggleIngredient: jasmine.createSpy('toggleIngredient').and.resolveTo(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingRecipeCardComponent, TranslatePipeStub],
      providers: [
        { provide: Storage, useValue: IonicStorageMock },
        {
          provide: ShoppingListService,
          useValue: shoppingListServiceMock,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
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
    expect(component.ingredients()).toEqual(recipeMock.ingredients);
  });

  it('debería consultar si un ingrediente está marcado', () => {
    const result = component.isIngredientChecked(10);

    expect(shoppingListServiceMock.isIngredientChecked).toHaveBeenCalledWith(
      1,
      10,
    );
    expect(result).toBeTrue();
  });

  it('debería alternar un ingrediente y detener la propagación del evento', async () => {
    const eventMock = {
      stopPropagation: jasmine.createSpy('stopPropagation'),
    } as unknown as Event;

    await component.toggleIngredient(eventMock, 20);

    expect(eventMock.stopPropagation).toHaveBeenCalled();
    expect(shoppingListServiceMock.toggleIngredient).toHaveBeenCalledWith(
      1,
      20,
    );
  });

  it('debería emitir el evento para ir a la receta', () => {
    spyOn(component.toRecipe, 'emit');

    component.goToRecipe();

    expect(component.toRecipe.emit).toHaveBeenCalledWith(recipeMock);
  });
});
