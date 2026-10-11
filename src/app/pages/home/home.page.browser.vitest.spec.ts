import { TranslateService } from '@shared/translate/translate.service';
import { Language } from '@shared/translate/language.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HomePage } from './home.page';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';
import { IonicStorageMock } from '@shared/mocks/ionic-storage.mock';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
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
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '',
})
class HomeHeroStubComponent {
  searchPage = input<boolean>();
  serachSubmit = output<string>();
}

@Component({
  selector: 'app-empty-states',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '',
})
class EmptyStatesStubComponent {
  imagen = input<unknown>();
  text = input<string>();
}

describe('HomePage (Vitest)', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  const recipeMock: DailyRecipe = {
    sourceId: 1,
    title: 'Receta test',
    image: '',
  };

  const recipeServiceMock = {
    recipes: signal<DailyRecipe[]>([recipeMock]),
    loadDailyRecipes: vi.fn().mockResolvedValue(undefined),
    refreshDailyRecipes: vi.fn().mockReturnValue({
      subscribe: ({ next }: { next: () => void }) => next(),
    }),
    openSimilarRecipes: vi.fn(),
    toRecipeDetail: vi.fn(),
    searchRecipes: vi.fn(),
  };

  const favoritesServiceMock = {
    loadFavorites: vi.fn(),
    toggleFavorite: vi.fn(),
  };

  beforeEach(async () => {
    recipeServiceMock.loadDailyRecipes.mockClear();
    recipeServiceMock.openSimilarRecipes.mockClear();
    recipeServiceMock.toRecipeDetail.mockClear();
    recipeServiceMock.searchRecipes.mockClear();
    favoritesServiceMock.loadFavorites.mockClear();
    favoritesServiceMock.toggleFavorite.mockClear();

    await TestBed.configureTestingModule({
      imports: [
        HomePage,
        RecipeCardStubComponent,
        HomeHeroStubComponent,
        EmptyStatesStubComponent,
      ],
      providers: [
        { provide: Storage, useClass: IonicStorageMock },
        { provide: RecipeService, useValue: recipeServiceMock },
        { provide: FavoritesService, useValue: favoritesServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the page', () => {
    expect(component).toBeTruthy();
  });

  it('loads favorites and recipes on view enter', async () => {
    await component.ionViewWillEnter();

    expect(favoritesServiceMock.loadFavorites).toHaveBeenCalled();
    expect(recipeServiceMock.loadDailyRecipes).toHaveBeenCalled();
    expect(component.isLoading()).toBe(false);
  });

  it('exposes recipes from the service', () => {
    expect(component.recipes()).toEqual([recipeMock]);
  });

  it('delegates favorite toggling to the service', () => {
    component.toggleFavorite(recipeMock);

    expect(favoritesServiceMock.toggleFavorite).toHaveBeenCalledWith(recipeMock);
  });

  it('navigates to similar recipes', () => {
    component.toSimilarRecipes(recipeMock);

    expect(recipeServiceMock.openSimilarRecipes).toHaveBeenCalledWith(
      recipeMock,
      { returnTo: '/home' },
    );
  });

  it('navigates to recipe detail', () => {
    component.toRecipeDetail(recipeMock);

    expect(recipeServiceMock.toRecipeDetail).toHaveBeenCalledWith(1, {
      returnTo: '/home',
    });
  });

  it('navigates to search', () => {
    component.toSearchRecipe('pollo');

    expect(recipeServiceMock.searchRecipes).toHaveBeenCalledWith('pollo');
  });
  it('reloads daily recipes when the language changes in the same view', async () => {
    await fixture.whenStable();
    await component.ionViewWillEnter();
    recipeServiceMock.loadDailyRecipes.mockClear();
    TestBed.inject(TranslateService).currentLang.set(Language.ES);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(recipeServiceMock.loadDailyRecipes).toHaveBeenCalledTimes(1);
  });

});
