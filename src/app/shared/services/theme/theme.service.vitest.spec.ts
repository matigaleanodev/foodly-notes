import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemeService } from './theme.service';
import { StorageService } from '../storage/storage.service';

describe('ThemeService (Vitest)', () => {
  let service: ThemeService;
  let storage: StorageServiceMock;

  const matchMediaMock = {
    matches: false,
    addEventListener: vi.fn(),
  };

  class StorageServiceMock {
    private store = new Map<string, unknown>();

    async getItem<T>(key: string): Promise<T | null> {
      return (this.store.get(key) as T | undefined) ?? null;
    }

    async setItem<T>(key: string, value: T): Promise<void> {
      this.store.set(key, value);
    }
  }

  beforeEach(async () => {
    matchMediaMock.matches = false;
    matchMediaMock.addEventListener.mockClear();

    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn().mockReturnValue(matchMediaMock),
    });

    await TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: StorageService, useClass: StorageServiceMock },
      ],
    }).compileComponents();

    storage = TestBed.inject(StorageService) as unknown as StorageServiceMock;
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    document.documentElement.classList.remove('ion-palette-dark');
  });

  it('creates the service', () => {
    expect(service).toBeTruthy();
  });

  it('initializes with system theme when storage is empty', () => {
    expect(service.currentTheme()).toBe('system');
  });

  it('applies dark theme when explicitly set', () => {
    service.setTheme('dark');

    expect(service.currentTheme()).toBe('dark');
    expect(
      document.documentElement.classList.contains('ion-palette-dark'),
    ).toBe(true);
  });

  it('applies light theme when explicitly set', () => {
    service.setTheme('light');

    expect(service.currentTheme()).toBe('light');
    expect(
      document.documentElement.classList.contains('ion-palette-dark'),
    ).toBe(false);
  });

  it('stores the theme when it changes', async () => {
    const spy = vi.spyOn(storage, 'setItem');

    service.setTheme('dark');

    expect(spy).toHaveBeenCalledWith('theme', 'dark');
  });
});
