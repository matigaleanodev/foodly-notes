import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeHeroComponent } from './recipe-hero.component';

describe('RecipeHeroComponent', () => {
  let component: RecipeHeroComponent;
  let fixture: ComponentFixture<RecipeHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeHeroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeHeroComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('title', 'Receta test');
    fixture.componentRef.setInput(
      'imageUrl',
      'https://img.spoonacular.com/recipes/1-636x393.jpg',
    );

    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });
});
