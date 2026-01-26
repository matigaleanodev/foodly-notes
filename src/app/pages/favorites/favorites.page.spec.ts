import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritesPage } from './favorites.page';
import { RecipeInfo } from '@shared/models/recipe.model';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { NavService } from '@shared/services/nav/nav.service';
import { RecipeService } from '@shared/services/recipe/recipe.service';

describe('FavoritesPage', () => {
  let component: FavoritesPage;
  let fixture: ComponentFixture<FavoritesPage>;

  const recipeMock: RecipeInfo = {
    id: 1,
    title: 'Receta test',
  } as RecipeInfo;

  const favoritesServiceMock = {
    favoritos: jasmine.createSpy(),
    cargarFavoritos: jasmine.createSpy(),
    esFavorito: jasmine.createSpy(),
    agregarFavorito: jasmine.createSpy(),
    removerFavorito: jasmine.createSpy(),
  };

  const recipeServiceMock = {
    seleccionarReceta: jasmine.createSpy(),
  };

  const navServiceMock = {
    forward: jasmine.createSpy(),
  };

  beforeEach(async () => {
    favoritesServiceMock.favoritos.and.returnValue([recipeMock]);
    favoritesServiceMock.esFavorito.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [FavoritesPage],
      providers: [
        { provide: FavoritesService, useValue: favoritesServiceMock },
        { provide: RecipeService, useValue: recipeServiceMock },
        { provide: NavService, useValue: navServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesPage);
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

  it('debería exponer los favoritos del service', () => {
    expect(component.favoritos()).toEqual([recipeMock]);
  });

  it('debería remover un favorito si ya lo es', () => {
    favoritesServiceMock.esFavorito.and.returnValue(true);

    component.toggleFavorito(recipeMock);

    expect(favoritesServiceMock.removerFavorito).toHaveBeenCalledWith(
      recipeMock,
    );
  });

  it('debería agregar un favorito si no lo es', () => {
    favoritesServiceMock.esFavorito.and.returnValue(false);

    component.toggleFavorito(recipeMock);

    expect(favoritesServiceMock.agregarFavorito).toHaveBeenCalledWith(
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
