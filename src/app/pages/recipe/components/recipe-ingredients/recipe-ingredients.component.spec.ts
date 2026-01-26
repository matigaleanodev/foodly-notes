import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeIngredientsComponent } from './recipe-ingredients.component';
import { Ingredient } from '@shared/models/recipe.model';

describe('RecipeIngredientsComponent', () => {
  let component: RecipeIngredientsComponent;
  let fixture: ComponentFixture<RecipeIngredientsComponent>;

  const ingredientsMock: Ingredient[] = [
    {
      id: 1,
      name: 'Ingrediente 1',
      amount: 100,
      unit: 'g',
    } as Ingredient,
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeIngredientsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeIngredientsComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('ingredients', ingredientsMock);

    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });
});
