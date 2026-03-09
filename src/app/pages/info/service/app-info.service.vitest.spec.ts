import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Capacitor } from '@capacitor/core';
import { environment } from '@env/environment';
import { AppInfoService } from './app-info.service';

describe('AppInfoService (Vitest)', () => {
  let service: AppInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppInfoService);
  });

  it('exposes the stage from the environment', () => {
    expect(service.appStage()).toBe(environment.appStage);
  });

  it('returns the environment version when the platform is not native', async () => {
    vi.spyOn(Capacitor, 'isNativePlatform').mockReturnValue(false);

    await expect(service.getAppVersion()).resolves.toBe(environment.appVersion);
  });
});
