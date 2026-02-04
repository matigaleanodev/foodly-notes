import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeIngredientsComponent } from './recipe-ingredients.component';
import { RecipeIngredient } from '@recipes/models/recipe-ingredient.model';
import { TranslatePipeStub } from '@shared/mocks/translate-pipe.mock';
import { IonicStorageMock } from '@shared/mocks/ionic-storage.mock';
import { Storage } from '@ionic/storage-angular';

describe('RecipeIngredientsComponent', () => {
  let component: RecipeIngredientsComponent;
  let fixture: ComponentFixture<RecipeIngredientsComponent>;

  const ingredientsMock: RecipeIngredient[] = [
    {
      id: 1,
      name: 'Ingrediente 1',
      amount: 100,
      unit: 'g',
      original: 'ingre1',
      image: 'img',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeIngredientsComponent, TranslatePipeStub],
      providers: [{ provide: Storage, useValue: IonicStorageMock }],
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
