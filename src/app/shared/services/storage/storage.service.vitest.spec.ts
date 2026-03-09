import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage-angular';
import { describe, expect, it, beforeEach } from 'vitest';

import { IonicStorageMock } from '@shared/mocks/ionic-storage.mock';
import { StorageService } from './storage.service';

describe('StorageService (Vitest)', () => {
  let service: StorageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        StorageService,
        { provide: Storage, useClass: IonicStorageMock },
      ],
    }).compileComponents();

    service = TestBed.inject(StorageService);
  });

  it('persists and retrieves values', async () => {
    await service.setItem('key', 'value');

    await expect(service.getItem('key')).resolves.toBe('value');
  });

  it('returns null when the key does not exist', async () => {
    await expect(service.getItem('missing-key')).resolves.toBeNull();
  });

  it('removes stored values', async () => {
    await service.setItem('key', 'value');
    await service.removeItem('key');

    await expect(service.getItem('key')).resolves.toBeNull();
  });

  it('clears all stored values', async () => {
    await service.setItem('a', 1);
    await service.setItem('b', 2);

    await service.clear();

    await expect(service.getItem('a')).resolves.toBeNull();
    await expect(service.getItem('b')).resolves.toBeNull();
  });
});
