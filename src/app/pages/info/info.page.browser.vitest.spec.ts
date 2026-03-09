import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { InfoPage } from './info.page';
import { Storage } from '@ionic/storage-angular';
import { IonicStorageMock } from '@shared/mocks/ionic-storage.mock';
import { AppInfoService } from './service/app-info.service';

const appInfoServiceMock = {
  getAppVersion: vi.fn().mockResolvedValue('TEST_VERSION'),
  appStage: signal('xDesarrollo'),
};

describe('InfoPage (Vitest)', () => {
  let component: InfoPage;
  let fixture: ComponentFixture<InfoPage>;

  beforeEach(async () => {
    appInfoServiceMock.getAppVersion.mockClear();

    await TestBed.configureTestingModule({
      imports: [InfoPage],
      providers: [
        provideRouter([]),
        { provide: Storage, useClass: IonicStorageMock },
        { provide: AppInfoService, useValue: appInfoServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the page', () => {
    expect(component).toBeTruthy();
  });

  it('exposes the app stage from the service', () => {
    expect(component.appStage()).toBe('xDesarrollo');
  });

  it('exposes configured URLs', () => {
    expect(component.githubUrl).toContain('github.com');
    expect(component.helpUrl).toContain('github.com');
  });
});
