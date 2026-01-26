import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipePage } from './recipe.page';
import { RecipeInfo } from '@shared/models/recipe.model';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { NavService } from '@shared/services/nav/nav.service';

describe('RecipePage', () => {
  let component: RecipePage;
  let fixture: ComponentFixture<RecipePage>;

  const recipeMock: RecipeInfo = {
    id: 1,
    title: 'Receta test',
    imageType: 'jpg',
  } as RecipeInfo;

  const favoritesServiceMock = {
    esFavorito: jasmine.createSpy(),
    agregarFavorito: jasmine.createSpy(),
    removerFavorito: jasmine.createSpy(),
  };

  const navServiceMock = {
    forward: jasmine.createSpy(),
  };

  beforeEach(async () => {
    favoritesServiceMock.esFavorito.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [RecipePage],
      providers: [
        { provide: FavoritesService, useValue: favoritesServiceMock },
        { provide: NavService, useValue: navServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipePage);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('recipe', recipeMock);

    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería construir correctamente la url de la imagen', () => {
    expect(component.imageUrl()).toBe(
      'https://img.spoonacular.com/recipes/1-636x393.jpg',
    );
  });

  it('debería indicar si la receta es favorita', () => {
    favoritesServiceMock.esFavorito.and.returnValue(true);

    fixture.componentRef.setInput('recipe', { ...recipeMock });
    fixture.detectChanges();

    expect(component.isFavorite()).toBeTrue();
  });

  it('debería agregar la receta a favoritos si no lo es', () => {
    favoritesServiceMock.esFavorito.and.returnValue(false);

    component.toggleFavorito();

    expect(favoritesServiceMock.agregarFavorito).toHaveBeenCalledWith(
      recipeMock,
    );
  });

  it('debería remover la receta de favoritos si ya lo es', () => {
    favoritesServiceMock.esFavorito.and.returnValue(true);

    component.toggleFavorito();

    expect(favoritesServiceMock.removerFavorito).toHaveBeenCalledWith(
      recipeMock,
    );
  });

  it('debería navegar a recetas similares', () => {
    component.verSimilares();

    expect(navServiceMock.forward).toHaveBeenCalledWith('similares/1');
  });
});
