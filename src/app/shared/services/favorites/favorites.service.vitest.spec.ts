import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { DailyRecipe } from '@recipes/models/daily-recipe.model';
import { StorageServiceMock } from '@shared/mocks/storage.mock';
import { StorageService } from '@shared/services/storage/storage.service';
import { FavoritesService } from './favorites.service';

describe('FavoritesService (Vitest)', () => {
  let service: FavoritesService;
  let storage: StorageServiceMock;

  const recipeMock: DailyRecipe = {
    sourceId: 1,
    title: 'Favorite recipe',
    image: 'image.jpg',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        FavoritesService,
        { provide: StorageService, useClass: StorageServiceMock },
      ],
    }).compileComponents();

    service = TestBed.inject(FavoritesService);
    storage = TestBed.inject(StorageService) as unknown as StorageServiceMock;

    await service.loadFavorites();
  });

  it('starts with empty favorites', () => {
    expect(service.favorites()).toEqual([]);
  });

  it('adds a recipe only once', async () => {
    await service.addFavorite(recipeMock);
    await service.addFavorite(recipeMock);

    expect(service.favorites()).toEqual([recipeMock]);
  });

  it('reports whether a recipe is a favorite', async () => {
    await service.addFavorite(recipeMock);

    expect(service.isFavorite(recipeMock.sourceId)).toBe(true);
    expect(service.isFavorite(999)).toBe(false);
  });

  it('toggles a recipe on and off', async () => {
    await service.toggleFavorite(recipeMock);
    expect(service.favorites()).toEqual([recipeMock]);

    await service.toggleFavorite(recipeMock);
    expect(service.favorites()).toEqual([]);
  });

  it('persists favorite removals', async () => {
    await service.addFavorite(recipeMock);
    await service.removeFavorite(recipeMock.sourceId);

    expect(service.favorites()).toEqual([]);
    await expect(storage.getItem<DailyRecipe[]>('FAVORITOS')).resolves.toEqual(
      [],
    );
  });

  it('persists added favorites in storage', async () => {
    await service.addFavorite(recipeMock);

    await expect(storage.getItem<DailyRecipe[]>('FAVORITOS')).resolves.toEqual(
      [recipeMock],
    );
  });
});
