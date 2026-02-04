import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, Component, input, output } from '@angular/core';

import { HomePage } from './home.page';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';
import { IonicStorageMock } from '@shared/mocks/ionic-storage.mock';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  template: '',
})
class RecipeCardStubComponent {
  recipe = input<DailyRecipe>();
  toggleFavorite = output<DailyRecipe>();
  similarRecipes = output<DailyRecipe>();
  recipeDetail = output<DailyRecipe>();
}

@Component({
  selector: 'app-home-hero',
  standalone: true,
  template: '',
})
class HomeHeroStubComponent {
  searchPage = input<boolean>();
  onSearch = output<string>();
}

@Component({
  selector: 'app-empty-states',
  standalone: true,
  template: '',
})
class EmptyStatesStubComponent {
  imagen = input<any>();
  text = input<string>();
}

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  const recipeMock: DailyRecipe = {
    sourceId: 1,
    title: 'Receta test',
    image: '',
  };

  const recipeServiceMock = {
    recipes: signal<DailyRecipe[]>([recipeMock]),
    loadDailyRecipes: jasmine.createSpy(),
    refreshDailyRecipes: jasmine.createSpy().and.returnValue({
      subscribe: ({ next }: any) => next(),
    }),
    selectRecipe: jasmine.createSpy(),
    toSimilarRecipes: jasmine.createSpy(),
    toRecipeDetail: jasmine.createSpy(),
    searchRecipes: jasmine.createSpy(),
  };

  const favoritesServiceMock = {
    loadFavorites: jasmine.createSpy(),
    isFavorite: jasmine.createSpy().and.returnValue(false),
    addFavorite: jasmine.createSpy(),
    removeFavorite: jasmine.createSpy(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomePage,
        RecipeCardStubComponent,
        HomeHeroStubComponent,
        EmptyStatesStubComponent,
      ],
      providers: [
        { provide: Storage, useValue: IonicStorageMock },
        { provide: RecipeService, useValue: recipeServiceMock },
        { provide: FavoritesService, useValue: favoritesServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar favoritos y recetas al entrar en la vista', () => {
    component.ionViewWillEnter();

    expect(favoritesServiceMock.loadFavorites).toHaveBeenCalled();
    expect(recipeServiceMock.loadDailyRecipes).toHaveBeenCalled();
  });

  it('debería exponer las recetas del RecipeService', () => {
    expect(component.recipes()).toEqual([recipeMock]);
  });

  it('debería agregar un favorito si no lo es', () => {
    favoritesServiceMock.isFavorite.and.returnValue(false);

    component.toggleFavorite(recipeMock);

    expect(favoritesServiceMock.addFavorite).toHaveBeenCalledWith(recipeMock);
  });

  it('debería remover un favorito si ya lo es', () => {
    favoritesServiceMock.isFavorite.and.returnValue(true);

    component.toggleFavorite(recipeMock);

    expect(favoritesServiceMock.removeFavorite).toHaveBeenCalledWith(1);
  });

  it('debería navegar a recetas similares', () => {
    component.toSimilarRecipes(recipeMock);

    expect(recipeServiceMock.selectRecipe).toHaveBeenCalledWith(recipeMock);
    expect(recipeServiceMock.toSimilarRecipes).toHaveBeenCalledWith(1);
  });

  it('debería navegar al detalle de receta', () => {
    component.toRecipeDetail(recipeMock);

    expect(recipeServiceMock.toRecipeDetail).toHaveBeenCalledWith(1);
  });

  it('debería navegar a búsqueda', () => {
    component.toSearchRecipe('pollo');

    expect(recipeServiceMock.searchRecipes).toHaveBeenCalledWith('pollo');
  });
});
