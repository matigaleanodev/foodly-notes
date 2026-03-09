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

  it('adds a recipe only once', async () => {
    await service.addFavorite(recipeMock);
    await service.addFavorite(recipeMock);

    expect(service.favorites()).toEqual([recipeMock]);
  });

  it('persists favorite removals', async () => {
    await service.addFavorite(recipeMock);
    await service.removeFavorite(recipeMock.sourceId);

    expect(service.favorites()).toEqual([]);
    await expect(storage.getItem<DailyRecipe[]>('FAVORITOS')).resolves.toEqual(
      [],
    );
  });
});
