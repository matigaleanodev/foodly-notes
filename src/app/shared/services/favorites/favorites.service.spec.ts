import { TestBed } from '@angular/core/testing';

import { FavoritesService } from './favorites.service';
import { StorageService } from '../storage/storage.service';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';

describe('FavoritesService', () => {
  let service: FavoritesService;

  const storageMock = {
    getItem: jasmine.createSpy(),
    setItem: jasmine.createSpy(),
  };

  const recipeMock: DailyRecipe = {
    sourceId: 1,
    title: 'Receta test',
    image: '',
  } as DailyRecipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FavoritesService,
        { provide: StorageService, useValue: storageMock },
      ],
    });

    service = TestBed.inject(FavoritesService);
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería cargar los favoritos desde storage', async () => {
    storageMock.getItem.and.resolveTo([recipeMock]);

    await service.loadFavorites();

    expect(storageMock.getItem).toHaveBeenCalled();
    expect(service.favorites()).toEqual([recipeMock]);
  });

  it('debería inicializar favoritos vacíos si no hay datos en storage', async () => {
    storageMock.getItem.and.resolveTo(null);

    await service.loadFavorites();

    expect(service.favorites()).toEqual([]);
  });

  it('debería agregar un favorito', () => {
    service.addFavorite(recipeMock);

    expect(service.favorites()).toEqual([recipeMock]);
    expect(storageMock.setItem).toHaveBeenCalledWith('FAVORITOS', [recipeMock]);
  });

  it('no debería agregar un favorito duplicado', () => {
    service.addFavorite(recipeMock);
    service.addFavorite(recipeMock);

    expect(service.favorites().length).toBe(1);
  });

  it('debería remover un favorito', () => {
    service.addFavorite(recipeMock);
    service.removeFavorite(recipeMock.sourceId);

    expect(service.favorites()).toEqual([]);
    expect(storageMock.setItem).toHaveBeenCalledWith('FAVORITOS', []);
  });

  it('debería indicar si una receta es favorita', () => {
    service.addFavorite(recipeMock);

    const result = service.isFavorite(recipeMock.sourceId);

    expect(result).toBeTrue();
  });

  it('debería indicar false si la receta no es favorita', () => {
    const result = service.isFavorite(recipeMock.sourceId);

    expect(result).toBeFalse();
  });
});
