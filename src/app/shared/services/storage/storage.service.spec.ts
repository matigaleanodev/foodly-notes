import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage-angular';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  let storageInstance: {
    get: jasmine.Spy;
    set: jasmine.Spy;
    remove: jasmine.Spy;
    clear: jasmine.Spy;
  };

  const storageMock = {
    create: jasmine.createSpy(),
  };

  beforeEach(() => {
    storageInstance = {
      get: jasmine.createSpy(),
      set: jasmine.createSpy(),
      remove: jasmine.createSpy(),
      clear: jasmine.createSpy(),
    };

    storageMock.create.and.resolveTo(storageInstance);

    TestBed.configureTestingModule({
      providers: [StorageService, { provide: Storage, useValue: storageMock }],
    });

    service = TestBed.inject(StorageService);
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener un item del storage', async () => {
    const value = { test: true };
    storageInstance.get.and.resolveTo(value);

    const result = await service.getItem('key');

    expect(storageInstance.get).toHaveBeenCalledWith('key');
    expect(result).toEqual(value);
  });

  it('debería devolver null si el item no existe', async () => {
    storageInstance.get.and.resolveTo(null);

    const result = await service.getItem('missing');

    expect(result).toBeNull();
  });

  it('debería guardar un item en el storage', async () => {
    await service.setItem('key', 123);

    expect(storageInstance.set).toHaveBeenCalledWith('key', 123);
  });

  it('debería eliminar un item del storage', async () => {
    await service.removeItem('key');

    expect(storageInstance.remove).toHaveBeenCalledWith('key');
  });

  it('debería limpiar el storage', async () => {
    await service.clear();

    expect(storageInstance.clear).toHaveBeenCalled();
  });
});
