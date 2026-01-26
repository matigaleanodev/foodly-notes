import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { RecipeInfo } from '@shared/models/recipe.model';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { NavService } from '@shared/services/nav/nav.service';
import { RecipeService } from '@shared/services/recipe/recipe.service';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  const recipeMock: RecipeInfo = {
    id: 1,
    title: 'Receta test',
  } as RecipeInfo;

  const recipeServiceMock = {
    recipes: jasmine.createSpy(),
    seleccionarReceta: jasmine.createSpy(),
  };

  const favoritesServiceMock = {
    cargarFavoritos: jasmine.createSpy(),
    esFavorito: jasmine.createSpy(),
    agregarFavorito: jasmine.createSpy(),
    removerFavorito: jasmine.createSpy(),
  };

  const navServiceMock = {
    forward: jasmine.createSpy(),
  };

  beforeEach(async () => {
    recipeServiceMock.recipes.and.returnValue([recipeMock]);
    favoritesServiceMock.esFavorito.and.returnValue(false);

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
    favoritesServiceMock.esFavorito.and.returnValue(false);

    component.toggleFavorito(recipeMock);

    expect(favoritesServiceMock.agregarFavorito).toHaveBeenCalledWith(
      recipeMock,
    );
  });

  it('debería remover un favorito si ya lo es', () => {
    favoritesServiceMock.esFavorito.and.returnValue(true);

    component.toggleFavorito(recipeMock);

    expect(favoritesServiceMock.removerFavorito).toHaveBeenCalledWith(
      recipeMock,
    );
  });

  it('debería navegar a recetas similares', () => {
    component.recetasSimilares(recipeMock);

    expect(recipeServiceMock.seleccionarReceta).toHaveBeenCalledWith(
      recipeMock,
    );
    expect(navServiceMock.forward).toHaveBeenCalledWith('similares/1');
  });

  it('debería navegar al detalle de la receta', () => {
    component.detalleReceta(recipeMock);

    expect(recipeServiceMock.seleccionarReceta).toHaveBeenCalledWith(
      recipeMock,
    );
    expect(navServiceMock.forward).toHaveBeenCalledWith('recipe/1');
  });
});
