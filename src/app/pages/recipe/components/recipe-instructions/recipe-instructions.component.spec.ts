import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeInstructionsComponent } from './recipe-instructions.component';
import { RecipeInstruction } from '@recipes/models/recipe-instruction.model';
import { TranslatePipeStub } from '@shared/mocks/translate-pipe.mock';
import { IonicStorageMock } from '@shared/mocks/ionic-storage.mock';
import { Storage } from '@ionic/storage-angular';

describe('RecipeInstructionsComponent', () => {
  let component: RecipeInstructionsComponent;
  let fixture: ComponentFixture<RecipeInstructionsComponent>;

  const instructionsMock: RecipeInstruction[] = [
    {
      name: '',
      steps: [
        {
          number: 1,
          text: 'paso 1',
        },
      ],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeInstructionsComponent, TranslatePipeStub],
      providers: [{ provide: Storage, useClass: IonicStorageMock }],
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
