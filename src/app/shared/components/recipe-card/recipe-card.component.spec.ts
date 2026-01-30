import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeCardComponent } from './recipe-card.component';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';

describe('RecipeCardComponent', () => {
  let component: RecipeCardComponent;
  let fixture: ComponentFixture<RecipeCardComponent>;

  const recipeMock: DailyRecipe = {
    sourceId: 1,
    title: 'Receta test',
    image: 'jpg',
  };

  const favoritesServiceMock = {
    isFavorite: jasmine.createSpy(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeCardComponent],
      providers: [
        { provide: FavoritesService, useValue: favoritesServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeCardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('recipe', recipeMock);
    favoritesServiceMock.isFavorite.and.returnValue(false);

    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería indicar si la receta es favorita', () => {
    favoritesServiceMock.isFavorite.and.returnValue(true);

    fixture.componentRef.setInput('recipe', { ...recipeMock });
    expect(component.isFavorite()).toBeTrue();
  });

  it('debería construir correctamente la url de la imagen', () => {
    expect(component.recipeImageUrl()).toBe(
      'https://img.spoonacular.com/recipes/1-556x370.jpg',
    );
  });

  it('debería emitir el evento seleccionar', () => {
    spyOn(component.seleccionar, 'emit');

    const event = new Event('click');
    spyOn(event, 'stopPropagation');

    component.seleccionarReceta(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(component.seleccionar.emit).toHaveBeenCalledWith(recipeMock);
  });

  it('debería emitir el evento similares', () => {
    spyOn(component.similares, 'emit');

    const event = new Event('click');
    spyOn(event, 'stopPropagation');

    component.toSimilarRecipes(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(component.similares.emit).toHaveBeenCalledWith(recipeMock);
  });

  it('debería emitir el evento favorito', () => {
    spyOn(component.favorite, 'emit');

    const event = new Event('click');
    spyOn(event, 'stopPropagation');

    component.toggleFavoriteState(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(component.favorite.emit).toHaveBeenCalledWith(recipeMock);
  });
});
