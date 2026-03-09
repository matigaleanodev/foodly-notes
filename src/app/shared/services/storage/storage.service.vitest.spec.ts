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

  it('removes stored values', async () => {
    await service.setItem('key', 'value');
    await service.removeItem('key');

    await expect(service.getItem('key')).resolves.toBeNull();
  });
});
