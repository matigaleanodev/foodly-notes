import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeAttrComponent } from './recipe-attr.component';

describe('RecipeAttrComponent', () => {
  let component: RecipeAttrComponent;
  let fixture: ComponentFixture<RecipeAttrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeAttrComponent],
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
