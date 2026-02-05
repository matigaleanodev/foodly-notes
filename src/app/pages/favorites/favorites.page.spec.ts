import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { FavoritesPage } from './favorites.page';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';
import { TranslatePipeStub } from '@shared/mocks/translate-pipe.mock';
import { Storage } from '@ionic/storage-angular';
import { IonicStorageMock } from '@shared/mocks/ionic-storage.mock';

describe('FavoritesPage', () => {
  let component: FavoritesPage;
  let fixture: ComponentFixture<FavoritesPage>;

  const recipeMock: DailyRecipe = {
    sourceId: 1,
    title: 'Receta test',
    image: '',
  };

  const favoritesServiceMock = {
    favorites: signal<DailyRecipe[]>([recipeMock]),
    loadFavorites: jasmine.createSpy('loadFavorites'),
    isFavorite: jasmine.createSpy('isFavorite').and.returnValue(true),
    addFavorite: jasmine.createSpy('addFavorite'),
    removeFavorite: jasmine.createSpy('removeFavorite'),
  };

  const recipeServiceMock = {
    selectRecipe: jasmine.createSpy('selectRecipe'),
    toSimilarRecipes: jasmine.createSpy('toSimilarRecipes'),
    toRecipeDetail: jasmine.createSpy('toRecipeDetail'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritesPage, TranslatePipeStub],
      providers: [
        { provide: Storage, useValue: IonicStorageMock },
        { provide: FavoritesService, useValue: favoritesServiceMock },
        { provide: RecipeService, useValue: recipeServiceMock },
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

    expect(favoritesServiceMock.loadFavorites).toHaveBeenCalled();
  });

  it('debería exponer los favoritos del FavoritesService', () => {
    expect(component.favorites()).toEqual([recipeMock]);
  });

  it('debería remover un favorito si ya lo es', () => {
    favoritesServiceMock.isFavorite.and.returnValue(true);

    component.toggleFav(recipeMock);

    expect(favoritesServiceMock.removeFavorite).toHaveBeenCalledWith(1);
  });

  it('debería agregar un favorito si no lo es', () => {
    favoritesServiceMock.isFavorite.and.returnValue(false);

    component.toggleFav(recipeMock);

    expect(favoritesServiceMock.addFavorite).toHaveBeenCalledWith(recipeMock);
  });

  it('debería navegar a recetas similares', () => {
    component.toSimilarRecipes(recipeMock);

    expect(recipeServiceMock.selectRecipe).toHaveBeenCalledWith(recipeMock);
    expect(recipeServiceMock.toSimilarRecipes).toHaveBeenCalledWith(1);
  });

  it('debería navegar al detalle de receta', () => {
    component.detalleReceta(recipeMock);

    expect(recipeServiceMock.toRecipeDetail).toHaveBeenCalledWith(1);
  });
});
