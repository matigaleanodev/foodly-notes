import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RecipePage } from './recipe.page';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { TranslateService } from '@shared/translate/translate.service';
import { RecipeDetail } from '@recipes/models/recipe-detail.model';
import { IonicStorageMock } from '@shared/mocks/ionic-storage.mock';
import { Storage } from '@ionic/storage-angular';

describe('RecipePage', () => {
  let component: RecipePage;
  let fixture: ComponentFixture<RecipePage>;

  const recipeMock: RecipeDetail = {
    sourceId: 1,
    title: 'Receta test',
    image: 'image.jpg',
    summary: '',
    instructions: [],
    ingredients: [],
    readyInMinutes: 10,
    cookingMinutes: 10,
    servings: 2,
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    preparationMinutes: 0,
    healthScore: 1,
    aggregateLikes: 1,
    sourceName: '',
    sourceUrl: '',
    lang: 'es',
  };

  const favoritesServiceMock = {
    isFavorite: jasmine.createSpy().and.returnValue(false),
    addFavorite: jasmine.createSpy(),
    removeFavorite: jasmine.createSpy(),
  };

  const recipeServiceMock = {
    refreshRecipeDetail: jasmine.createSpy().and.returnValue(of(recipeMock)),
    selectRecipe: jasmine.createSpy(),
    toSimilarRecipes: jasmine.createSpy(),
  };

  const translateServiceMock = {
    currentLang: jasmine.createSpy().and.returnValue('es'),
    translate: (key: string) => key,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipePage],
      providers: [
        { provide: Storage, useValue: IonicStorageMock },
        { provide: FavoritesService, useValue: favoritesServiceMock },
        { provide: RecipeService, useValue: recipeServiceMock },
        { provide: TranslateService, useValue: translateServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipePage);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('data', recipeMock);

    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería exponer correctamente la imagen', () => {
    expect(component.imageUrl()).toBe('image.jpg');
  });

  it('debería indicar si la receta es favorita', () => {
    favoritesServiceMock.isFavorite.and.returnValue(true);

    component.recipe.set({ ...recipeMock });

    expect(component.isFavorite()).toBeTrue();
  });

  it('debería agregar la receta a favoritos si no lo es', () => {
    favoritesServiceMock.isFavorite.and.returnValue(false);

    component.toggleFavorite();

    expect(favoritesServiceMock.addFavorite).toHaveBeenCalledWith({
      sourceId: 1,
      title: 'Receta test',
      image: 'image.jpg',
    });
  });

  it('debería remover la receta de favoritos si ya lo es', () => {
    favoritesServiceMock.isFavorite.and.returnValue(true);

    component.toggleFavorite();

    expect(favoritesServiceMock.removeFavorite).toHaveBeenCalledWith(1);
  });

  it('debería navegar a recetas similares', () => {
    component.toSimilaRecipes();

    expect(recipeServiceMock.selectRecipe).toHaveBeenCalledWith({
      sourceId: 1,
      title: 'Receta test',
      image: 'image.jpg',
    });

    expect(recipeServiceMock.toSimilarRecipes).toHaveBeenCalledWith(1);
  });
});
