import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeInstructionsComponent } from './recipe-instructions.component';
import { AnalyzedInstruction } from '@shared/models/recipe.model';

describe('RecipeInstructionsComponent', () => {
  let component: RecipeInstructionsComponent;
  let fixture: ComponentFixture<RecipeInstructionsComponent>;

  const instructionsMock: AnalyzedInstruction[] = [
    {
      name: '',
      steps: [
        {
          number: 1,
          step: 'Paso 1',
          ingredients: [],
          equipment: [],
        },
      ],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeInstructionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeInstructionsComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('instructions', instructionsMock);

    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });
});
