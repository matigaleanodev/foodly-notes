import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeCardComponent } from './recipe-card.component';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';
import { TranslatePipeStub } from '@shared/mocks/translate-pipe.mock';
import { IonicStorageMock } from '@shared/mocks/ionic-storage.mock';

import { Storage } from '@ionic/storage-angular';

describe('RecipeCardComponent', () => {
  let component: RecipeCardComponent;
  let fixture: ComponentFixture<RecipeCardComponent>;

  const recipeMock: DailyRecipe = {
    sourceId: 1,
    title: 'Receta test',
    image: 'jpg',
  };

  const favoritesServiceMock = {
    isFavorite: jasmine.createSpy('isFavorite'),
  };

  beforeEach(async () => {
    favoritesServiceMock.isFavorite.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [RecipeCardComponent, TranslatePipeStub],
      providers: [
        { provide: Storage, useValue: IonicStorageMock },
        { provide: FavoritesService, useValue: favoritesServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeCardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('recipe', recipeMock);
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería indicar si la receta es favorita', () => {
    favoritesServiceMock.isFavorite.and.returnValue(true);

    fixture.componentRef.setInput('recipe', { ...recipeMock });
    fixture.detectChanges();

    expect(favoritesServiceMock.isFavorite).toHaveBeenCalledWith(1);
    expect(component.isFavorite()).toBeTrue();
  });

  it('debería exponer correctamente la imagen de la receta', () => {
    expect(component.recipeImageUrl()).toBe('jpg');
  });

  it('debería emitir el evento de detalle de receta', () => {
    spyOn(component.recipeDetail, 'emit');

    const event = {
      stopPropagation: jasmine.createSpy(),
    } as unknown as Event;

    component.toRecipeDetail(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(component.recipeDetail.emit).toHaveBeenCalledWith(recipeMock);
  });

  it('debería emitir el evento de recetas similares', () => {
    spyOn(component.similarRecipes, 'emit');

    const event = {
      stopPropagation: jasmine.createSpy(),
    } as unknown as Event;

    component.toSimilarRecipes(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(component.similarRecipes.emit).toHaveBeenCalledWith(recipeMock);
  });

  it('debería emitir el evento de toggle favorito', () => {
    spyOn(component.toggleFavorite, 'emit');

    const event = {
      stopPropagation: jasmine.createSpy(),
    } as unknown as Event;

    component.toggleFavoriteState(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(component.toggleFavorite.emit).toHaveBeenCalledWith(recipeMock);
  });
});
