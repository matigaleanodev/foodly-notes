import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoPage } from './info.page';
import { Storage } from '@ionic/storage-angular';
import { IonicStorageMock } from '@shared/mocks/ionic-storage.mock';
import { AppInfoService } from './service/app-info.service';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';

export const AppInfoServiceMock = {
  getAppVersion: jasmine.createSpy().and.resolveTo('TEST_VERSION'),
  appStage: signal('TEST_STAGE'),
};

describe('InfoPage', () => {
  let component: InfoPage;
  let fixture: ComponentFixture<InfoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoPage],
      providers: [
        provideRouter([]),
        { provide: Storage, useClass: IonicStorageMock },
        { provide: AppInfoService, useValue: AppInfoServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería exponer el stage proveniente del servicio', () => {
    expect(component.appStage()).toBe('TEST_STAGE');
  });

  it('debería exponer las URLs configuradas', () => {
    expect(component.githubUrl).toContain('github.com');
    expect(component.helpUrl).toContain('github.com');
  });
});
