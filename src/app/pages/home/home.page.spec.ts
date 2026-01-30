import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { NavService } from '@shared/services/nav/nav.service';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  const recipeMock: DailyRecipe = {
    sourceId: 1,
    title: 'Receta test',
    image: '',
  };

  const recipeServiceMock = {
    recipes: jasmine.createSpy(),
    seleccionarReceta: jasmine.createSpy(),
  };

  const favoritesServiceMock = {
    cargarFavoritos: jasmine.createSpy(),
    isFavorite: jasmine.createSpy(),
    agregarFavorito: jasmine.createSpy(),
    removerFavorito: jasmine.createSpy(),
  };

  const navServiceMock = {
    forward: jasmine.createSpy(),
  };

  beforeEach(async () => {
    recipeServiceMock.recipes.and.returnValue([recipeMock]);
    favoritesServiceMock.isFavorite.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        { provide: RecipeService, useValue: recipeServiceMock },
        { provide: FavoritesService, useValue: favoritesServiceMock },
        { provide: NavService, useValue: navServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los favoritos al entrar a la vista', () => {
    component.ionViewWillEnter();

    expect(favoritesServiceMock.cargarFavoritos).toHaveBeenCalled();
  });

  it('debería exponer las recetas del service', () => {
    expect(component.recipes()).toEqual([recipeMock]);
  });

  it('debería agregar un favorito si no lo es', () => {
    favoritesServiceMock.isFavorite.and.returnValue(false);

    component.toggleFavorites(recipeMock);

    expect(favoritesServiceMock.agregarFavorito).toHaveBeenCalledWith(
      recipeMock,
    );
  });

  it('debería remover un favorito si ya lo es', () => {
    favoritesServiceMock.isFavorite.and.returnValue(true);

    component.toggleFavorites(recipeMock);

    expect(favoritesServiceMock.removerFavorito).toHaveBeenCalledWith(
      recipeMock.sourceId,
    );
  });
});
