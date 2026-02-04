import { TestBed } from '@angular/core/testing';

import { FavoritesService } from './favorites.service';
import { StorageService } from '@shared/services/storage/storage.service';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';
import { StorageServiceMock } from '@shared/mocks/storage.mock';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let storage: StorageServiceMock;

  const recipeMock: DailyRecipe = {
    sourceId: 1,
    title: 'Receta favorita',
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

  it('debería inicializar con favoritos vacíos', () => {
    expect(service.favorites().length).toBe(0);
  });

  it('debería agregar una receta a favoritos', async () => {
    await service.addFavorite(recipeMock);

    expect(service.favorites().length).toBe(1);
    expect(service.favorites()[0].sourceId).toBe(1);
  });

  it('debería indicar si una receta es favorita', async () => {
    await service.addFavorite(recipeMock);

    expect(service.isFavorite(1)).toBeTrue();
    expect(service.isFavorite(999)).toBeFalse();
  });

  it('debería quitar una receta de favoritos', async () => {
    await service.addFavorite(recipeMock);
    await service.removeFavorite(1);

    expect(service.favorites().length).toBe(0);
  });

  it('debería persistir los favoritos en storage', async () => {
    await service.addFavorite(recipeMock);

    const stored = await storage.getItem<DailyRecipe[]>('FAVORITOS');
    expect(stored?.length).toBe(1);
    expect(stored?.[0].sourceId).toBe(1);
  });
});
