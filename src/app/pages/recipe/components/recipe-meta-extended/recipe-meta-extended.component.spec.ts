import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeMetaExtendedComponent } from './recipe-meta-extended.component';
import { TranslatePipeStub } from '@shared/mocks/translate-pipe.mock';
import { IonicStorageMock } from '@shared/mocks/ionic-storage.mock';
import { Storage } from '@ionic/storage-angular';

describe('RecipeMetaExtendedComponent', () => {
  let component: RecipeMetaExtendedComponent;
  let fixture: ComponentFixture<RecipeMetaExtendedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeMetaExtendedComponent, TranslatePipeStub],
      providers: [{ provide: Storage, useValue: IonicStorageMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeMetaExtendedComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('preparationMinutes', 10);
    fixture.componentRef.setInput('cookingMinutes', 20);
    fixture.componentRef.setInput('healthScore', 80);
    fixture.componentRef.setInput('aggregateLikes', 120);

    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });
});
