import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeAttrComponent } from './recipe-attr.component';
import { TranslatePipeStub } from '@shared/mocks/translate-pipe.mock';
import { Storage } from '@ionic/storage-angular';
import { IonicStorageMock } from '@shared/mocks/ionic-storage.mock';

describe('RecipeAttrComponent', () => {
  let component: RecipeAttrComponent;
  let fixture: ComponentFixture<RecipeAttrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeAttrComponent, TranslatePipeStub],
      providers: [{ provide: Storage, useValue: IonicStorageMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeAttrComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('sourceName', 'Spoonacular');
    fixture.componentRef.setInput('sourceUrl', 'https://spoonacular.com');

    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });
});
