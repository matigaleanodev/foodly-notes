import { TestBed } from '@angular/core/testing';

import { FavoritesService } from './favorites.service';
import { RecipeInfo } from '@shared/models/recipe.model';
import { StorageService } from '../storage/storage.service';

describe('FavoritesService', () => {
  let service: FavoritesService;

  const storageMock = {
    getItem: jasmine.createSpy(),
    setItem: jasmine.createSpy(),
  };

  const recipeMock: RecipeInfo = {
    id: 1,
    title: 'Receta test',
  } as RecipeInfo;

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

    await service.cargarFavoritos();

    expect(storageMock.getItem).toHaveBeenCalled();
    expect(service.favoritos()).toEqual([recipeMock]);
  });

  it('debería inicializar favoritos vacíos si no hay datos en storage', async () => {
    storageMock.getItem.and.resolveTo(null);

    await service.cargarFavoritos();

    expect(service.favoritos()).toEqual([]);
  });

  it('debería agregar un favorito', () => {
    service.agregarFavorito(recipeMock);

    expect(service.favoritos()).toEqual([recipeMock]);
    expect(storageMock.setItem).toHaveBeenCalledWith('FAVORITOS', [recipeMock]);
  });

  it('no debería agregar un favorito duplicado', () => {
    service.agregarFavorito(recipeMock);
    service.agregarFavorito(recipeMock);

    expect(service.favoritos().length).toBe(1);
  });

  it('debería remover un favorito', () => {
    service.agregarFavorito(recipeMock);
    service.removerFavorito(recipeMock);

    expect(service.favoritos()).toEqual([]);
    expect(storageMock.setItem).toHaveBeenCalledWith('FAVORITOS', []);
  });

  it('debería indicar si una receta es favorita', () => {
    service.agregarFavorito(recipeMock);

    const result = service.esFavorito(recipeMock);

    expect(result).toBeTrue();
  });

  it('debería indicar false si la receta no es favorita', () => {
    const result = service.esFavorito(recipeMock);

    expect(result).toBeFalse();
  });
});
