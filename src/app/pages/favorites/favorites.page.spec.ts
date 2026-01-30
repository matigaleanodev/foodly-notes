import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritesPage } from './favorites.page';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { NavService } from '@shared/services/nav/nav.service';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';

describe('FavoritesPage', () => {
  let component: FavoritesPage;
  let fixture: ComponentFixture<FavoritesPage>;

  const recipeMock: DailyRecipe = {
    sourceId: 1,
    title: 'Receta test',
    image: '',
  };

  const favoritesServiceMock = {
    favoritos: jasmine.createSpy(),
    cargarFavoritos: jasmine.createSpy(),
    isFavorite: jasmine.createSpy(),
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
    favoritesServiceMock.isFavorite.and.returnValue(true);

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
    favoritesServiceMock.isFavorite.and.returnValue(true);

    component.toggleFav(recipeMock);

    expect(favoritesServiceMock.removerFavorito).toHaveBeenCalledWith(
      recipeMock.sourceId,
    );
  });

  it('debería agregar un favorito si no lo es', () => {
    favoritesServiceMock.isFavorite.and.returnValue(false);

    component.toggleFav(recipeMock);

    expect(favoritesServiceMock.agregarFavorito).toHaveBeenCalledWith(
      recipeMock,
    );
  });
});
