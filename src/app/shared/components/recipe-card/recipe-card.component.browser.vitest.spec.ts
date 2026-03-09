import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RecipeCardComponent } from './recipe-card.component';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';
import { TranslatePipeStub } from '@shared/mocks/translate-pipe.mock';
import { IonicStorageMock } from '@shared/mocks/ionic-storage.mock';

import { Storage } from '@ionic/storage-angular';

describe('RecipeCardComponent (Vitest)', () => {
  let component: RecipeCardComponent;
  let fixture: ComponentFixture<RecipeCardComponent>;

  const recipeMock: DailyRecipe = {
    sourceId: 1,
    title: 'Receta test',
    image: 'jpg',
  };

  const favoritesServiceMock = {
    isFavorite: vi.fn(),
  };

  beforeEach(async () => {
    favoritesServiceMock.isFavorite.mockReset();
    favoritesServiceMock.isFavorite.mockReturnValue(false);

    await TestBed.configureTestingModule({
      imports: [RecipeCardComponent, TranslatePipeStub],
      providers: [
        { provide: Storage, useClass: IonicStorageMock },
        { provide: FavoritesService, useValue: favoritesServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeCardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('recipe', recipeMock);
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('reports whether the recipe is a favorite', () => {
    favoritesServiceMock.isFavorite.mockReturnValue(true);

    fixture.componentRef.setInput('recipe', { ...recipeMock });
    fixture.detectChanges();

    expect(favoritesServiceMock.isFavorite).toHaveBeenCalledWith(1);
    expect(component.isFavorite()).toBe(true);
  });

  it('exposes the recipe image', () => {
    expect(component.recipeImageUrl()).toBe('jpg');
  });

  it('emits the recipe detail event', () => {
    const emitSpy = vi.spyOn(component.recipeDetail, 'emit');

    const event = {
      stopPropagation: vi.fn(),
    } as unknown as Event;

    component.toRecipeDetail(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(recipeMock);
  });

  it('emits the similar recipes event', () => {
    const emitSpy = vi.spyOn(component.similarRecipes, 'emit');

    const event = {
      stopPropagation: vi.fn(),
    } as unknown as Event;

    component.toSimilarRecipes(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(recipeMock);
  });

  it('emits the favorite toggle event', () => {
    const emitSpy = vi.spyOn(component.toggleFavorite, 'emit');

    const event = {
      stopPropagation: vi.fn(),
    } as unknown as Event;

    component.toggleFavoriteState(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(recipeMock);
  });
});
