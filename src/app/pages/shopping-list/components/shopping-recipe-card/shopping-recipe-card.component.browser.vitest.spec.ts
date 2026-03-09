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
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('ShoppingRecipeCardComponent (Vitest)', () => {
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
    isIngredientChecked: vi.fn().mockReturnValue(true),
    toggleIngredient: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    shoppingListServiceMock.isIngredientChecked.mockClear();
    shoppingListServiceMock.toggleIngredient.mockClear();

    await TestBed.configureTestingModule({
      imports: [ShoppingRecipeCardComponent, TranslatePipeStub],
      providers: [
        { provide: Storage, useClass: IonicStorageMock },
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

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('exposes recipe ingredients', () => {
    expect(component.ingredients()).toEqual(recipeMock.ingredients);
  });

  it('checks whether an ingredient is marked', () => {
    const result = component.isIngredientChecked(10);

    expect(shoppingListServiceMock.isIngredientChecked).toHaveBeenCalledWith(
      1,
      10,
    );
    expect(result).toBe(true);
  });

  it('toggles an ingredient and stops event propagation', async () => {
    const eventMock = {
      stopPropagation: vi.fn(),
    } as unknown as Event;

    await component.toggleIngredient(eventMock, 20);

    expect(eventMock.stopPropagation).toHaveBeenCalled();
    expect(shoppingListServiceMock.toggleIngredient).toHaveBeenCalledWith(
      1,
      20,
    );
  });

  it('emits the event to navigate to the recipe', () => {
    const emitSpy = vi.spyOn(component.toRecipe, 'emit');

    component.goToRecipe();

    expect(emitSpy).toHaveBeenCalledWith(recipeMock);
  });
});
