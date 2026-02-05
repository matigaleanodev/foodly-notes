import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SimilarPage } from './similar.page';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { TranslateService } from '@shared/translate/translate.service';
import { SimilarRecipe } from '@recipes/models/similar-recipe.model';

describe('SimilarPage', () => {
  let component: SimilarPage;
  let fixture: ComponentFixture<SimilarPage>;

  const recipesMock: SimilarRecipe[] = [
    { sourceId: 1, title: 'Receta similar', image: '' },
  ];

  const recipeServiceMock = {
    recipeSelected: signal<any>(null),
    refreshSimilarRecipes: jasmine
      .createSpy('refreshSimilarRecipes')
      .and.returnValue({
        subscribe: () => {},
      }),
    selectRecipe: jasmine.createSpy('selectRecipe'),
    toSimilarRecipes: jasmine.createSpy('toSimilarRecipes'),
    toRecipeDetail: jasmine.createSpy('toRecipeDetail'),
  };

  const favoritesServiceMock = {
    loadFavorites: jasmine.createSpy('loadFavorites'),
    isFavorite: jasmine.createSpy('isFavorite').and.returnValue(false),
    addFavorite: jasmine.createSpy('addFavorite'),
    removeFavorite: jasmine.createSpy('removeFavorite'),
  };

  const translateMock = {
    translate: jasmine
      .createSpy('translate')
      .and.callFake((key: string) => key),
  };

  const activatedRouteMock = {
    snapshot: {
      paramMap: {
        get: () => '1',
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimilarPage],
      providers: [
        { provide: RecipeService, useValue: recipeServiceMock },
        { provide: FavoritesService, useValue: favoritesServiceMock },
        { provide: TranslateService, useValue: translateMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SimilarPage);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('data', recipesMock);
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería exponer las recetas desde el input', () => {
    expect(component.recipes()).toEqual(recipesMock);
  });

  it('debería calcular el subtitle sin receta seleccionada', () => {
    recipeServiceMock.recipeSelected.set(null);

    expect(component.subtitle()).toBe('xRecetasRecomendadas');
  });

  it('debería cargar favoritos al entrar en la vista', () => {
    component.ionViewWillEnter();

    expect(favoritesServiceMock.loadFavorites).toHaveBeenCalled();
  });

  it('debería agregar favorito si no lo es', () => {
    favoritesServiceMock.isFavorite.and.returnValue(false);

    component.toggleFavorite(recipesMock[0]);

    expect(favoritesServiceMock.addFavorite).toHaveBeenCalledWith(
      recipesMock[0],
    );
  });

  it('debería remover favorito si ya lo es', () => {
    favoritesServiceMock.isFavorite.and.returnValue(true);

    component.toggleFavorite(recipesMock[0]);

    expect(favoritesServiceMock.removeFavorite).toHaveBeenCalledWith(1);
  });

  it('debería navegar a recetas similares', () => {
    component.toSimilarRecipes(recipesMock[0]);

    expect(recipeServiceMock.selectRecipe).toHaveBeenCalledWith(recipesMock[0]);
    expect(recipeServiceMock.toSimilarRecipes).toHaveBeenCalledWith(1);
  });

  it('debería navegar al detalle de receta', () => {
    component.detalleReceta(recipesMock[0]);

    expect(recipeServiceMock.toRecipeDetail).toHaveBeenCalledWith(1);
  });
});
