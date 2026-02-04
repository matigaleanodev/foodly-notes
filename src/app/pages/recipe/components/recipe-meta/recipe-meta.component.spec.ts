import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage-angular';
import { RecipeMetaComponent } from './recipe-meta.component';
import { TooltipDirectiveStub } from '@shared/mocks/tooltip-directive.mock';
import { TranslatePipeStub } from '@shared/mocks/translate-pipe.mock';
import { IonicStorageMock } from '@shared/mocks/ionic-storage.mock';

describe('RecipeMetaComponent', () => {
  let component: RecipeMetaComponent;
  let fixture: ComponentFixture<RecipeMetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeMetaComponent, TooltipDirectiveStub, TranslatePipeStub],
      providers: [{ provide: Storage, useValue: IonicStorageMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeMetaComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('readyInMinutes', 30);
    fixture.componentRef.setInput('servings', 2);
    fixture.componentRef.setInput('isFavorite', false);
    fixture.componentRef.setInput('vegan', true);
    fixture.componentRef.setInput('vegetarian', false);
    fixture.componentRef.setInput('glutenFree', false);
    fixture.componentRef.setInput('dairyFree', true);

    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería emitir el evento toggleFavorite', () => {
    spyOn(component.toggleFavorite, 'emit');

    component.toggleFavorite.emit();

    expect(component.toggleFavorite.emit).toHaveBeenCalled();
  });

  it('debería emitir el evento viewSimilar', () => {
    spyOn(component.viewSimilar, 'emit');

    component.viewSimilar.emit();

    expect(component.viewSimilar.emit).toHaveBeenCalled();
  });
});
