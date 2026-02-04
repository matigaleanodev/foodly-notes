import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { SearchPage } from './search.page';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';
import { SearchRecipe } from '@recipes/models/search-recipe.model';
import { IonicStorageMock } from '@shared/mocks/ionic-storage.mock';
import { Storage } from '@ionic/storage-angular';

describe('SearchPage', () => {
  let component: SearchPage;
  let fixture: ComponentFixture<SearchPage>;

  const recipesMock: SearchRecipe[] = [
    { sourceId: 1, title: 'Receta buscada', image: '' },
  ];

  const recipeServiceMock = {
    queryReacipeSearch: jasmine
      .createSpy('queryReacipeSearch')
      .and.resolveTo(of(recipesMock)),
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchPage],
      providers: [
        { provide: Storage, useValue: IonicStorageMock },
        { provide: RecipeService, useValue: recipeServiceMock },
        { provide: FavoritesService, useValue: favoritesServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchPage);
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

  it('debería cargar favoritos al entrar en la vista', () => {
    component.ionViewWillEnter();

    expect(favoritesServiceMock.loadFavorites).toHaveBeenCalled();
  });

  it('debería agregar favorito si no lo es', () => {
    favoritesServiceMock.isFavorite.and.returnValue(false);

    component.toggleFavorite(recipesMock[0] as unknown as DailyRecipe);

    expect(favoritesServiceMock.addFavorite).toHaveBeenCalledWith(
      recipesMock[0],
    );
  });

  it('debería remover favorito si ya lo es', () => {
    favoritesServiceMock.isFavorite.and.returnValue(true);

    component.toggleFavorite(recipesMock[0] as unknown as DailyRecipe);

    expect(favoritesServiceMock.removeFavorite).toHaveBeenCalledWith(1);
  });

  it('debería navegar a recetas similares', () => {
    component.toSimilarRecipes(recipesMock[0] as unknown as DailyRecipe);

    expect(recipeServiceMock.selectRecipe).toHaveBeenCalledWith(recipesMock[0]);
    expect(recipeServiceMock.toSimilarRecipes).toHaveBeenCalledWith(1);
  });

  it('debería navegar al detalle de receta', () => {
    component.toRecipeDetail(recipesMock[0] as unknown as DailyRecipe);

    expect(recipeServiceMock.toRecipeDetail).toHaveBeenCalledWith(1);
  });

  it('debería buscar nuevas recetas y actualizar el signal', async () => {
    await component.searchNewRecipes('pollo');

    expect(recipeServiceMock.queryReacipeSearch).toHaveBeenCalledWith('pollo');
    expect(component.recipes()).toEqual(recipesMock);
  });
});
